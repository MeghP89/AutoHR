import './App.css'
import Login from './pages/Login'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth'
import Dashboard from './pages/Dashboard';

export default function App() {
  const { isAuthenticated, loading } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={loading ? <div className="text-white p-4">Loading...</div> : isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route
          path="/dashboard"
          element={
        <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
          <Dashboard />
        </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
        loading ? (
          <div className="text-white p-4">Loading...</div>
        ) : isAuthenticated ? (
          <Navigate to="/dashboard" />
        ) : (
          <Navigate to="/login" />
        )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

