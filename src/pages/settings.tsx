import { useState } from 'react';
import { Container, Tab, Tabs, Row, Col } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from '../components/settings/UserProfile';
import UserManagement from '../components/settings/UserManagement';
import ApartmentManagement from '../components/settings/ApartmentManagement';

const Settings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="d-flex flex-column vh-100 dvh-100">
            <div className="d-flex flex-column flex-grow-1 overflow-auto">
                <Container fluid className="py-3">
                    <Row>
                        <Col>
                            <h2>Settings</h2>
                            <Tabs
                                activeKey={activeTab}
                                onSelect={(k) => k && setActiveTab(k)}
                                className="mb-3"
                            >
                                <Tab eventKey="profile" title="Profile">
                                    <UserProfile />
                                </Tab>
                                <Tab eventKey="users" title="User Management">
                                    <UserManagement />
                                </Tab>
                                {user && user.role === 'admin' && (
                                    <Tab eventKey="apartments" title="Apartment Management">
                                        <ApartmentManagement />
                                    </Tab>
                                )}
                            </Tabs>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className="mt-auto">
                <AppNavbar />
            </div>
        </div>
    );
};

export default Settings;
