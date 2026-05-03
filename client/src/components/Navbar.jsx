// client/src/components/Navbar.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CloudSun, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper — highlight active nav link
  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `text-sm font-medium transition-all duration-200 px-3 py-1.5 rounded-xl
    ${isActive(path)
      ? 'text-white bg-white/15'
      : 'text-white/60 hover:text-white hover:bg-white/10'
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 group"
        >
          <div className="p-1.5 bg-white/10 rounded-xl group-hover:bg-white/20 transition-all">
            <CloudSun className="w-5 h-5 text-blue-400" />
          </div>
          <span className="font-bold text-white text-lg">
            Weather<span className="text-blue-400">Wave</span>
          </span>
        </button>

        {/* Nav Links */}
        <div className="flex items-center space-x-1">

          <button
            onClick={() => navigate('/')}
            className={navLinkClass('/')}
          >
            Home
          </button>

          {isAuthenticated ? (
            // Logged in nav
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className={navLinkClass('/dashboard')}
              >
                <span className="flex items-center space-x-1">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </span>
              </button>

              {/* User info + logout */}
              <div className="flex items-center space-x-2 ml-2 pl-2 border-l border-white/20">
                <span className="text-white/50 text-sm hidden sm:block">
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-xl transition-all duration-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            // Logged out nav
            <>
              <button
                onClick={() => navigate('/login')}
                className={navLinkClass('/login')}
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="text-sm font-medium px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 hover:scale-105"
              >
                Sign Up
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}