import "./App.css";

import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

import MainPage from "./pages/MainPage/MainPage";
import ImportPage from "./pages/ImportPage/ImportPage";

function App() {
  const [isLogged, setIsLogged] = useState(null);

  const getEnvVar = async () => {
    const secret = await invoke('get_env_var', { name: 'LOGGED_IN' });
    return secret;
  };

  useEffect(() => {
    const checkIsLogged = async () => {
      const loggedIn = await getEnvVar();
      setIsLogged(loggedIn);
    }

    checkIsLogged();
  }, []);

  console.log(isLogged);

  switch (isLogged) {
    case '0':
      return <ImportPage />;
    case '1':
      return <MainPage />;
    default:
      return (
        <div className="App">
          <header className="App-header">
            <p>
              Loading...
            </p>
          </header>
        </div>
      );
  }
}

export default App;
