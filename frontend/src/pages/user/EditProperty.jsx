import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { propertiesAPI } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Upload } from 'lucide-react';

export default function EditProperty() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { token, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        image: '',
        location: '',
        bedrooms: 1,
        bathrooms: 1,
        area: '',
        propertyType: 'house',
        status: 'available'
    });

    useEffect(() => {
        fetchProperty();
    }, [id]);

    const fetchProperty = async () => {
        try {
            setLoading(true);
            const data = await propertiesAPI.getById(id);
            const property = data.property;

            // Check if user owns the property
            if (property.user_id !== user?.id) {
                setError('You do not have permission to edit this property');
                return;
            }

            setFormData({
                title: property.title,
                price: property.price,
                description: property.description,
                image: property.image,
                location: property.location || '',
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                area: property.area || '',
                propertyType: property.propertyType,
                status: property.status
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please upload a valid image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Image must be smaller than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                // Compress image aggressively
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Resize to max 800px width for smaller file size
                    if (width > 800) {
                        height = (height * 800) / width;
                        width = 800;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Very aggressive compression
                    const compressedImage = canvas.toDataURL('image/jpeg', 0.5);
                    
                    // Check size
                    if (compressedImage.length > 1024 * 1024) {
                        setError('Image is too large even after compression. Please use a smaller image.');
                        return;
                    }
                    
                    setFormData(prev => ({
                        ...prev,
                        image: compressedImage
                    }));
                    setError('');
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaveLoading(true);

        try {
            if (!token) {
                throw new Error('You must be logged in');
            }

            // Frontend validation
            if (formData.title.trim().length < 3) {
                throw new Error('Property title must be at least 3 characters');
            }

            if (!formData.price || parseFloat(formData.price) <= 0) {
                throw new Error('Price must be greater than 0');
            }

            if (formData.description.trim().length < 10) {
                throw new Error('Description must be at least 10 characters');
            }

            if (!formData.image) {
                throw new Error('Please provide a property image');
            }

            if (!formData.bedrooms || formData.bedrooms < 1) {
                throw new Error('Bedrooms must be at least 1');
            }

            if (!formData.bathrooms || formData.bathrooms < 0.5) {
                throw new Error('Bathrooms must be at least 0.5');
            }

            await propertiesAPI.update(id, {
                ...formData,
                price: parseFloat(formData.price),
                bedrooms: parseInt(formData.bedrooms),
                bathrooms: parseFloat(formData.bathrooms),
                area: formData.area ? parseFloat(formData.area) : null
            }, token);

            navigate(`/properties/${id}`);
        } catch (err) {
            setError(err.message || 'Failed to update property');
        } finally {
            setSaveLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="container mt-4" style={{ maxWidth: '600px', margin: '20px auto' }}>
            <Link to={`/properties/${id}`} className="btn btn-outline btn-small mb-4">← Back</Link>

            <div className="card">
                <h2 className="mb-4">Edit Property</h2>

                {error && (
                    <div className="alert alert-danger mb-4">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Property Title *</label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            className="form-control"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            disabled={saveLoading}
                        />
                    </div>

                    <div className="grid grid-2">
                        <div className="form-group">
                            <label htmlFor="price">Price ($) *</label>
                            <input
                                id="price"
                                type="number"
                                name="price"
                                className="form-control"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                disabled={saveLoading}
                                step="0.01"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                className="form-control"
                                value={formData.status}
                                onChange={handleChange}
                                disabled={saveLoading}
                            >
                                <option value="available">Available</option>
                                <option value="sold">Sold</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-2">
                        <div className="form-group">
                            <label htmlFor="propertyType">Property Type</label>
                            <select
                                id="propertyType"
                                name="propertyType"
                                className="form-control"
                                value={formData.propertyType}
                                onChange={handleChange}
                                disabled={saveLoading}
                            >
                                <option value="house">House</option>
                                <option value="apartment">Apartment</option>
                                <option value="condo">Condo</option>
                                <option value="townhouse">Townhouse</option>
                                <option value="land">Land</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="location">Location</label>
                            <input
                                id="location"
                                type="text"
                                name="location"
                                className="form-control"
                                value={formData.location}
                                onChange={handleChange}
                                disabled={saveLoading}
                            />
                        </div>
                    </div>

                    <div className="grid grid-3">
                        <div className="form-group">
                            <label htmlFor="bedrooms">Bedrooms</label>
                            <input
                                id="bedrooms"
                                type="number"
                                name="bedrooms"
                                className="form-control"
                                value={formData.bedrooms}
                                onChange={handleChange}
                                disabled={saveLoading}
                                min="1"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="bathrooms">Bathrooms</label>
                            <input
                                id="bathrooms"
                                type="number"
                                name="bathrooms"
                                className="form-control"
                                value={formData.bathrooms}
                                onChange={handleChange}
                                disabled={saveLoading}
                                min="0.5"
                                step="0.5"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="area">Area (sqft)</label>
                            <input
                                id="area"
                                type="number"
                                name="area"
                                className="form-control"
                                value={formData.area}
                                onChange={handleChange}
                                disabled={saveLoading}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            className="form-control"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            disabled={saveLoading}
                            style={{ minHeight: '150px' }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Update Property Image (Optional)</label>
                        <div style={{
                            border: '2px dashed var(--primary)',
                            borderRadius: '6px',
                            padding: '20px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            backgroundColor: 'var(--light)',
                            transition: 'all 0.2s'
                        }}>
                            <input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={saveLoading}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="image" style={{ cursor: 'pointer', display: 'block' }}>
                                <Upload size={32} style={{ margin: '0 auto 10px', color: 'var(--primary)' }} />
                                <p style={{ fontSize: '14px', marginBottom: '6px' }}>
                                    Click to upload or drag and drop
                                </p>
                                <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                                    PNG, JPG, GIF up to 5MB
                                </p>
                            </label>
                        </div>
                        {formData.image && (
                            <div style={{ marginTop: '12px' }}>
                                <p style={{ fontSize: '13px', color: 'var(--success)', marginBottom: '8px' }}>
                                    ✓ Image ready
                                </p>
                                <img 
                                    src={formData.image} 
                                    alt="Preview"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '300px',
                                        borderRadius: '6px',
                                        border: '1px solid var(--border)'
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-2" style={{ gap: '12px' }}>
                        <button 
                            type="submit" 
                            className="btn btn-primary btn-block"
                            disabled={saveLoading}
                        >
                            {saveLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <Link to={`/properties/${id}`} className="btn btn-secondary btn-block">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
