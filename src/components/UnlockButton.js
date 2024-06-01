import { useState } from 'react';
import axios from 'axios';
import { motion, useAnimation } from 'framer-motion';

const UnlockButton = ({ token }) => {
    const [status, setStatus] = useState('Unlock Door');
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const controls = useAnimation();

    const handleUnlock = async () => {
        setIsButtonDisabled(true);
        controls.start({ strokeDashoffset: 364.424, transition: { duration: 7, ease: 'linear' } });

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/unlock`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                setStatus('Unlocking...');
                setTimeout(() => {
                    controls.start({ strokeDashoffset: 0, transition: { duration: 0.5, ease: 'linear' } });
                    setIsButtonDisabled(false);
                    setStatus("Unlock Door");
                }, 7000);
            } else {
                setStatus('Failed to unlock door');
                controls.start({ strokeDashoffset: 0, transition: { duration: 0.5, ease: 'linear' } });
                setIsButtonDisabled(false);
            }
        } catch (error) {
            setStatus('Failed to connect to the lock');
            controls.start({ strokeDashoffset: 0, transition: { duration: 0.5, ease: 'linear' } });
            setIsButtonDisabled(false);
        }
    };

    return (
        <div className="text-center" id="unlock-button-container">
            <button onClick={handleUnlock} disabled={isButtonDisabled} className="button-round">
                {isButtonDisabled ? 'Unlocking...' : status}
            </button>
            <motion.svg
                viewBox="0 0 120 120"
                className="svg-circle"
            >
                <motion.circle
                    cx="60"
                    cy="60"
                    r="58"
                    fill="none"
                    stroke="#343434"
                    strokeWidth="4"
                    strokeDasharray="364.424"
                    strokeDashoffset="0"
                    animate={controls}
                    initial={{ strokeDashoffset: 0 }}
                />
            </motion.svg>
        </div>
    );
};

export default UnlockButton;
