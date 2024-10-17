import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import PinManagement from './PinManagement';
import RfidManagement from './RfidManagement';
import ScheduleManagement from './ScheduleManagement';
import { User, Apartment } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';
import UserForm from './UserForm';

interface UserManagementProps { isActive: boolean; }

const UserManagement: React.FC<UserManagementProps> = ({ isActive }) => {
    const { token, user } = useAuth();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showPinModal, setShowPinModal] = useState(false);
    const [showRfidModal, setShowRfidModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', apartment_number: '', role: 'apartment_admin' });
    const [error, setError] = useState('');
    const [modalError, setModalError] = useState('');
    const [apartments, setApartments] = useState([]);
    const [showGuestScheduleModal, setShowGuestScheduleModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [success, setSuccess] = useState('');

    const fetchApartments = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/apartments`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setApartments(response.data);
        } catch (error) {
            console.error('Failed to fetch apartments:', error);
            setError('Failed to fetch apartments. Please try again.');
        }
    }, [token]);

    const fetchUsers = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(user?.role === 'admin' ? response.data : response.data.filter((u: User) => u.apartment?.number === user?.apartment?.number));
        } catch (error) {
            console.error('Failed to fetch users:', error);
            if (error instanceof Error && 'response' in error) {
                const axiosError = error as { response?: { data?: { error?: { detail?: string } } } };
                if (axiosError.response?.data?.error?.detail) {
                    setError(axiosError.response.data.error.detail);
                } else {
                    setError('Failed to fetch users. Please try again.');
                }
            } else {
                setError('Failed to fetch users. Please try again.');
            }
        }
    }, [token, user?.role, user?.apartment?.number]);

    useEffect(() => {
        fetchApartments();
        fetchUsers();
    }, [fetchApartments, fetchUsers]);

    useEffect(() => {
        if (isActive) {
            fetchUsers();
        }
    }, [isActive, fetchUsers]);

    const handlePinManagement = (user: User) => {
        setSelectedUser(user);
        setShowPinModal(true);
    };

    const handleRfidManagement = (user: User) => {
        setSelectedUser(user);
        setShowRfidModal(true);
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        setNewUser({ name: '', email: '', apartment_number: '', role: 'apartment_admin' });
        fetchApartments(); // Refresh the apartments list
        setShowUserModal(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setShowUserModal(true);
    };

    const handleGuestScheduleManagement = (user: User) => {
        setSelectedUser(user);
        setShowGuestScheduleModal(true);
    };

    const handleDeleteUser = (user: User) => {
        setUserToDelete(user);
        setShowDeleteConfirmation(true);
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/users/${userToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setShowDeleteConfirmation(false);
            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
            if (error instanceof Error && 'response' in error) {
                const axiosError = error as { response?: { data?: { error?: { detail?: string } } } };
                if (axiosError.response?.data?.error?.detail) {
                    setError(axiosError.response.data.error.detail);
                } else {
                    setError('Failed to delete user. Please try again.');
                }
            } else {
                setError('Failed to delete user. Please try again.');
            }
        }
    };

    const handleUserSuccess = (updatedUser: User) => {
        setShowUserModal(false);
        fetchUsers();
        setSuccess(selectedUser ? 'User updated successfully' : 'User added successfully');
    };

    return (
        <div>
            <h3>User Management</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Button variant="primary" onClick={handleAddUser} className="mb-3">Add New User</Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Apartment</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u: User) => (
                        <tr key={u.id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                            <td>{u.apartment.number}</td>
                            <td>
                                <Button variant="primary" onClick={() => handlePinManagement(u)} className="me-2">Manage PINs</Button>
                                <Button variant="secondary" onClick={() => handleRfidManagement(u)} className="me-2">Manage RFIDs</Button>
                                {u.role === 'guest' && (
                                    <Button variant="info" onClick={() => handleGuestScheduleManagement(u)}>Manage Schedule</Button>
                                )}
                                <Button variant="danger" onClick={() => handleDeleteUser(u)} className="me-2">Delete</Button>
                                <Button variant="primary" onClick={() => handleEditUser(u)} className="me-2">Edit</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showPinModal} onHide={() => setShowPinModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Manage PINs for {selectedUser?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser ? (
                        <PinManagement user={selectedUser} />
                    ) : (
                        <p>No user selected</p>
                    )}
                </Modal.Body>
            </Modal>

            <Modal show={showRfidModal} onHide={() => setShowRfidModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Manage RFID for {selectedUser?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser ? (
                        <RfidManagement user={selectedUser} />
                    ) : (
                        <p>No user selected</p>
                    )}
                </Modal.Body>
            </Modal>

            <Modal show={showUserModal} onHide={() => setShowUserModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedUser ? 'Edit User' : 'Add New User'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <UserForm
                        user={selectedUser}
                        onSuccess={handleUserSuccess}
                        isAdmin={true}
                    />
                </Modal.Body>
            </Modal>

            <Modal show={showGuestScheduleModal} onHide={() => setShowGuestScheduleModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Manage Guest Schedule for {selectedUser?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser ? (
                        <ScheduleManagement user={selectedUser} />
                    ) : (
                        <p>No user selected</p>
                    )}
                </Modal.Body>
            </Modal>

            <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm User Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the user {userToDelete?.name}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteUser}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserManagement;
