import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { User, Apartment } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';

interface UserProfileProps { }

const UserProfile: React.FC<UserProfileProps> = () => {
    const { token, logout, user, updateUser } = useAuth();
    const router = useRouter();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [apartmentNumber, setApartmentNumber] = useState(user?.apartment?.number || '');  // todo!: why would apartment be undefined?
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('');

        if (!user) {
            setStatus('User not logged in');
            return;
        }

        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`,
                { name, email, apartment_number: apartmentNumber },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                setStatus('Profile updated successfully');
                // Fetch the updated user data and update the global user object
                const updatedUserResponse = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                updateUser(updatedUserResponse.data);
            }
        } catch (error) {
            setStatus('Failed to update profile');
            console.error('Error updating profile:', error);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/');
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
                    required
                />
            </Form.Group>
            <Form.Group controlId="exampleSelect" className="mb-3">
                <Form.Label>Select an option</Form.Label>
                <Form.Control as="select" aria-label="Select an option" value={apartmentNumber} onChange={(e) => setApartmentNumber(e.target.value)} required>
                    <option value="">Select an apartment</option>
                    {apartments.map((apartment: Apartment) => (
                        <option 
                            key={apartment.id} 
                            value={apartment.number}
                            selected={apartment.number === user?.apartment?.number}
                        >
                            {apartment.number}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Control
                    type="text"
                    value={user?.role || ''}
                    disabled
                />
            </Form.Group>
            <Button variant="primary" type="submit" className="me-2">
                Update Profile
            </Button>
            <Button variant="danger" onClick={handleLogout}>
                Logout
            </Button>
            {status && <Alert className="mt-3" variant={status.includes('successfully') ? 'success' : 'danger'}>{status}</Alert>}
        </Form>
    );
};

export default UserProfile;
