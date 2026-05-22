import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]    = useState(null);
  const [token, setToken]   = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on app mount
  useEffect(() => {
    const { token: savedToken, user: savedUser } = authService.restoreSession();
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  // Login (called after successful signup or login)
  // Pages call this after authService.login() returns
  const setAuthLogin = useCallback((tokenValue, userValue) => {
    setToken(tokenValue);
    setUser(userValue);
  }, []);

  // Logout
  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      setAuthLogin,
      logout,
      loading,
      isAuthenticated: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
};
