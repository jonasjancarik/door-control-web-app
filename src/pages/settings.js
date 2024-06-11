import { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import AppNavbar from '../components/Navbar';

const Settings = () => {
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [isGuest, setIsGuest] = useState(false);
    const [pin, setPin] = useState('');
    const [pinLabel, setPinLabel] = useState('');
    const [userStatus, setUserStatus] = useState('');
    const [pinStatus, setPinStatus] = useState('');
    const [user, setUser] = useState(null);
    const [token, setToken] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const storedToken = localStorage.getItem('token');
            if (storedUser && storedToken) {
                setUser(storedUser);
                setToken(storedToken);
            }
        }
    }, []);

    const handleUserSubmit = async () => {
        if (!userEmail) {
            setUserStatus('Please enter an email address.');
            return;
        }

        // check if the email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // todo: use email-validator instead
        if (!emailRegex.test(userEmail)) {
            setUserStatus('Please enter a valid email address.');
            return;
        }

        const newUser = { email: userEmail, name: userName || userEmail, guest: isGuest };

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/create`, newUser, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                setUserStatus('User added.');
            } else {
                setUserStatus('Failed to add user.');
            }
        } catch (error) {
            setUserStatus('Failed to connect to the API.');
        }
    };

    const handlePinSubmit = async () => {
        if (!pin || pin.length !== 4 || isNaN(pin)) {
            setPinStatus('PIN must be a 4-digit number.');
            return;
        }

        const securePins = [
            "1234", "0000", "1111", "2222", "3333", "4444",
            "5555", "6666", "7777", "8888", "9999"
        ];

        if (securePins.includes(pin)) {
            setPinStatus('This PIN is not secure. Please choose a different one.');
            return;
        }

        const pinData = { pin, label: pinLabel || new Date().toISOString() };

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pin/create`, pinData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                setPinStatus('PIN successfully registered.');
            } else {
                setPinStatus('Failed to register PIN.');
            }
        } catch (error) {
            setPinStatus('Failed to connect to the API.');
        }
    };
  
    return (
        <div className="d-flex flex-column-reverse flex-md-column vh-100">
            <AppNavbar user={user} />
            <Container className="d-flex flex-grow-1 flex-column justify-content-center align-items-center">
                <h2>Settings</h2>
                <Form className="w-100">
                    <Row>
                        <Col>
                            <h4 className="mt-5">User Registration</h4>
                            <Form.Group className="mb-2">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter user email"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter user name"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Check
                                    type="checkbox"
                                    label="Guest (won't be able to add other users)"
                                    checked={isGuest}
                                    onChange={(e) => setIsGuest(e.target.checked)}
                                />
                            </Form.Group>
                            <Button onClick={handleUserSubmit}>Add User</Button>
                            {userStatus && <div className="mt-3">{userStatus}</div>}

                            <h4 className='mt-5'>PIN Registration</h4>
                            <Form.Group className="mb-2">
                                <Form.Label>PIN</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter 4-digit PIN"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>PIN Label</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter PIN label"
                                    value={pinLabel}
                                    onChange={(e) => setPinLabel(e.target.value)}
                                />
                            </Form.Group>
                            <Button onClick={handlePinSubmit}>Submit PIN</Button>
                            {pinStatus && <div className="mt-3">{pinStatus}</div>}
                        </Col>
                    </Row>
                </Form>
            </Container>
        </div>
    );
};

export default Settings;
