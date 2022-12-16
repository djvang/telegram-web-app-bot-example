import { createContext, useEffect, useContext, useState } from "react";

export const WebAppContext = createContext({});

export const WebAppProvider = ({ children }) => {
  const [app, setApp] = useState({});

  useEffect(() => {
    setApp(window.Telegram.WebApp);
  }, []);

  useEffect(() => {
    if (!app) return;
    app.ready && app.ready();
  }, [app]);

  return (
    <WebAppContext.Provider value={app}>{children}</WebAppContext.Provider>
  );
};

export const useWebApp = () => {
  const app = useContext(WebAppContext);

  return app;
};
