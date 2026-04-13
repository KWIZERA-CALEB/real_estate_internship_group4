import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square } from 'lucide-react';

export default function PropertyCard({ property }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <Link to={`/properties/${property.id}`} className="property-card">
            <img 
                src={property.image} 
                alt={property.title}
                className="property-image"
                onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=400&fit=crop';
                }}
            />
            <div className="property-content">
                <div className="property-price">{formatPrice(property.price)}</div>
                <h3 className="property-title">{property.title}</h3>
                <div className="property-location">
                    <MapPin size={16} />
                    {property.location || 'Location not specified'}
                </div>
                <div className="property-meta">
                    {property.bedrooms && (
                        <div className="property-meta-item">
                            <Bed size={16} />
                            {property.bedrooms} Beds
                        </div>
                    )}
                    {property.bathrooms && (
                        <div className="property-meta-item">
                            <Bath size={16} />
                            {property.bathrooms} Baths
                        </div>
                    )}
                    {property.area && (
                        <div className="property-meta-item">
                            <Square size={16} />
                            {property.area} sqft
                        </div>
                    )}
                </div>
                <div style={{ marginTop: '12px' }}>
                    <span className={`badge badge-${property.status === 'available' ? 'success' : property.status === 'sold' ? 'danger' : 'primary'}`}>
                        {property.status}
                    </span>
                </div>
            </div>
        </Link>
    );
}
