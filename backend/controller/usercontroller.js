import User from "../tables/userstable.js";
import { sequelize } from "../config/db.js";

const createUser = async (req, res) => {
    try {
        const new user = await user.create({
            username:""
        })
    }