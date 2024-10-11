import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import PinManagement from './PinManagement';
import RfidManagement from './RfidManagement';

const UserManagement = ({ user, token }) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showPinModal, setShowPinModal] = useState(false);
    const [showRfidModal, setShowRfidModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', apartment_number: '', role: 'apartment_admin' });
    const [error, setError] = useState('');
    const [modalError, setModalError] = useState('');
    const [apartments, setApartments] = useState([]);

    const fetchApartments = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/apartments/list`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setApartments(response.data);
        } catch (error) {
            console.error('Failed to fetch apartments:', error);
            setError('Failed to fetch apartments. Please try again.');
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchApartments();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/list`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(user.admin ? response.data : response.data.filter(u => u.apartment_number === user.apartment_number));
        } catch (error) {
            console.error('Failed to fetch users:', error);
            if (error.response && error.response.data && error.response.data.detail) {
                setError(error.response.data.detail);
            } else {
                setError('Failed to fetch users. Please try again.');
            }
        }
    };

    const handlePinManagement = (user) => {
        setSelectedUser(user);
        setShowPinModal(true);
    };

    const handleRfidManagement = (user) => {
        setSelectedUser(user);
        setShowRfidModal(true);
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        setNewUser({ name: '', email: '', apartment_number: '', role: 'apartment_admin' });
        setShowUserModal(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setNewUser({ ...user });
        setShowUserModal(true);
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setModalError('');
        try {
            if (selectedUser) {
                await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/update/${selectedUser.id}`, newUser, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/create`, newUser, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            setShowUserModal(false);
            fetchUsers();
        } catch (error) {
            console.error('Failed to save user:', error);
            if (error.response && error.response.data && error.response.data.detail) {
                setModalError(error.response.data.detail);
            } else {
                setModalError('Failed to save user. Please try again.');
            }
        }
    };

    return (
        <div>
            <h3>User Management</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button variant="primary" onClick={handleAddUser} className="mb-3">Add New User</Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Apartment</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.apartment_number}</td>
                            <td>
                                <Button variant="primary" onClick={() => handlePinManagement(u)}>Manage PINs</Button>
                                <Button variant="secondary" onClick={() => handleRfidManagement(u)}>Manage RFID</Button>
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
                    <PinManagement user={selectedUser} token={token} />
                </Modal.Body>
            </Modal>

            <Modal show={showRfidModal} onHide={() => setShowRfidModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Manage RFID for {selectedUser?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RfidManagement user={selectedUser} token={token} />
                </Modal.Body>
            </Modal>

            <Modal show={showUserModal} onHide={() => setShowUserModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedUser ? 'Edit User' : 'Add New User'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalError && <Alert variant="danger">{modalError}</Alert>}
                    <Form onSubmit={handleUserSubmit}>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="apartmentNumber">
                            <Form.Label>Apartment Number</Form.Label>
                            <Form.Select
                                value={newUser.apartment_number}
                                onChange={(e) => setNewUser({ ...newUser, apartment_number: e.target.value })}
                                required
                            >
                                <option value="">Select an apartment</option>
                                {apartments.map((apartment) => (
                                    <option key={apartment.id} value={apartment.number}>
                                        {apartment.number}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="role">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                required
                            >
                                <option value="apartment_admin">Apartment Admin</option>
                                <option value="guest">Guest</option>
                                {user.role === 'admin' && <option value="admin">Admin</option>}
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" type="submit">Submit</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default UserManagement;
