import { getToken } from './storage';

export const configBackendConnection = {
    baseURL: process.env.REACT_APP_BACKEND_URL as string,
    headersDefault: {
        'Content-Type': 'application/json',
    },
};
const ApiIndex = "api/v1";

export const endpoints = {
    loginToken: `${ApiIndex}/rest-auth/login/`,
    registerUser: `${ApiIndex}/register/`,
    resetPassword: `${ApiIndex}/password_reset/`,
    resetPasswordConfirm: `/password_reset/confirm/`,
};


export const getAuthHeaders = () => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Token ${token}`;
    }
    return headers;
};


export const getFileUploadHeaders = () => {
    const token = getToken();
    const headers = {};

    if (token) {
        headers['Authorization'] = `Token ${token}`;
    }

    return headers;
};

