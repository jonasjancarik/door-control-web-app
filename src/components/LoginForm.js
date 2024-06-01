import { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const LoginForm = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [loginCode, setLoginCode] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [emailStatus, setEmailStatus] = useState('');

    const handleSendLink = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/send-magic-link`, { email });
            if (response.status === 200) {
                setEmailStatus('A login code has been sent to your email.');
                setEmailSent(true);
            } else {
                setEmailStatus('Failed to send email.');
            }
        } catch (error) {
            setEmailStatus('Failed to connect to the API.');
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/exchange-code`, { login_code: loginCode });
            if (response.status === 200) {
                onLogin(response.data.access_token, response.data.user);
            } else {
                setEmailStatus('Failed to login.');
            }
        } catch (error) {
            setEmailStatus('Failed to connect to the API.');
        }
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col xs={12} sm={10} lg={4}>
                    <Form className="text-center">
                        {!emailSent ? (
                            <>
                                <Form.Group controlId="email-input" className="mb-2">
                                    <Form.Control
                                        type="email"
                                        className='text-center'
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>
                                <Button variant="secondary" onClick={handleSendLink} className="w-100">
                                    Send Login Code
                                </Button>
                            </>
                        ) : (
                            <>
                                <Form.Group controlId="login-code-input" className="mb-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter login code"
                                        value={loginCode}
                                        className='text-center'
                                        onChange={(e) => setLoginCode(e.target.value)}
                                    />
                                </Form.Group>
                                <Button variant="secondary" onClick={handleLogin} className="w-100">
                                    Login
                                </Button>
                            </>
                        )}
                        {emailStatus && <div className="mt-3">{emailStatus}</div>}
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginForm;