import { getToken } from './storage';

export const configBackendConnection = {
    baseURL: process.env.REACT_APP_BACKEND_URL as string,
    frontURL: process.env.REACT_APP_REACT_URL as string,
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
    stripPayment: `${ApiIndex}/stripe-payment/`,
    userConfig: `${ApiIndex}/users/me/`,
    feedbackAPI: `${ApiIndex}/feedback/`,
    emailMessageAPI: `${ApiIndex}/email-message/`,
    lifePlanAPI: `${ApiIndex}/life-plan/`,
    lifePlanItemAPI: `${ApiIndex}/life-plan-item/`,
    UserPasswordChange: `${ApiIndex}/users/change_password/`,
    UserStats: `${ApiIndex}/users/user_stats/`,
    UserListWithdrawals: `${ApiIndex}/users/list_withdrawals/`,
    UserRequestWithdrawals: `${ApiIndex}/users/request_withdrawal/`,
    acceptTermsAndPrivacy: `${ApiIndex}/users/accept_terms_and_privacy/`,

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

