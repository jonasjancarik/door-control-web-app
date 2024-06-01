import { useState } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

const UnlockButton = ({ token }) => {
    const [status, setStatus] = useState('');
    const [isUnlocking, setIsUnlocking] = useState(false);

    const handleUnlock = async () => {
        setIsUnlocking(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/unlock`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                setStatus('Door unlocked');
                setTimeout(() => setIsUnlocking(false), 7000);
            } else {
                setStatus('Failed to unlock door');
                setIsUnlocking(false);
            }
        } catch (error) {
            setStatus('Failed to connect to the lock');
            setIsUnlocking(false);
        }
    };

    return (
        <div className="text-center">
            <Button onClick={handleUnlock} disabled={isUnlocking}>
                {isUnlocking ? 'Unlocking...' : 'Unlock Door'}
            </Button>
            {status && <div className="mt-3">{status}</div>}
        </div>
    );
};

export default UnlockButton;