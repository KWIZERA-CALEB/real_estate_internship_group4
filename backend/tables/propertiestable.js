import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const properties = sequelize.define("properties", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 255]
        }
    },
    price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bedrooms: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
            min: 0
        }
    },
    bathrooms: {
        type: DataTypes.DECIMAL(3, 1),
        defaultValue: 1,
        validate: {
            min: 0
        }
    },
    area: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
            min: 0
        }
    },
    propertyType: {
        type: DataTypes.ENUM('house', 'apartment', 'condo', 'townhouse', 'land', 'other'),
        defaultValue: 'house'
    },
    status: {
        type: DataTypes.ENUM('available', 'sold', 'pending'),
        defaultValue: 'available'
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    }
},
{
    tableName: "properties",
    timestamps: true
}
)

export default properties;