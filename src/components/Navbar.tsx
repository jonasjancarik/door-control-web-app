// components/Navbar.js
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
// import { FaHome, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { MdHome, MdSettings, MdLogout  } from "react-icons/md";

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
                <Navbar.Brand className='mb-auto d-lg-block d-none' as={Link} href="/">
                    {process.env.NEXT_PUBLIC_WEB_APP_TITLE}
                </Navbar.Brand>
                {isAuthenticated && user ? (
                    <>
                        <div className='ms-auto d-none d-lg-flex'>

                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className='ms-auto'>
                                <Nav.Link>{process.env.NEXT_PUBLIC_WEB_APP_SUBTITLE}</Nav.Link>
                                <Nav.Link className="ms-auto" as={Link} href="/settings">Settings</Nav.Link>
                                <Nav.Link className="ms-auto" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                                    {user.name} ({user.role}) (Logout)
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                        </div>
                        <div className="d-lg-none d-flex justify-content-around w-75 mx-auto">
                            <Nav.Link as={Link} href="/">
                                {/* <FaHome size={36} color='fffdf4' /> */}
                                <MdHome size={36} color='fffdf4' />
                            </Nav.Link>
                            <Nav.Link as={Link} href="/settings">
                                {/* <FaCog size={36} color="fffdf4" /> */}
                                <MdSettings size={36} color="fffdf4" />
                            </Nav.Link>
                            <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>
                                {/* <FaSignOutAlt size={36} color="fffdf4" /> */}
                                <MdLogout size={36} color="fffdf4" />
                            </Nav.Link>
                        </div>
                    </>
                ) : null}
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
