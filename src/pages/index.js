import { useState, useEffect } from 'react';
import AppNavbar from '../components/Navbar';
import LoginForm from '../components/LoginForm';
import UnlockButton from '../components/UnlockButton';
import { Container } from 'react-bootstrap';
import { useRouter } from 'next/router';

const Home = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState('');
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(storedUser);
        }
    }, [router.asPath]);

    useEffect(() => {
        const handleStorageChange = () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(storedUser);
            } else {
                setToken('');
                setUser(null);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
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
        router.push('/');
    };

    return (
        <div className="d-flex flex-column-reverse flex-md-column vh-100 dvh-100">
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
