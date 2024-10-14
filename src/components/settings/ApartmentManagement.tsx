import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { User, Apartment } from '@/types/types';

interface ApartmentManagementProps {
    user: User;
    token: string;
}

const ApartmentManagement: React.FC<ApartmentManagementProps> = ({ user, token }) => {
    const [apartments, setApartments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
    const [newApartment, setNewApartment] = useState({ number: '', description: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchApartments();
    }, []);

    const fetchApartments = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/apartments`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setApartments(response.data);
        } catch (error) {
            console.error('Failed to fetch apartments:', error);
            setError('Failed to fetch apartments. Please try again.');
        }
    };

    const handleAddApartment = () => {
        setSelectedApartment(null);
        setNewApartment({ number: '', description: '' });
        setShowModal(true);
    };

    const handleEditApartment = (apartment: Apartment) => {
        setSelectedApartment(apartment);
        setNewApartment({ number: apartment.number, description: apartment.description });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (selectedApartment) {
                await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/apartments/${selectedApartment.id}`, newApartment, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSuccess('Apartment updated successfully');
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/apartments`, newApartment, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSuccess('Apartment added successfully');
            }
            setShowModal(false);
            fetchApartments();
        } catch (error) {
            console.error('Failed to save apartment:', error);
            setError('Failed to save apartment. Please try again.');
        }
    };

    const handleDeleteApartment = async (apartmentId: Apartment['id']) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/apartments/${apartmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccess('Apartment deleted successfully');
            fetchApartments();
        } catch (error) {
            console.error('Failed to delete apartment:', error);
            setError('Failed to delete apartment. Please try again.');
        }
    };

    return (
        <div>
            <h3>Apartment Management</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Button variant="primary" onClick={handleAddApartment} className="mb-3">Add New Apartment</Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Apartment Number</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {apartments.map((apartment: Apartment) => (
                        <tr key={apartment.id}>
                            <td>{apartment.number}</td>
                            <td>{apartment.description}</td>
                            <td>
                                <Button variant="info" onClick={() => handleEditApartment(apartment)} className="me-2">Edit</Button>
                                <Button variant="danger" onClick={() => handleDeleteApartment(apartment.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedApartment ? 'Edit Apartment' : 'Add New Apartment'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Apartment Number</Form.Label>
                            <Form.Control
                                type="text"
                                value={newApartment.number}
                                onChange={(e) => setNewApartment({ ...newApartment, number: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newApartment.description}
                                onChange={(e) => setNewApartment({ ...newApartment, description: e.target.value })}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {selectedApartment ? 'Update Apartment' : 'Add Apartment'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ApartmentManagement;
