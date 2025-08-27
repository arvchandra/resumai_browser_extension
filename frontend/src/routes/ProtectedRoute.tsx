import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Authenticate the user (using either the access or refresh tokens)
    chrome.runtime.sendMessage({ type: "AUTHENTICATE_USER" }, async (response) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`isAuthenticated: ${response.isAuthenticated}`);
      if (response.isAuthenticated) {
        setIsAuthenticated(true);
      }
      setCheckingAuth(false);
    });
  }, []);

  if (checkingAuth) {
    return <div>Authenticating...</div>; // Loading spinner placeholder
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
