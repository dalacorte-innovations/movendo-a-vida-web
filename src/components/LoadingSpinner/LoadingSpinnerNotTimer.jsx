import React, { useState, useEffect } from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ isLoading }) => {
    return (
        isLoading && (
            <div className="loading-spinner-overlay" id="loading-spinner-overlay">
                <div className="loading-spinner" id="loading-spinner"></div>
            </div>
        )
    );
};

export default LoadingSpinner;
