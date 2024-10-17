import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { User, PIN } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';

interface PinManagementProps {
    user: User;
}

const PinManagement: React.FC<PinManagementProps> = ({ user }) => {
    const { token } = useAuth();
    const [pins, setPins] = useState([]);
    const [newPin, setNewPin] = useState('');
    const [newPinLabel, setNewPinLabel] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchPins();
    }, [user]);

    const fetchPins = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}/pins`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPins(response.data);
        } catch (error) {
            console.error('Failed to fetch PINs:', error);
            setError('Failed to fetch PINs. Please try again.');
        }
    };

    const handleAddPin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pins`, {
                pin: newPin,
                label: newPinLabel,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNewPin('');
            setNewPinLabel('');
            setSuccess('PIN added successfully');
            fetchPins();
        } catch (error) {
            console.error('Failed to add PIN:', error);
            setError('Failed to add PIN. Please try again.');
        }
    };

    const handleDeletePin = async (pinId: PIN['id']) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/pins/${pinId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccess('PIN deleted successfully');
            fetchPins();
        } catch (error) {
            console.error('Failed to delete PIN:', error);
            if (axios.isAxiosError(error) && error.response) {
                setError(`Failed to delete PIN: ${error.response.data.detail}`);
            } else {
                setError('Failed to delete PIN. Please try again.');
            }
        }
    };

    return (
        <div>
            <h4>PINs for {user.name}</h4>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form className="mb-3" onSubmit={handleAddPin}>
                <Form.Group className="mb-2">
                    <Form.Label>New PIN</Form.Label>
                    <Form.Control
                        type="text"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        placeholder="Enter 4-digit PIN"
                    />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>PIN Label</Form.Label>
                    <Form.Control
                        type="text"
                        value={newPinLabel}
                        onChange={(e) => setNewPinLabel(e.target.value)}
                        placeholder="Enter PIN label"
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Add PIN</Button>
            </Form>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>PIN</th>
                        <th>Label</th>
                        <th>Created At</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {pins.map((pin: PIN) => (
                        <tr key={pin.id}>
                            <td>****</td>
                            <td>{pin.label}</td>
                            <td>{new Date(pin.created_at).toLocaleString()}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleDeletePin(pin.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default PinManagement;
