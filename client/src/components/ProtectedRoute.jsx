// client/src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CloudSun } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Show spinner while AuthContext restores session from localStorage
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#09599e] to-[#0c2425] flex flex-col items-center justify-center space-y-4">
        <CloudSun className="w-10 h-10 text-blue-400 animate-pulse" />
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400" />
      </div>
    );
  }

  // Not authenticated → send to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}