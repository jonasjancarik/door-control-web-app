import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { User, Apartment } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';

interface UserFormProps {
    targetUser: User | null;
    onSuccess: (updatedUser: User) => void;
    isAdmin?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ targetUser, onSuccess, isAdmin = false }) => {
    const { token, user } = useAuth();
    const [name, setName] = useState(targetUser?.name || '');
    const [email, setEmail] = useState(targetUser?.email || '');
    const [apartmentNumber, setApartmentNumber] = useState(targetUser?.apartment?.number || user?.apartment?.number || '');
    const [role, setRole] = useState(targetUser?.role || '');
    const [status, setStatus] = useState('');
    const [apartments, setApartments] = useState<Apartment[]>([]);

    const fetchApartments = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/apartments`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setApartments(response.data);
        } catch (error) {
            console.error('Failed to fetch apartments:', error);
            setStatus('Failed to fetch apartments. Please try again.');
        }
    }, [token]);

    useEffect(() => {
        fetchApartments();
    }, [fetchApartments]);

    useEffect(() => {
        if (targetUser) {
            setName(targetUser.name);
            if (targetUser.email) {
                setEmail(targetUser.email);
            }
            setApartmentNumber(targetUser.apartment?.number || '');
            setRole(targetUser.role);
        } else if (!isAdmin) {
            // For new users, set the apartment number to the current user's apartment
            setApartmentNumber(user?.apartment?.number || '');
        }
    }, [targetUser, user, isAdmin]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('');

        try {
            const updatedUserData = { name, email, apartment: { number: apartmentNumber }, role };
            let response;

            if (targetUser) {
                response = await axios.put(
                    `${process.env.NEXT_PUBLIC_API_URL}/users/${targetUser.id}`,
                    updatedUserData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/users`,
                    updatedUserData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            if (response.status === 200 || response.status === 201) {
                setStatus('User updated successfully');
                onSuccess(response.data.user);
            } else {
                throw new Error('Failed to update user');
            }
        } catch (error) {
            setStatus('Failed to update user');
            console.error('Error updating user:', error);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>
            <Form.Group controlId="apartmentSelect" className="mb-3">
                <Form.Label>Apartment</Form.Label>
                <Form.Control
                    as="select"
                    value={apartmentNumber}
                    onChange={(e) => setApartmentNumber(e.target.value)}
                    required
                    disabled={!isAdmin}
                    aria-label="Select apartment"
                >
                    <option value="">Select an apartment</option>
                    {apartments.map((apartment: Apartment) => (
                        <option
                            key={apartment.id}
                            value={apartment.number}
                        >
                            {apartment.number}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
            {isAdmin && (
                <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Control
                        as="select"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        aria-label="Select user role"
                    >
                        <option value="apartment_admin">Apartment Admin</option>
                        <option value="guest">Guest</option>
                        <option value="admin">Admin</option>
                    </Form.Control>
                </Form.Group>
            )}
            <Button variant="primary" type="submit">
                {targetUser ? 'Update User' : 'Add User'}
            </Button>
            {status && <Alert className="mt-3" variant={status.includes('successfully') ? 'success' : 'danger'}>{status}</Alert>}
        </Form>
    );
};

export default UserForm;
