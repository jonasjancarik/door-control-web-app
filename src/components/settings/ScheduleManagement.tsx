import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Form, Alert, Tabs, Tab, InputGroup } from 'react-bootstrap';
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
    const [newRecurringSchedule, setNewRecurringSchedule] = useState({ 
        day_of_week: 0, 
        start_time: '09:00',
        end_time: '17:00'
    });
    const [newOneTimeAccess, setNewOneTimeAccess] = useState({ 
        start_date: '', 
        end_date: '', 
        start_time: '09:00',
        end_time: '17:00'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [endDateManuallySet, setEndDateManuallySet] = useState(false);

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
            // Send times in HH:mm format
            const formattedSchedule = {
                day_of_week: newRecurringSchedule.day_of_week,
                start_time: newRecurringSchedule.start_time,  // Already in HH:mm format
                end_time: newRecurringSchedule.end_time      // Already in HH:mm format
            };
            
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/guests/${user.id}/recurring-schedules`,
                formattedSchedule,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess('Recurring schedule added successfully');
            fetchSchedules();
            setNewRecurringSchedule({ day_of_week: 0, start_time: '09:00', end_time: '17:00' });
        } catch (error) {
            console.error('Failed to add recurring schedule:', error);
            setError('Failed to add recurring schedule. Please try again.');
        }
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDate = e.target.value;
        setNewOneTimeAccess(prev => ({
            ...prev,
            start_date: newStartDate,
            // Only set end_date if it hasn't been manually modified
            end_date: !endDateManuallySet ? newStartDate : prev.end_date
        }));
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDateManuallySet(true);
        setNewOneTimeAccess(prev => ({
            ...prev,
            end_date: e.target.value
        }));
    };

    const handleAddOneTimeAccess = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Send times in HH:mm format
            const formattedAccess = {
                start_date: newOneTimeAccess.start_date,
                end_date: newOneTimeAccess.end_date,
                start_time: newOneTimeAccess.start_time,  // Already in HH:mm format
                end_time: newOneTimeAccess.end_time      // Already in HH:mm format
            };

            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/guests/${user.id}/one-time-accesses`,
                formattedAccess,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess('One-time access added successfully');
            fetchSchedules();
            setEndDateManuallySet(false);
            setNewOneTimeAccess({ start_date: '', end_date: '', start_time: '09:00', end_time: '17:00' });
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

    // Helper function to format time from HH:mm:ss to HH:mm
    const formatTime = (time: string) => {
        return time.substring(0, 5); // Takes only HH:mm part
    };

    return (
        <div>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Tabs defaultActiveKey="recurring" id="guest-schedule-tabs">
                <Tab eventKey="recurring" title="Recurring Schedule">
                    <Form onSubmit={handleAddRecurringSchedule} className="my-3">
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Day of Week</InputGroup.Text>
                            <Form.Select
                                value={newRecurringSchedule.day_of_week}
                                onChange={(e) => setNewRecurringSchedule({ ...newRecurringSchedule, day_of_week: parseInt(e.target.value) })}
                                aria-label="Day of Week"
                            >
                                {daysOfWeek.map((day, index) => (
                                    <option key={index} value={index}>{day}</option>
                                ))}
                            </Form.Select>
                        </InputGroup>

                        <InputGroup className="mb-3">
                            <InputGroup.Text>Time Range</InputGroup.Text>
                            <Form.Control
                                type="time"
                                value={newRecurringSchedule.start_time}
                                onChange={(e) => setNewRecurringSchedule({ ...newRecurringSchedule, start_time: e.target.value })}
                                aria-label="Start Time"
                            />
                            <InputGroup.Text>to</InputGroup.Text>
                            <Form.Control
                                type="time"
                                value={newRecurringSchedule.end_time}
                                onChange={(e) => setNewRecurringSchedule({ ...newRecurringSchedule, end_time: e.target.value })}
                                aria-label="End Time"
                            />
                        </InputGroup>

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
                                    <td>{formatTime(schedule.start_time)}</td>
                                    <td>{formatTime(schedule.end_time)}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => handleRemoveRecurringSchedule(schedule.id)}>Remove</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="oneTime" title="One-Time Access">
                    <Form onSubmit={handleAddOneTimeAccess} className="my-3">
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Date</InputGroup.Text>
                            <Form.Control
                                type="date"
                                value={newOneTimeAccess.start_date}
                                onChange={handleStartDateChange}
                                aria-label="Start Date"
                            />
                            <InputGroup.Text>to</InputGroup.Text>
                            <Form.Control
                                type="date"
                                value={newOneTimeAccess.end_date}
                                onChange={handleEndDateChange}
                                aria-label="End Date"
                            />
                        </InputGroup>

                        <InputGroup className="mb-3">
                            <InputGroup.Text>Time Range</InputGroup.Text>
                            <Form.Control
                                type="time"
                                value={newOneTimeAccess.start_time}
                                onChange={(e) => setNewOneTimeAccess({ ...newOneTimeAccess, start_time: e.target.value })}
                                aria-label="Start Time"
                            />
                            <InputGroup.Text>to</InputGroup.Text>
                            <Form.Control
                                type="time"
                                value={newOneTimeAccess.end_time}
                                onChange={(e) => setNewOneTimeAccess({ ...newOneTimeAccess, end_time: e.target.value })}
                                aria-label="End Time"
                            />
                        </InputGroup>

                        <Button 
                            type="submit" 
                            className="mt-2" 
                            disabled={!newOneTimeAccess.start_date || !newOneTimeAccess.end_date}
                        >
                            Add One-Time Access
                        </Button>
                    </Form>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {oneTimeAccess.map((access: OneTimeAccess) => (
                                <tr key={access.id}>
                                    <td>{access.start_date}</td>
                                    <td>{access.end_date}</td>
                                    <td>{formatTime(access.start_time)}</td>
                                    <td>{formatTime(access.end_time)}</td>
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
