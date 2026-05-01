// client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import WeatherApp from './pages/WeatherApp';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Default route — redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes — accessible without login */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected route — only accessible when logged in */}
          {/* If not logged in, ProtectedRoute redirects to /login */}
          <Route
            path="/weather"
            element={
              <ProtectedRoute>
                <WeatherApp />
              </ProtectedRoute>
            }
          />

          {/* Catch-all — any unknown URL redirects to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;