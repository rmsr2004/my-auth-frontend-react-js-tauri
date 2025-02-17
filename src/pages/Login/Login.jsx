import './Login.css';

import { invoke } from "@tauri-apps/api/core";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { login, add_device } from '../../services/services';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const token = await login(username, password);
            localStorage.setItem('token', token);
            const hostName = await invoke('get_host_name');
            await add_device(hostName);

            navigate('/');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="login-page">
            <h1>Login</h1>

            <form className='login-page-form' onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    vakue={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p className='error'>{error}</p>}

                <div className='login-page-buttons'>
                    <button type="submit">Login</button>

                    <Link to="/register">
                        <button type="button">Register</button>
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default Login;