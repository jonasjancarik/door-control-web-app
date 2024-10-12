import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const RfidManagement = ({ user, token }) => {
    const [rfidTags, setRfidTags] = useState([]);
    const [newRfidUuid, setNewRfidUuid] = useState('');
    const [newRfidLabel, setNewRfidLabel] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isReading, setIsReading] = useState(false);

    useEffect(() => {
        fetchRfidTags();
    }, [user]);

    const fetchRfidTags = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rfid/list/user`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { user_id: user.id },
            });
            setRfidTags(response.data);
        } catch (error) {
            console.error('Failed to fetch RFID tags:', error);
            setError('Failed to fetch RFID tags. Please try again.');
        }
    };

    const handleAddRfid = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/rfid/create`, {
                user_id: user.id,
                uuid: newRfidUuid,
                label: newRfidLabel,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNewRfidUuid('');
            setNewRfidLabel('');
            setSuccess('RFID tag added successfully');
            fetchRfidTags();
        } catch (error) {
            console.error('Failed to add RFID tag:', error);
            setError('Failed to add RFID tag. Please try again.');
        }
    };

    const handleDeleteRfid = async (rfidId) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/rfid/delete/${rfidId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccess('RFID tag deleted successfully');
            fetchRfidTags();
        } catch (error) {
            console.error('Failed to delete RFID tag:', error);
            setError('Failed to delete RFID tag. Please try again.');
        }
    };

    const handleReadRfid = async () => {
        setIsReading(true);
        setError('');
        setSuccess('');
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rfid/read`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { timeout: 30 },
            });
            setNewRfidUuid(response.data.uuid);
            setSuccess('RFID tag read successfully');
        } catch (error) {
            console.error('Failed to read RFID tag:', error);
            setError('Failed to read RFID tag. Please try again.');
        } finally {
            setIsReading(false);
        }
    };

    return (
        <div>
            <h4>RFID Tags for {user.name}</h4>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form className="mb-3" onSubmit={handleAddRfid}>
                <Form.Group className="mb-2">
                    <Form.Label>New RFID UUID</Form.Label>
                    <div className="d-flex">
                        <Form.Control
                            type="text"
                            value={newRfidUuid}
                            onChange={(e) => setNewRfidUuid(e.target.value)}
                            placeholder="Enter RFID UUID"
                        />
                        <Button 
                            variant="secondary" 
                            onClick={handleReadRfid} 
                            disabled={isReading}
                            className="ms-2"
                        >
                            {isReading ? <Spinner animation="border" size="sm" /> : 'Read RFID'}
                        </Button>
                    </div>
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>RFID Label</Form.Label>
                    <Form.Control
                        type="text"
                        value={newRfidLabel}
                        onChange={(e) => setNewRfidLabel(e.target.value)}
                        placeholder="Enter RFID label"
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Add RFID Tag</Button>
            </Form>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Last Four Digits</th>
                        <th>Label</th>
                        <th>Created At</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {rfidTags.map((rfid) => (
                        <tr key={rfid.id}>
                            <td>...{rfid.last_four_digits}</td>
                            <td>{rfid.label}</td>
                            <td>{new Date(rfid.created_at).toLocaleString()}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleDeleteRfid(rfid.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default RfidManagement;