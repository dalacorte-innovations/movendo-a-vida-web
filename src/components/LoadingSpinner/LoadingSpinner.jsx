import React, { useState, useEffect } from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        isVisible && (
            <div className="loading-spinner-overlay" id="loading-spinner-overlay">
                <div className="loading-spinner" id="loading-spinner"></div>
            </div>
        )
    );
};

export default LoadingSpinner;
