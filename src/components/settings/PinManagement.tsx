import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const PinManagement = ({ user, token }) => {
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
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pin/list/user`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { user_id: user.id },
            });
            setPins(response.data);
        } catch (error) {
            console.error('Failed to fetch PINs:', error);
            setError('Failed to fetch PINs. Please try again.');
        }
    };

    const handleAddPin = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pin/create`, {
                user_id: user.id,
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

    const handleDeletePin = async (pinId) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/pin/delete/${pinId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccess('PIN deleted successfully');
            fetchPins();
        } catch (error) {
            console.error('Failed to delete PIN:', error);
            setError('Failed to delete PIN. Please try again.');
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
                    {pins.map((pin) => (
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