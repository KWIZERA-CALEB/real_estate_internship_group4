import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/shared/login';
import Signup from './pages/shared/Signup';
import Dashboard from './pages/managment/Dashboard';
import PropertiesList from './pages/renters/PropertiesList';
import PropertyDetail from './pages/renters/PropertyDetail';
import NewProperty from './pages/user/NewProperty';
import EditProperty from './pages/user/EditProperty';

function AppContent() {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/properties" element={<PropertiesList />} />
                <Route path="/properties/:id" element={<PropertyDetail />} />
                
                {/* Protected Routes */}
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/new-property" 
                    element={
                        <ProtectedRoute>
                            <NewProperty />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/edit-property/:id" 
                    element={
                        <ProtectedRoute>
                            <EditProperty />
                        </ProtectedRoute>
                    } 
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;
