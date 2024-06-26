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

    const checkLocalStorage = () => {
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

    useEffect(() => {
        checkLocalStorage();
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            checkLocalStorage();
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        router.events.on('routeChangeComplete', checkLocalStorage);
        return () => {
            router.events.off('routeChangeComplete', checkLocalStorage);
        };
    }, [router.events]);

    const handleLogin = (token, user) => {
        setToken(token);
        setUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    };

    return (
        <div className="d-flex flex-column-reverse flex-md-column vh-100">
            <AppNavbar user={user} />
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
