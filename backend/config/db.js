import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        port: process.env.DB_PORT
    }
)

async function conn() {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
        // Sync all models with database
        await sequelize.sync({ alter: true });
        console.log("Database tables synchronized successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
    
}

export { sequelize, conn };
