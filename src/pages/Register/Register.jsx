import './Register.css';

import { invoke } from "@tauri-apps/api/core";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone, KeyOutlined } from '@ant-design/icons';
import { Button, Input, Space, Flex } from 'antd';

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
            await add_device("2");
            localStorage.removeItem('token');

            navigate('/');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className='body'>
            <div className="container">
                <div className="img-box">
                    <img src='../../../src-tauri/icons/auth2.png' alt="Logo" className="logo" />
                </div>
                <div className='separator'></div>
                <div className="register-box">
                    <h1>Register</h1>

                    <form onSubmit={handleRegister}>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <Input
                                size="large"
                                placeholder="username"
                                prefix={<UserOutlined />}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <Input.Password
                                placeholder="password"
                                prefix={<KeyOutlined />}
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                size="large"
                            />

                            {error && <p className='error'>{error}</p>}

                            <Flex gap="small" wrap align='center' justify='center' size="large">
                                <Button block htmlType='submit'>Register</Button>
                            </Flex>
                        </Space>
                    </form>
                    <Link to="/">
                        <p className="login-link">
                            Already have an account?
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Register;