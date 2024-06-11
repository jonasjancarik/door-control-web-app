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
                <Navbar.Brand className='mb-auto' as={Link} href="/">{process.env.NEXT_PUBLIC_WEB_APP_TITLE}</Navbar.Brand>
                {isAuthenticated && user ? <react-fragment>
                    {/*  className="d-block ms-auto" works to fix the button alignment but breaks it on larger screens   */}
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>  
                    <Navbar.Collapse id="basic-navbar-nav" >
                        <Nav>
                            <Nav.Link>{process.env.NEXT_PUBLIC_WEB_APP_SUBTITLE}</Nav.Link>
                            <>
                                <Nav.Link className="ms-auto" as={Link} href="/settings">Settings</Nav.Link>
                                <Nav.Link className="ms-auto" onClick={onLogout} style={{ cursor: 'pointer' }}>
                                    {user.name} (Logout)
                                </Nav.Link>
                            </>
                        </Nav>
                    </Navbar.Collapse>
                </react-fragment> : null}
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
