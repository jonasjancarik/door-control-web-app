// src/pages/_app.js
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        // While waiting for the client to render, return null or a loading spinner
        return null;
    }

    return <Component {...pageProps} />;
}

export default MyApp;