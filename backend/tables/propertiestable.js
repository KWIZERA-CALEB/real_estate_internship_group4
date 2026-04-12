
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const properties = sequelize.define("properties", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title :{
        type : DataTypes.STRING,
        allowNull : false
    },
    price :{
        type : DataTypes.DECIMAL(10, 2),
        allowNull : false
    },
    description :{
        type : DataTypes.TEXT,
        allowNull : false
    },
    location :{
        type : DataTypes.STRING,
        allowNull : false
    },
    image :{
        type : DataTypes.TEXT,
        allowNull : true
    },
    bedrooms: {
        type : DataTypes.INTEGER,
        allowNull : true,
        defaultValue: 0
    },
    bathrooms: {
        type : DataTypes.INTEGER,
        allowNull : true,
        defaultValue: 0
    },
    area: {
        type : DataTypes.DECIMAL(10, 2),
        allowNull : true,
        defaultValue: 0
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
{
    tableName : "properties",
    timestamps : false
}
)

export default properties;