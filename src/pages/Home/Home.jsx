import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { add_app, generate_tokens, delete_app } from "../../services/services";

import './Home.css';

const Home = () => {
    const [showForm, setShowForm] = useState(false);
    const [issuer, setIssuer] = useState("");
    const [secret, setSecret] = useState("");
    const [error, setError] = useState("");
    const [device, setDevice] = useState("");
    const [tokens, setTokens] = useState([]);
    const [secondsLeft, setSecondsLeft] = useState(30);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTokens = async () => {
            try {
                const result = await generate_tokens("2");
                setTokens(result);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTokens();
    }, [device]);

    useEffect(() => {
        const interval = setInterval(async () => {
            setSecondsLeft(prev => {
                if (prev === 1) {
                    generate_tokens("2").then(setTokens).catch(console.error);
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [device]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await add_app(issuer, secret);
            setShowForm(false);
            setIssuer("");
            setSecret("");
            setError("");
        } catch (error) {
            setError(error.message);
        }

        // Refresh the tokens after adding a new app
        const result = await generate_tokens("2");
        setTokens(result);
    }

    const deleteApp = async (token) => {
        try {
            await delete_app(token.issuer);
            setTokens((prevTokens) => prevTokens.filter((t) => t.issuer !== token.issuer));
        } catch (error) {
            console.error("Error deleting app:", error);
        }
    }

    return (
        <div class="min-h-screen p-4 md:p-8">
            <div class="max-w-3xl mx-auto">
                <header class="mb-8">
                    <h1 class="text-3xl font-bold text-gray-800">My Auth</h1>
                    <p class="text-gray-600 mt-2">Manage your 2FA codes</p>
                </header>

                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-semibold text-gray-700">Your Applications</h2>
                    <button onClick={() => setShowForm(true)} id="addAppBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                        </svg>
                        Add Application
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tokens.map((token) => (
                        <div key={token.id} className="app-card bg-white rounded-lg p-4 shadow-md transition-all duration-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800">{token.issuer}</h3>
                                </div>
                                <button class="text-gray-400 hover:text-red-500" onClick={() => deleteApp(token)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <div className="code-container mt-3 bg-gray-100 p-3 rounded-md">
                                <div className="flex justify-center">
                                    <span className="text-2xl font-mono font-bold tracking-wider">
                                        {token.code}
                                    </span>
                                </div>
                                <div className="h-1 bg-blue-200 rounded overflow-hidden mt-2">
                                    <div
                                        className="h-full bg-blue-600 transition-all duration-1000"
                                        style={{ width: `${(secondsLeft / 30) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {showForm && (
                    <div id="addAppModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div class="bg-white rounded-lg p-6 w-full max-w-md">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="text-xl font-semibold text-gray-800">Add New Application</h3>
                                <button onClick={() => setShowForm(false)} class="text-gray-500 hover:text-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <form id="addAppForm" onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="appName" className="block text-gray-700 mb-2">Application Name</label>
                                    <input
                                        type="text"
                                        id="appName"
                                        value={issuer}
                                        onChange={(e) => setIssuer(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="secretKey" className="block text-gray-700 mb-2">Secret Key</label>
                                    <input
                                        type="text"
                                        id="secretKey"
                                        value={secret}
                                        onChange={(e) => setSecret(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        id="cancelBtn"
                                        className="px-4 py-2 text-gray-600 mr-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                    >
                                        Add
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;