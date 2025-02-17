import './Home.css';

import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { verify_device, add_app } from "../../services/services";

const Home = () => {
    const [issuer, setIssuer] = useState("");
    const [secret, setSecret] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const checkDevice = async () => {
            try {
                const hostName = await invoke("get_host_name");
                const token = await verify_device(hostName);

                if (!token) {
                    navigate("/login");
                } else {
                    localStorage.setItem("token", token);
                }
            } catch (error) {
                console.error("Erro ao verificar dispositivo:", error);
                navigate("/login");
            }
        };

        checkDevice();
    }, [navigate]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await add_app(issuer, secret);
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div>
            <h1>Main Page</h1>
            <p>Welcome to the main page!</p>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Issuer"
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Secret"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    required
                />

                {error && <p className="error">{error}</p>}

                <button className='button' type="submit">Submit</button>

            </form>
        </div>
    );
}

export default Home;