import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { propertiesAPI } from '../../api/client';
import PropertyCard from '../../components/PropertyCard';
import { Edit2, Save, AlertCircle, CheckCircle, User } from 'lucide-react';

export default function Dashboard() {
    const { user, token, updateProfile } = useAuth();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        bio: user?.bio || ''
    });

    useEffect(() => {
        fetchUserProperties();
    }, []);

    const fetchUserProperties = async () => {
        try {
            setLoading(true);
            const data = await propertiesAPI.getByUserId(user.id);
            setProperties(data.properties || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await updateProfile(formData);
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container mt-4">
            <div className="grid grid-2" style={{ marginBottom: '40px' }}>
                {/* Profile Card */}
                <div className="card">
                    <div className="card-header flex-between">
                        <div className="flex gap-2">
                            <User size={24} style={{ color: 'var(--primary)' }} />
                            <h3>My Profile</h3>
                        </div>
                        <button 
                            className="btn btn-outline btn-small"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                    </div>

                    {error && (
                        <div className="alert alert-danger mb-3">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success mb-3">
                            <CheckCircle size={20} />
                            <span>{success}</span>
                        </div>
                    )}

                    {isEditing ? (
                        <form onSubmit={handleUpdateProfile}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="form-control"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Bio</label>
                                <textarea
                                    name="bio"
                                    className="form-control"
                                    value={formData.bio}
                                    onChange={handleChange}
                                />
                            </div>

                            <button type="submit" className="btn btn-success btn-block">
                                <Save size={16} />
                                Save Changes
                            </button>
                        </form>
                    ) : (
                        <div className="card-body">
                            <p><strong>Name:</strong> {user?.name}</p>
                            <p><strong>Email:</strong> {user?.email}</p>
                            <p><strong>Phone:</strong> {user?.phone || 'Not provided'}</p>
                            <p><strong>Bio:</strong> {user?.bio || 'No bio added'}</p>
                        </div>
                    )}
                </div>

                {/* Stats Card */}
                <div className="card">
                    <div className="card-header">
                        <h3>Statistics</h3>
                    </div>
                    <div className="card-body">
                        <div style={{ marginBottom: '16px' }}>
                            <p style={{ color: 'var(--text-light)', marginBottom: '4px' }}>Total Properties</p>
                            <p style={{ fontSize: '32px', fontWeight: 700, color: 'var(--primary)' }}>
                                {properties.length}
                            </p>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <p style={{ color: 'var(--text-light)', marginBottom: '4px' }}>Available</p>
                            <p style={{ fontSize: '24px', fontWeight: 600, color: 'var(--success)' }}>
                                {properties.filter(p => p.status === 'available').length}
                            </p>
                        </div>

                        <div>
                            <p style={{ color: 'var(--text-light)', marginBottom: '4px' }}>Total Value</p>
                            <p style={{ fontSize: '24px', fontWeight: 600, color: 'var(--primary)' }}>
                                ${properties.reduce((sum, p) => sum + parseFloat(p.price), 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Properties Section */}
            <h2 className="mb-4">My Properties</h2>

            {loading ? (
                <div className="loading">
                    <div className="spinner"></div>
                </div>
            ) : properties.length === 0 ? (
                <div className="card text-center p-4">
                    <p className="text-muted">You haven't listed any properties yet.</p>
                </div>
            ) : (
                <div className="grid grid-3">
                    {properties.map(property => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            )}
        </div>
    );
}
