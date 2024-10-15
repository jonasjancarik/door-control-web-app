import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Form, Alert, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import { User, RecurringSchedule, OneTimeAccess } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';

interface GuestScheduleManagementProps {
    user: User;
}

const ScheduleManagement: React.FC<GuestScheduleManagementProps> = ({ user }) => {
    const { token } = useAuth();
    const [recurringSchedules, setRecurringSchedules] = useState([]);
    const [oneTimeAccess, setOneTimeAccess] = useState([]);
    const [newRecurringSchedule, setNewRecurringSchedule] = useState({ day_of_week: 0, start_time: '', end_time: '' });
    const [newOneTimeAccess, setNewOneTimeAccess] = useState({ access_date: '', start_time: '', end_time: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchSchedules = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/guests/${user.id}/schedules`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRecurringSchedules(response.data.recurring_schedules);
            setOneTimeAccess(response.data.one_time_access);
        } catch (error) {
            console.error('Failed to fetch guest schedules:', error);
            setError('Failed to fetch guest schedules. Please try again.');
        }
    }, [user, token]);

    useEffect(() => {
        fetchSchedules();
    }, [user, fetchSchedules]);

    const handleAddRecurringSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/guests/${user.id}/recurring-schedules`, {
                ...newRecurringSchedule
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccess('Recurring schedule added successfully');
            fetchSchedules();
            setNewRecurringSchedule({ day_of_week: 0, start_time: '', end_time: '' });
        } catch (error) {
            console.error('Failed to add recurring schedule:', error);
            setError('Failed to add recurring schedule. Please try again.');
        }
    };

    const handleAddOneTimeAccess = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/guests/${user.id}/one-time-accesses`, {
                ...newOneTimeAccess
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccess('One-time access added successfully');
            fetchSchedules();
            setNewOneTimeAccess({ access_date: '', start_time: '', end_time: '' });
        } catch (error) {
            console.error('Failed to add one-time access:', error);
            setError('Failed to add one-time access. Please try again.');
        }
    };

    const handleRemoveRecurringSchedule = async (scheduleId: RecurringSchedule['id']) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/guests/recurring-schedules/${scheduleId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccess('Recurring schedule removed successfully');
            fetchSchedules();
        } catch (error) {
            console.error('Failed to remove recurring schedule:', error);
            setError('Failed to remove recurring schedule. Please try again.');
        }
    };

    const handleRemoveOneTimeAccess = async (accessId: OneTimeAccess['id']) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/guests/one-time-accesses/${accessId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccess('One-time access removed successfully');
            fetchSchedules();
        } catch (error) {
            console.error('Failed to remove one-time access:', error);
            setError('Failed to remove one-time access. Please try again.');
        }
    };

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Tabs defaultActiveKey="recurring" id="guest-schedule-tabs">
                <Tab eventKey="recurring" title="Recurring Schedule">
                    <Form onSubmit={handleAddRecurringSchedule} className="mb-3">
                        <Form.Group controlId="dayOfWeek">
                            <Form.Label>Day of Week</Form.Label>
                            <Form.Control
                                as="select"
                                value={newRecurringSchedule.day_of_week}
                                onChange={(e) => setNewRecurringSchedule({ ...newRecurringSchedule, day_of_week: parseInt(e.target.value) })}
                            >
                                {daysOfWeek.map((day, index) => (
                                    <option key={index} value={index}>{day}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="startTime">
                            <Form.Label>Start Time</Form.Label>
                            <Form.Control
                                type="time"
                                value={newRecurringSchedule.start_time}
                                onChange={(e) => setNewRecurringSchedule({ ...newRecurringSchedule, start_time: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="endTime">
                            <Form.Label>End Time</Form.Label>
                            <Form.Control
                                type="time"
                                value={newRecurringSchedule.end_time}
                                onChange={(e) => setNewRecurringSchedule({ ...newRecurringSchedule, end_time: e.target.value })}
                            />
                        </Form.Group>
                        <Button type="submit" className="mt-2">Add Recurring Schedule</Button>
                    </Form>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Day of Week</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recurringSchedules.map((schedule: RecurringSchedule) => (
                                <tr key={schedule.id}>
                                    <td>{daysOfWeek[schedule.day_of_week]}</td>
                                    <td>{schedule.start_time}</td>
                                    <td>{schedule.end_time}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => handleRemoveRecurringSchedule(schedule.id)}>Remove</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="oneTime" title="One-Time Access">
                    <Form onSubmit={handleAddOneTimeAccess} className="mb-3">
                        <Form.Group controlId="accessDate">
                            <Form.Label>Access Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={newOneTimeAccess.access_date}
                                onChange={(e) => setNewOneTimeAccess({ ...newOneTimeAccess, access_date: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="startTime">
                            <Form.Label>Start Time</Form.Label>
                            <Form.Control
                                type="time"
                                value={newOneTimeAccess.start_time}
                                onChange={(e) => setNewOneTimeAccess({ ...newOneTimeAccess, start_time: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="endTime">
                            <Form.Label>End Time</Form.Label>
                            <Form.Control
                                type="time"
                                value={newOneTimeAccess.end_time}
                                onChange={(e) => setNewOneTimeAccess({ ...newOneTimeAccess, end_time: e.target.value })}
                            />
                        </Form.Group>
                        <Button type="submit" className="mt-2">Add One-Time Access</Button>
                    </Form>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Access Date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {oneTimeAccess.map((access: OneTimeAccess) => (
                                <tr key={access.id}>
                                    <td>{access.access_date}</td>
                                    <td>{access.start_time}</td>
                                    <td>{access.end_time}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => handleRemoveOneTimeAccess(access.id)}>Remove</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>
        </div>
    );
};

export default ScheduleManagement;
