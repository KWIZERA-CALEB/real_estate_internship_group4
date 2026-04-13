import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { propertiesAPI } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Bed, Bath, Square, User, Phone, Mail, AlertCircle, CheckCircle, Trash2, Edit2 } from 'lucide-react';

export default function PropertyDetail() {
    const { id } = useParams();
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    useEffect(() => {
        fetchProperty();
    }, [id]);

    const fetchProperty = async () => {
        try {
            setLoading(true);
            const data = await propertiesAPI.getById(id);
            setProperty(data.property);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this property?')) {
            return;
        }

        try {
            setDeleteLoading(true);
            setDeleteError('');
            await propertiesAPI.delete(id, token);
            navigate('/dashboard');
        } catch (err) {
            setDeleteError(err.message);
        } finally {
            setDeleteLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price);
    };

    const isOwner = user?.id === property?.user_id;

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    <AlertCircle size={20} />
                    <span>{error || 'Property not found'}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <Link to="/properties" className="btn btn-outline btn-small mb-4">← Back to Properties</Link>

            {deleteError && (
                <div className="alert alert-danger mb-4">
                    <AlertCircle size={20} />
                    <span>{deleteError}</span>
                </div>
            )}

            <div className="grid grid-2" style={{ gap: '32px' }}>
                {/* Image and Details */}
                <div>
                    <img 
                        src={property.image} 
                        alt={property.title}
                        style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            maxHeight: '400px',
                            objectFit: 'cover'
                        }}
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop';
                        }}
                    />

                    {/* Property Features */}
                    <div className="card mb-4">
                        <h3 className="mb-3">Features</h3>
                        <div className="grid grid-2" style={{ gap: '16px' }}>
                            <div>
                                <p className="text-muted text-small">Bedrooms</p>
                                <p style={{ fontSize: '20px', fontWeight: 600 }}>
                                    <Bed size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                    {property.bedrooms}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted text-small">Bathrooms</p>
                                <p style={{ fontSize: '20px', fontWeight: 600 }}>
                                    <Bath size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                    {property.bathrooms}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted text-small">Area</p>
                                <p style={{ fontSize: '20px', fontWeight: 600 }}>
                                    <Square size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                    {property.area} sqft
                                </p>
                            </div>
                            <div>
                                <p className="text-muted text-small">Type</p>
                                <p style={{ fontSize: '20px', fontWeight: 600, textTransform: 'capitalize' }}>
                                    {property.propertyType}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Panel */}
                <div>
                    <div className="card">
                        <div className="card-body">
                            <div className="flex-between mb-3">
                                <div>
                                    <p className="text-muted text-small">Price</p>
                                    <p style={{ fontSize: '32px', fontWeight: 700, color: 'var(--primary)' }}>
                                        {formatPrice(property.price)}
                                    </p>
                                </div>
                                <span className={`badge badge-${property.status === 'available' ? 'success' : property.status === 'sold' ? 'danger' : 'primary'}`}>
                                    {property.status}
                                </span>
                            </div>

                            <h1 className="mb-2">{property.title}</h1>

                            <div style={{ marginBottom: '20px', color: 'var(--text-light)' }}>
                                <MapPin size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                {property.location}
                            </div>

                            <div style={{ padding: '16px', backgroundColor: 'var(--light)', borderRadius: '8px', marginBottom: '20px' }}>
                                <h4 style={{ marginBottom: '12px' }}>Description</h4>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{property.description}</p>
                            </div>

                            {/* Owner Info */}
                            {property.User && (
                                <div className="card-header">
                                    <h4 style={{ marginBottom: '12px' }}>Contact Owner</h4>
                                    <div style={{ padding: '12px', backgroundColor: 'var(--light)', borderRadius: '8px' }}>
                                        <div className="flex gap-3 mb-2">
                                            <User size={20} style={{ color: 'var(--primary)' }} />
                                            <div>
                                                <p style={{ fontWeight: 600 }}>{property.User.name}</p>
                                                <p className="text-muted text-small">{property.User.email}</p>
                                            </div>
                                        </div>
                                        {property.User.phone && (
                                            <div className="flex gap-3">
                                                <Phone size={20} style={{ color: 'var(--primary)' }} />
                                                <p>{property.User.phone}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Owner Actions */}
                            {isOwner && (
                                <div className="card-footer" style={{ marginTop: '20px' }}>
                                    <div className="flex gap-2">
                                        <Link 
                                            to={`/edit-property/${property.id}`}
                                            className="btn btn-primary flex-1"
                                        >
                                            <Edit2 size={18} />
                                            Edit
                                        </Link>
                                        <button 
                                            onClick={handleDelete}
                                            className="btn btn-danger flex-1"
                                            disabled={deleteLoading}
                                        >
                                            <Trash2 size={18} />
                                            {deleteLoading ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
