export const DEFAULT_VALUES = {
    userCollaborator: "C",
    userManager: "M",
    userRoot: "R",
};
export const saveToStorage = (items) => {
    Object.keys(items).forEach(key => {
      localStorage.setItem(key, JSON.stringify(items[key]));
    });
};


export const getFromStorage = (key) => {
    if (key) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }
    return null;
};

export const removeFromStorage = (...keys) => {
    if (keys.length > 0) {
        keys.forEach(key => localStorage.removeItem(key));
    } else {
        localStorage.clear();
    }
};

export const getToken = () => {
    return getFromStorage('token');
};

export const getName = () => {
    return getFromStorage('name');
};

export const getPlan = () => {
    return getFromStorage('plan_name');
}

export const getPlanMade = () => {
    return getFromStorage('payment_made');
}

export const getTypeUser = () => {
    return getFromStorage('user_type');
};

export const isAdmin = () => {
    const typeUser = getTypeUser();
    return typeUser === DEFAULT_VALUES.userManager;
};

export const getPhone = () => {
    return getFromStorage('phone');
};

export const getEmail = () => {
    return getFromStorage('email');
};

export const saveImageUrl = (url) => {
    localStorage.setItem("image_url", url);
};

export const getPicture = () => {
    return getFromStorage('image_url');
};

export const getReferralCode = () => {
    return getFromStorage('referral_code');
};

export const getReferralCount = () => {
    return getFromStorage('referral_count');
};
