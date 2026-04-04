import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    {
        host: "localhost",
        username: "root",
        password: "",
        database: "group4db",
        dialect: "mysql",
        port: 3306
    }

)

async function conn() {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
    
}

export { sequelize, conn };
