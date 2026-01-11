import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />
            <Route
                path="/*"
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
}

export default App;
