import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { propertiesAPI } from '../api/client';
import PropertyCard from '../components/PropertyCard';
import { Building2, Shield, Zap, Users } from 'lucide-react';

export default function Home() {
    const { isAuthenticated } = useAuth();
    const [featuredProperties, setFeaturedProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedProperties();
    }, []);

    const fetchFeaturedProperties = async () => {
        try {
            const data = await propertiesAPI.getAll();
            setFeaturedProperties((data.properties || []).slice(0, 6));
        } catch (err) {
            console.error('Failed to fetch properties');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <div className="hero" style={{ marginBottom: '60px', borderRadius: 0 }}>
                <h1>Find Your Dream Property</h1>
                <p>Discover the perfect home with our extensive collection of premium real estate</p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
                    <Link to="/properties" className="btn btn-primary">
                        Browse Properties
                    </Link>
                    {!isAuthenticated && (
                        <Link to="/signup" className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>
                            Get Started
                        </Link>
                    )}
                </div>
            </div>

            <div className="container">
                {/* Features Section */}
                <section style={{ marginBottom: '60px' }}>
                    <h2 className="text-center mb-4">Why Choose RealEstate?</h2>
                    <div className="grid grid-4">
                        <div className="card text-center p-3">
                            <Building2 size={48} style={{ margin: '0 auto 16px', color: 'var(--primary)' }} />
                            <h4>Wide Selection</h4>
                            <p className="text-muted text-small">Browse thousands of properties from around the world.</p>
                        </div>
                        <div className="card text-center p-3">
                            <Shield size={48} style={{ margin: '0 auto 16px', color: 'var(--primary)' }} />
                            <h4>Secure & Safe</h4>
                            <p className="text-muted text-small">All transactions are secure and verified by professionals.</p>
                        </div>
                        <div className="card text-center p-3">
                            <Zap size={48} style={{ margin: '0 auto 16px', color: 'var(--primary)' }} />
                            <h4>Fast & Easy</h4>
                            <p className="text-muted text-small">Quick listings and efficient property management tools.</p>
                        </div>
                        <div className="card text-center p-3">
                            <Users size={48} style={{ margin: '0 auto 16px', color: 'var(--primary)' }} />
                            <h4>Expert Support</h4>
                            <p className="text-muted text-small">Dedicated support team ready to assist you anytime.</p>
                        </div>
                    </div>
                </section>

                {/* Featured Properties */}
                <section>
                    <div className="flex-between mb-4">
                        <h2>Featured Properties</h2>
                        <Link to="/properties" className="btn btn-outline btn-small">View All</Link>
                    </div>

                    {loading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <div className="grid grid-3" style={{ marginBottom: '40px' }}>
                            {featuredProperties.map(property => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                    )}
                </section>

                {/* CTA Section */}
                <section style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                    color: 'white',
                    padding: '40px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    marginBottom: '60px'
                }}>
                    <h2 style={{ color: 'white', marginBottom: '16px' }}>
                        {isAuthenticated ? 'Ready to List Your Property?' : 'Want to Sell or Rent Your Property?'}
                    </h2>
                    <p style={{ marginBottom: '24px', opacity: 0.9 }}>
                        Join thousands of property owners and get your listings in front of potential buyers and renters.
                    </p>
                    {isAuthenticated ? (
                        <Link to="/new-property" className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>
                            Create Listing
                        </Link>
                    ) : (
                        <>
                            <Link to="/signup" className="btn" style={{ backgroundColor: 'white', color: 'var(--primary)', marginRight: '12px' }}>
                                Sign Up Now
                            </Link>
                            <Link to="/login" className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>
                                Login
                            </Link>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}
