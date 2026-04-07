
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

,
    },
    price :{
        type : DataTypes.INTEGER,
        allowNull : false

    },
    description :
    {
        type : DataTypes.STRING(255),
        allowNull : false
},
    image :{
        type : DataTypes.STRING,
        allowNull : false
    },
    location :{
        type : DataTypes.STRING,
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