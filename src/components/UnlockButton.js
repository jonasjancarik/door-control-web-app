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

        function resetButton() {
            controls.start({ strokeDashoffset: 0, transition: { duration: 0.5, ease: 'linear' } });
            setIsButtonDisabled(false);
            // setStatus('Unlock Door');
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/unlock`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                setStatus('Unlocked...');
                setTimeout(() => {
                    controls.start({ strokeDashoffset: 0, transition: { duration: 0.5, ease: 'linear' } });
                    setIsButtonDisabled(false);
                    setStatus("Unlock Door");
                }, 7000);
            } else {  // edge case, errors should be caught by the catch block
                setStatus('Failed to unlock door');
                resetButton();
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status) {
                    if (error.response.status === 401) {
                        setStatus('You are not authorized to unlock the door. Try logging in again.');
                    } else {
                        console.log(error.response);
                        setStatus(error.response.data.detail || 'Failed to connect to the lock');
                    }
                } else {
                    console.log(error.response);
                    setStatus(error.response.data.detail || 'Failed to connect to the lock');
                }
            } else {
                setStatus('Failed to connect to the lock');
            }
            resetButton();
        }
    };

    return (
        <div className="text-center" id="unlock-button-container">
            <button onClick={handleUnlock} disabled={isButtonDisabled} className="button-round">
                {isButtonDisabled ? 'Unlocked...' : status}
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
