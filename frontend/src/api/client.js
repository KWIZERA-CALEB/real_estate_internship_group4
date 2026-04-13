const API_BASE = 'http://localhost:3000/api';

// Properties API
export const propertiesAPI = {
    //fetch all properties
    getAll: async () => {
        const response = await fetch(`${API_BASE}/properties/all`);
        if (!response.ok) throw new Error('Failed to fetch properties');
        return response.json();
    },

    //get properties by id 
    getById: async (id) => {
        const response = await fetch(`${API_BASE}/properties/${id}`);
        if (!response.ok) throw new Error('Failed to fetch property');
        return response.json();
    },

    //get user  by id in filtering 
    getByUserId: async (userId) => {
        const response = await fetch(`${API_BASE}/properties/user/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user properties');
        return response.json();
    },

    // create: async (data, token) => {
    //     const response = await fetch(`${API_BASE}/properties`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`
    //         },
    //         body: JSON.stringify(data)
    //     });
    //     if (!response.ok) {
    //         const error = await response.json();
    //         throw new Error(error.error || 'Failed to create property');
    //     }
    //     return response.json();
    // },

    //creates propeties
    create: async (data, token) => {
        const response = await fetch(`${API_BASE}/properties`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create property');
        }
        return response.json();
    },

    //updates the properties
    update: async (id, data, token) => {
        const response = await fetch(`${API_BASE}/properties/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update property');
        }
        return response.json();
    },

    //handels delelte using id 
    delete: async (id, token) => {
        const response = await fetch(`${API_BASE}/properties/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete property');
        }
        return response.json();
    }
};

// Users API fetch user details from the databse 
export const usersAPI = {
    getAll: async () => {
        const response = await fetch(`${API_BASE}/users/all`);
        if (!response.ok) throw new Error('Failed to fetch users');
        return response.json();
    },

    getProfile: async (token) => {
        const response = await fetch(`${API_BASE}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        return response.json();
    }
};
