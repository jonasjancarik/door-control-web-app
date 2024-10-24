import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Alert, Card } from 'react-bootstrap';
import axios from 'axios';
import { User, Apartment } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';

interface ApartmentManagementProps { }

const ApartmentManagement: React.FC<ApartmentManagementProps> = () => {
    const { token, user } = useAuth();
    const [apartments, setApartments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
    const [newApartment, setNewApartment] = useState({ number: '', description: '' });
    const [error, setError] = useState('');
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

    useEffect(() => {
        fetchApartments();
    }, [fetchApartments]);


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
            <div className="d-flex flex-wrap">
                {apartments.map((apartment: Apartment) => (
                    <Card key={apartment.id} className="m-2" style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title>Apartment {apartment.number}</Card.Title>
                            <Card.Text>
                                {apartment.description}
                            </Card.Text>
                            <div className="d-flex flex-wrap">
                                <Button variant="outline-info" size="sm" onClick={() => handleEditApartment(apartment)} className="me-2 mb-2">Edit</Button>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteApartment(apartment.id)} className="me-2 mb-2">Delete</Button>
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>

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
