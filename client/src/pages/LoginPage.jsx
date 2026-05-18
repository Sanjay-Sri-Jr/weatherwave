// client/src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { CloudSun } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData]   = useState({ email: '', password: '' });
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const { setAuthLogin }          = useAuth();
  const navigate                  = useNavigate();

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authService.login(formData);
      setAuthLogin(data.token, data.user);
      navigate('/dashboard'); // ← updated from /weather
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Add pt-20 so content clears the fixed Navbar
    <div className="min-h-screen bg-gradient-to-br from-[#09599e] to-[#0c2425] flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <CloudSun className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">
              Weather<span className="text-blue-400">Wave</span>
            </h1>
          </div>
          <p className="text-white/60">Sign in to your account</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white mb-6">Welcome back</h2>

          {error && (
            <div className="bg-red-500/20 border border-red-400/30 rounded-2xl p-4 mb-6">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {[
              { label: 'Email',    name: 'email',    type: 'email',    placeholder: 'you@example.com' },
              { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••' },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-white/70 text-sm font-medium block mb-2">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                />
              </div>
            ))}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          <p className="text-white/50 text-center mt-6 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}