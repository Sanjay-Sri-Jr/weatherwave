// client/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // true on first load

  // On app start, restore session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('ww_token');
    const savedUser = localStorage.getItem('ww_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (tokenValue, userValue) => {
    setToken(tokenValue);
    setUser(userValue);
    localStorage.setItem('ww_token', tokenValue);
    localStorage.setItem('ww_user', JSON.stringify(userValue));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ww_token');
    localStorage.removeItem('ww_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};