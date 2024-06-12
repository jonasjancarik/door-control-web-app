// components/Navbar.js
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const AppNavbar = ({ user }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsAuthenticated(!!user);
    }, [user]);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    }, [router]);

    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
            <Container fluid>
                <Navbar.Brand className='mb-auto' as={Link} href="/">{process.env.NEXT_PUBLIC_WEB_APP_TITLE}</Navbar.Brand>
                {isAuthenticated && user ? (
                    <>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className='ms-auto'>
                                <Nav.Link>{process.env.NEXT_PUBLIC_WEB_APP_SUBTITLE}</Nav.Link>
                                <Nav.Link className="ms-auto" as={Link} href="/settings">Settings</Nav.Link>
                                <Nav.Link className="ms-auto" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                                    {user.name} (Logout)
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </>
                ) : null}
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
