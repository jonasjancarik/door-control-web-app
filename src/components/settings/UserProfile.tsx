import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { User } from '@/types/types';

interface UserProfileProps {
    user: User;
    token: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, token }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [apartmentNumber, setApartmentNumber] = useState(user.apartment_number);
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('');

        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`,
                { name, email, apartment_number: apartmentNumber },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                setStatus('Profile updated successfully');
            }
        } catch (error) {
            setStatus('Failed to update profile');
            console.error('Error updating profile:', error);
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
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Apartment Number</Form.Label>
                <Form.Control
                    type="text"
                    value={apartmentNumber}
                    onChange={(e) => setApartmentNumber(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Control
                    type="text"
                    value={user.role}
                    disabled
                />
            </Form.Group>
            <Button variant="primary" type="submit">
                Update Profile
            </Button>
            {status && <Alert className="mt-3" variant={status.includes('successfully') ? 'success' : 'danger'}>{status}</Alert>}
        </Form>
    );
};

export default UserProfile;
