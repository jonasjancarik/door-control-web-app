import { Navbar, Nav, Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const AppNavbar = ({ user, onLogout }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(!!user);
    }, [user]);

    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
            <Container>
                <Navbar.Brand>{process.env.NEXT_PUBLIC_WEB_APP_TITLE}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link>{process.env.NEXT_PUBLIC_WEB_APP_SUBTITLE}</Nav.Link>
                        {isAuthenticated ? (
                            <>
                                <Nav.Link as={Link} href="/settings">Settings</Nav.Link>
                                <Nav.Link>{user.name}</Nav.Link>
                                <Nav.Link onClick={onLogout} style={{ cursor: 'pointer' }}>
                                    (Logout)
                                </Nav.Link>
                            </>
                        ) : null}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
