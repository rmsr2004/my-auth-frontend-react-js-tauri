const API_URL = 'http://127.0.0.1:8080/auth/v1';

export const register = async (username, password) => {
    console.log(`[REGISTER] username: ${username}, password: ${password}`);

    const request = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const response = await request.json();
    console.log(`[REGISTER] response: ${JSON.stringify(response)}`);
    
    if (response.status != '200') {
        throw new Error(response.errors);
    }

    return response.results;
}

export const login = async (username, password) => {
    console.log(`[LOGIN] username: ${username}, password: ${password}`);

    const request = await fetch(`${API_URL}/login`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const response = await request.json();
    console.log(`[LOGIN] response: ${JSON.stringify(response)}`);
    
    if (response.status != '200') {
        throw new Error(response.errors);
    }

    localStorage.setItem('token', response.results);

    return response.results;
}

export const add_app = async (issuer, secret) => {
    console.log(`[ADD_APP] issuer: ${issuer}, secret: ${secret}`);
    
    const request = await fetch(`${API_URL}/add_app`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ issuer, secret }),
    });

    const response = await request.json();
    console.log(`[ADD_APP] response: ${JSON.stringify(response)}`);
    
    if (response.status != '200') {
        throw new Error(response.errors);
    }

    return response.results;
}

export const get_apps = async () => {
    console.log(`[GET_APPS]`);

    const request = await fetch(`${API_URL}/get_apps`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    });

    const response = await request.json();
    console.log(`[GET_APPS] response: ${JSON.stringify(response)}`);
    
    if (response.status != '200') {
        throw new Error(response.errors);
    }

    return response.results;
}

export const delete_app = async (issuer) => {
    console.log(`[DELETE_APP] issuer: ${issuer}`);
    
    const request = await fetch(`${API_URL}/delete_app`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ issuer }),
    });

    const response = await request.json();
    console.log(`[DELETE_APP] response: ${JSON.stringify(response)}`);
    
    if (response.status != '200') {
        throw new Error(response.errors);
    }

    return response.results;
}

export const add_device = async (device) => {
    console.log(`[ADD_DEVICE] device: ${device}`);
    
    const request = await fetch(`${API_URL}/add_device`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 'device_id': device }),
    });

    const response = await request.json();
    console.log(`[ADD_DEVICE] response: ${JSON.stringify(response)}`);
    
    if (response.status != '200') {
        throw new Error(response.errors);
    }

    return response.results;
}

export const verify_device = async (device) => {
    console.log(`[GET_DEVICES]`);

    const request = await fetch(`${API_URL}/verify_device/${device}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const response = await request.json();
    console.log(`[GET_DEVICES] response: ${JSON.stringify(response)}`);
    
    if (response.status != '200') {
        throw new Error(response.errors);
    }

    return response.results;
}

export const generate_tokens = async (device_id) => {
    console.log(`[GENERATE_TOKENS] device_id: ${device_id}`);
    
    const request = await fetch(`${API_URL}/generate_tokens/${device_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    });

    const response = await request.json();
    console.log(`[GENERATE_TOKENS] response: ${JSON.stringify(response)}`);
    
    if (response.status != '200') {
        throw new Error(response.errors);
    }

    return response.results;
}

// end of services.js