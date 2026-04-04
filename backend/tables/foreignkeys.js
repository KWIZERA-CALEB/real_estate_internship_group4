import User from "./usertable.js";
import properties from "./propertiestable.js";
import { sequelize } from "../config/db.js";



/// all foreign keys to link user table to properties table
User.hasMany(properties, {
    foreignKey: "user_id",
    onDelete: 'CASCADE' //when we delete a user with that id delete also all his properties
})

properties.belongsTo(User, {
    foreignKey: "user_id",
})

/// all foreign keys to link user table to properties table




export {
    sequelize,
    User,
    properties
}
