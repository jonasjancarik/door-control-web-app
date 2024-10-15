import { useState, useEffect } from 'react';
import AppNavbar from '../components/Navbar';
import LoginForm from '../components/LoginForm';
import UnlockButton from '../components/UnlockButton';
import { Container } from 'react-bootstrap';
import { useRouter } from 'next/router';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types/types';

const Home = () => {
    const router = useRouter();
    const { user, login } = useAuth();

    const handleLogin = (token: string, user: User) => {
        login(token, user);
    };

    return (
        <div className="d-flex flex-column-reverse flex-md-column vh-100">
            <AppNavbar />
            <Container className="d-flex flex-grow-1 flex-column justify-content-center align-items-center">
                {!user ? (
                    <LoginForm onLogin={handleLogin} />
                ) : (
                    <UnlockButton />
                )}
            </Container>
        </div>
    );
};

export default Home;
