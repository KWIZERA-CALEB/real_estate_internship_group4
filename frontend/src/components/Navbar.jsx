import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Plus, LogOut, User } from 'lucide-react';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <Home size={28} />
                    RealEstate
                </Link>
                
                <ul className="navbar-menu">
                    <li>
                        <Link 
                            to="/" 
                            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/properties" 
                            className={`navbar-link ${isActive('/properties') ? 'active' : ''}`}
                        >
                            Properties
                        </Link>
                    </li>

                    {isAuthenticated ? (
                        <>
                            <li>
                                <Link 
                                    to="/new-property" 
                                    className="btn btn-primary btn-small"
                                >
                                    <Plus size={16} />
                                    Add Property
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/dashboard" 
                                    className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
                                >
                                    <User size={18} />
                                    {user?.name}
                                </Link>
                            </li>
                            <li>
                                <button 
                                    onClick={logout}
                                    className="btn btn-secondary btn-small"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link 
                                    to="/login" 
                                    className={`navbar-link ${isActive('/login') ? 'active' : ''}`}
                                >
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/signup" 
                                    className="btn btn-primary btn-small"
                                >
                                    Sign Up
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}
