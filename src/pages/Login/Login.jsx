import './Login.css';

import { invoke } from "@tauri-apps/api/core";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone, KeyOutlined } from '@ant-design/icons';
import { Button, Input, Space, Flex } from 'antd';

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
            //const hostName = await invoke('get_host_name');
            //await add_device("2");
            
            localStorage.setItem('device', "2");

            navigate('/home');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className='body'>
            <div className="container">
                <div className="img-box">
                    <img src="../../../src-tauri/icons/auth2.png" alt="Logo" className="logo" />
                </div>
                <div className='separator'></div>
                <div className='login-box'>
                    <h1>User Login</h1>

                    <form onSubmit={handleLogin}>
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
                                <Button block htmlType='submit'>Login</Button>
                            </Flex>
                        </Space>
                    </form>
                    <Link to="/register">
                        <p className="forgot-link">Forgot Username / Password?</p>
                    </Link>
                    <Link to="/register">
                        <p className="register-link">Create your Account →</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Login;