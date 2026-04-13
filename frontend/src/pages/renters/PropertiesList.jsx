import { useState, useEffect } from 'react';
import { propertiesAPI } from '../../api/client';
import PropertyCard from '../../components/PropertyCard';
import { Search, AlertCircle } from 'lucide-react';

export default function PropertiesList() {
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        fetchProperties();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [properties, searchTerm, filterType, filterStatus]);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const data = await propertiesAPI.getAll();
            setProperties(data.properties || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...properties];

        if (searchTerm) {
            filtered = filtered.filter(p => 
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterType) {
            filtered = filtered.filter(p => p.propertyType === filterType);
        }

        if (filterStatus) {
            filtered = filtered.filter(p => p.status === filterStatus);
        }

        setFilteredProperties(filtered);
    };

    return (
        <div className="container mt-4">
            {/* Hero Section */}
            <div className="hero" style={{ marginBottom: '40px' }}>
                <h1>Find Your Dream Property</h1>
                <p>Browse our collection of premium real estate properties</p>
            </div>

            {error && (
                <div className="alert alert-danger mb-4">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {/* Search and Filters */}
            <div className="card mb-4" style={{ padding: '24px' }}>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
                    <div className="form-group">
                        <label htmlFor="search">Search</label>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{
                                position: 'absolute',
                                left: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-light)',
                                pointerEvents: 'none'
                            }} />
                            <input
                                id="search"
                                type="text"
                                className="form-control"
                                placeholder="Search properties..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ paddingLeft: '40px' }}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="type">Property Type</label>
                        <select 
                            id="type"
                            className="form-control"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="">All Types</option>
                            <option value="house">House</option>
                            <option value="apartment">Apartment</option>
                            <option value="condo">Condo</option>
                            <option value="townhouse">Townhouse</option>
                            <option value="land">Land</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select 
                            id="status"
                            className="form-control"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="available">Available</option>
                            <option value="sold">Sold</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label style={{ visibility: 'hidden' }}>Clear</label>
                        <button 
                            onClick={() => {
                                setSearchTerm('');
                                setFilterType('');
                                setFilterStatus('');
                            }}
                            className="btn btn-secondary btn-block"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <p className="mb-4 text-muted">
                Showing {filteredProperties.length} of {properties.length} properties
            </p>

            {/* Properties Grid */}
            {loading ? (
                <div className="loading">
                    <div className="spinner"></div>
                </div>
            ) : filteredProperties.length === 0 ? (
                <div className="card text-center p-4">
                    <p className="text-muted">No properties found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-3">
                    {filteredProperties.map(property => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            )}
        </div>
    );
}
