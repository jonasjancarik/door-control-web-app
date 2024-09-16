import { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, InputGroup, Spinner, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';
import axios from 'axios';
import AppNavbar from '../components/Navbar';

const Settings = () => {
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [isGuest, setIsGuest] = useState(false);
    const [pin, setPin] = useState('');
    const [pinLabel, setPinLabel] = useState('');
    const [rfidUuid, setRfidUuid] = useState('');
    const [rfidLabel, setRfidLabel] = useState('');
    const [rfidUserEmail, setRfidUserEmail] = useState('');
    const [userStatus, setUserStatus] = useState('');
    const [pinStatus, setPinStatus] = useState('');
    const [rfidReadStatus, setRfidReadStatus] = useState('');
    const [rfidStatus, setRfidStatus] = useState('');
    const [user, setUser] = useState(null);
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // todo: use email-validator instead
        if (!emailRegex.test(userEmail)) {
            setUserStatus('Please enter a valid email address.');
            return;
        }

        setIsSubmitting(true);
        const newUser = { email: userEmail, name: userName || userEmail, guest: isGuest };

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/create`, newUser, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                setUserStatus('User added successfully.');
                setUserEmail('');
                setUserName('');
                setIsGuest(false);
            } else {
                setUserStatus('Failed to add user.');
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setUserStatus('User with this email already exists.');
            } else {
                setUserStatus('Failed to connect to the API.');
            }
        } finally {
            setIsSubmitting(false);
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

        setIsSubmitting(true);
        const pinData = { pin, label: pinLabel || new Date().toISOString() };

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pin/create`, pinData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                setPinStatus('PIN successfully registered.');
                setPin('');
                setPinLabel('');
            } else {
                setPinStatus('Failed to register PIN.');
            }
        } catch (error) {
            setPinStatus('Failed to connect to the API.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRfidRead = async () => {
        setIsLoading(true);
        try {
            setRfidReadStatus(null);

            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rfid/read`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { timeout: 5000 },
            });

            if (response.status === 200) {
                if (!response.data.uuid) {
                    setRfidReadStatus('RFID tag not scanned.');  // this shouldn't happen on the API side
                }
                setRfidUuid(response.data.uuid);
                setRfidReadStatus(null);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setRfidReadStatus('RFID tag not scanned.');
            } else {
                setRfidReadStatus('Failed to connect to the API.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRfidSubmit = async () => {
        if (!rfidUuid) {
            setRfidStatus('Please enter an RFID UUID.');
            return;
        }

        const rfidData = { 
            uuid: rfidUuid, 
            label: rfidLabel || new Date().toISOString(),
            user_email: user.admin ? rfidUserEmail : undefined
        };

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/rfid/create`, rfidData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                setRfidStatus('RFID successfully registered.');
                setRfidUuid('');
                setRfidLabel('');
                setRfidUserEmail('');
            } else {
                setRfidStatus('Failed to register RFID.');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setRfidStatus('Unauthorized. Try logging in again.')
            } else {
                console.log(error.response);
                const errorMessage = error.response && error.response.data && error.response.data.detail ? JSON.stringify(error.response.data.detail) : 'Failed to connect to the API.';
                setRfidStatus(`Failed to register RFID: ${errorMessage}`);
            }
        }
    };

    return (
        <div className="d-flex flex-column-reverse flex-md-column vh-100 dvh-100">
            <AppNavbar user={user} />
            <Container fluid className='overflow-auto'>
                <Row className="d-flex flex-grow-1 flex-column justify-content-center align-items-center py-5">
                    <Col className="w-100">
                        <h2>Settings</h2>
                        <Form className="w-100">

                            <div className="border rounded-1 p-2 mt-4">
                                <h3>User Registration</h3>
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
                                <Button 
                                    className="mt-3 ms-auto d-block" 
                                    variant="outline-secondary" 
                                    onClick={handleUserSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <Spinner as="span" animation="border" size="sm" /> : 'Add User'}
                                </Button>
                                {userStatus && <Alert variant={userStatus.includes('successfully') ? 'success' : 'danger'} className="mt-3">{userStatus}</Alert>}
                            </div>
                            <div className="border rounded-1 p-2 mt-5">
                                <h3>RFID Registration</h3>
                                <Form.Group className="mb-2">
                                    <Form.Label>RFID UUID</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter RFID UUID"
                                            value={rfidUuid}
                                            onChange={(e) => setRfidUuid(e.target.value)}
                                            disabled={isLoading}
                                        />
                                        <Button variant="outline-secondary" onClick={handleRfidRead} disabled={isLoading}>
                                            {isLoading ? <Spinner as="span" animation="border" size="sm" /> : 'Read RFID'}
                                        </Button>
                                    </InputGroup>
                                    {rfidReadStatus && <Alert variant='danger' className="mt-3 p-2">{rfidReadStatus}</Alert>}
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>RFID Label</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter RFID label"
                                        value={rfidLabel}
                                        onChange={(e) => setRfidLabel(e.target.value)}
                                    />
                                </Form.Group>
                                {user && user.admin && (
                                    <Form.Group className="mb-2">
                                        <Form.Label>User Email (optional)</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter user email"
                                            value={rfidUserEmail}
                                            onChange={(e) => setRfidUserEmail(e.target.value)}
                                        />
                                    </Form.Group>
                                )}
                                <Button className="mt-3 ms-auto d-block" variant="outline-secondary" onClick={handleRfidSubmit}>Register RFID</Button>
                                {rfidStatus && <Alert variant={rfidStatus.includes('successfully') ? 'success' : 'danger'} className="mt-3 p-2">{rfidStatus}</Alert>}
                            </div>
                            <div className="border rounded-1 p-2 mt-5">
                                <h3>PIN Registration</h3>
                                <Form.Group className="mb-2">
                                    <Form.Label>PIN</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter 4-digit PIN"
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value)}
                                        aria-describedby="pin-help"
                                    />
                                    <Form.Text id="pin-help" muted>
                                        PIN must be a 4-digit number and not easily guessable.
                                    </Form.Text>
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
                                <Button 
                                    className="mt-3 ms-auto d-block" 
                                    variant="outline-secondary" 
                                    onClick={handlePinSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <Spinner as="span" animation="border" size="sm" /> : 'Add PIN'}
                                </Button>
                                {pinStatus && <Alert variant={pinStatus.includes('successfully') ? 'success' : 'danger'} className="mt-3">{pinStatus}</Alert>}
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
            
        </div>
    );
};

export default Settings;