import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StationsPage from './pages/StationsPage';
import StationDetailsPage from './pages/StationDetailsPage';
import FlowAnalysisPage from './pages/FlowAnalysisPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
    return (
        <BrowserRouter basename="/metro-frontend">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/stations" element={<StationsPage />} />
                <Route path="/stations/:id" element={<StationDetailsPage />} />
                <Route path="/flow-analysis/:requestId" element={<FlowAnalysisPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;