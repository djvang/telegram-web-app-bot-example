import { useState, useEffect } from "react";
import api from "./api";

import { useWebApp } from "./useWebApp";

const authUser = async (initData) => {
  return await api
    .post(`/api/v1/users/auth`, {
      initData,
    })
    .then((response) => response.data)
    .catch((error) => {
      console.log({ error });
    });
};

const sendMessage = async (initData) => {
  console.log({ api: api.defaults.baseURL });
  return await api
    .post(`/api/v1/sendMessage`, {
      initData,
    })
    .then((response) => response.data)
    .catch((error) => {
      console.log({ error });
    });
};

function App() {
  const app = useWebApp();
  const [auth, setAuth] = useState(false);

  console.log({ app });

  useEffect(() => {
    if (!app.initData) return;
    authUser(app.initData).then((response) => {
      setAuth(response.done);
    });
  }, [app.initData]);

  return (
    <div className="App">
      <header className="App-header">
        <p>auth: {auth ? "true" : "false"}</p>
        <button onClick={() => sendMessage(app.initData)}>sendMessage</button>
      </header>
    </div>
  );
}

export default App;
