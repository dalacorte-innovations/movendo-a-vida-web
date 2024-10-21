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

export const getTypeUser = () => {
    return getFromStorage('user_type');
};

export const isAdmin = () => {
    const typeUser = getTypeUser();
    return typeUser === DEFAULT_VALUES.userManager;
};
