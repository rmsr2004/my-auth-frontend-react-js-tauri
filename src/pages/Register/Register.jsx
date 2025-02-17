import './Register.css';

import { invoke } from "@tauri-apps/api/core";
import { useState } from 'react';
import { useNavigate} from 'react-router-dom';

import { login, register, add_device } from '../../services/services';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await register(username, password);
            const hostName = await invoke('get_host_name');
            const token = await login(username, password);
            localStorage.setItem('token', token);
            await add_device(hostName);
            localStorage.removeItem('token');

            navigate('/login');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="register">
            <h1>Register</h1>

            <form className='register-page-form' onSubmit={handleRegister}>
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

                <button className='register-button' type="submit">Register</button>
            </form>
        </div>
    )
}

export default Register;