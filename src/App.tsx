import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './pages/Dashboard';
import { Home } from './pages/Home';
import { ProtectedRoute } from './components/ProtectedRoute';
import { dbService } from './services/dbService';

export default function App() {
  useEffect(() => {
    // Initialize database schema when app starts
    dbService.initSchema().catch(console.error);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}