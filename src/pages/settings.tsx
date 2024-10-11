import { useState } from 'react';
import { Container, Tab, Tabs, Row, Col } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from '../components/settings/UserProfile';
import UserManagement from '../components/settings/UserManagement';
import ApartmentManagement from '../components/settings/ApartmentManagement';

const Settings = () => {
    const { user, token, loading } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Please log in to access settings.</div>;
    }

    return (
        <div className="d-flex flex-column-reverse flex-md-column vh-100 dvh-100">
            <AppNavbar user={user} />
            <Container fluid className='overflow-auto'>
                <Row className="d-flex flex-grow-1 flex-column justify-content-center align-items-center py-5">
                    <Col className="w-100">
                        <h2>Settings</h2>
                        <Tabs
                            activeKey={activeTab}
                            onSelect={(k) => setActiveTab(k)}
                            className="mb-3"
                        >
                            <Tab eventKey="profile" title="Profile">
                                <UserProfile user={user} token={token} />
                            </Tab>
                            {!user.guest && (
                                <Tab eventKey="users" title="User Management">
                                    <UserManagement user={user} token={token} />
                                </Tab>
                            )}
                            {user.admin && (
                                <Tab eventKey="apartments" title="Apartment Management">
                                    <ApartmentManagement user={user} token={token} />
                                </Tab>
                            )}
                        </Tabs>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Settings;
