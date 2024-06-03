import { useState, useEffect, useCallback } from 'react';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/router';
import axios from 'axios';

const LoginForm = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [loginCode, setLoginCode] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [emailStatus, setEmailStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleLogin = useCallback(async (code) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/exchange-code`, { login_code: code || loginCode });
            if (response.status === 200) {
                onLogin(response.data.access_token, response.data.user);
            } else {
                setEmailStatus('Failed to login.');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    setEmailStatus('Invalid login code.');
                } else if (error.response.status === 401) {
                    setEmailStatus('Invalid or expired login code.');
                } else {
                    setEmailStatus('Failed to connect to the API.');
                }
            } else {
                setEmailStatus('Failed to connect to the API.');
            }
        }
    }, [loginCode, onLogin]);

    useEffect(() => {
        const { login_code } = router.query;
        if (login_code) {
            setLoginCode(login_code);
            handleLogin(login_code); // Automatically send the exchange code request
        }
    }, [router.query, handleLogin]);

    const handleSendLink = async () => {
        setLoading(true);
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
        } finally {
            setLoading(false);
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
                                        disabled={loading}
                                    />
                                </Form.Group>
                                <Button variant="secondary" onClick={handleSendLink} className="w-100" disabled={loading}>
                                    {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Send Login Code'}
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
                                <Button variant="secondary" onClick={() => handleLogin()} disabled={!loginCode} className="w-100">
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
