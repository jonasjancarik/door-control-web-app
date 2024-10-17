import React from 'react';
import { Button } from 'react-bootstrap';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import UserForm from './UserForm';
import { User } from '@/types/types';

const UserProfile: React.FC = () => {
    const { logout, user, updateUser } = useAuth();
    const router = useRouter();

    const handleSuccess = (user: User | null) => {
        if (user) {
            updateUser(user);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div>
            <UserForm user={user} onSuccess={handleSuccess} />
            <Button variant="danger" onClick={handleLogout} className="mt-3">
                Logout
            </Button>
        </div>
    );
};

export default UserProfile;
