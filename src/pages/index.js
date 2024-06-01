import { useState, useEffect } from 'react';
import AppNavbar from '../components/Navbar';
import LoginForm from '../components/LoginForm';
import UnlockButton from '../components/UnlockButton';
import { Container } from 'react-bootstrap';

const Home = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(storedUser);
        }
    }, []);

    const handleLogin = (token, user) => {
        setToken(token);
        setUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const handleLogout = () => {
        setToken('');
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <div className="d-flex flex-column vh-100">
            <AppNavbar user={user} onLogout={handleLogout} />
            <Container className="d-flex flex-grow-1 flex-column justify-content-center align-items-center">
                {!user ? (
                    <LoginForm onLogin={handleLogin} />
                ) : (
                    <UnlockButton token={token} />
                )}
            </Container>
        </div>
    );
};

export default Home;