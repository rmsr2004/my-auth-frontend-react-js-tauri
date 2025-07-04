import "./App.css";

import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

import { verify_device } from "./services/services";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

function App() {
    const navigate = useNavigate();

    useEffect(() => {

        const verify = async () => {
            try {
                const hostName = await invoke("get_host_name");
                const token = await verify_device(hostName);

                if (!token) {
                    //
                } else {
                    localStorage.setItem("token", token);
                    navigate("/home");
                }
            } catch (error) {
                console.error("Error verifying device:", error);
                navigate("/");
            }
        }

        verify();
    }, [navigate]);

    return (
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    );
}

export default App;