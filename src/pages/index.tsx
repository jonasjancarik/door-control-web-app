import AppNavbar from '../components/Navbar';
import UnlockButton from '../components/UnlockButton';
import { Container } from 'react-bootstrap';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
    const { user } = useAuth();

    if (!user) {
        return null; // This should never happen due to AuthWrapper
    }

    return (
        <div className="d-flex flex-column vh-100">
            <AppNavbar />
            <Container className="d-flex flex-grow-1 flex-column justify-content-center align-items-center">
                <UnlockButton />
            </Container>
        </div>
    );
};

export default Home;
