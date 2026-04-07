import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../tables/usertable.js";

const JWT_SECRET = process.env.JWT_SECRET || "djdjdhdj";

async function createUser(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "name, email and password are required" });
  }

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing)
      return res.status(409).json({ error: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error("Failed to create user", error);
    res.status(500).json({ error: "Failed to create user" });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login failed", error);
    res.status(500).json({ error: "Login failed" });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "createdAt"],
    });
    res.status(200).json({ users });
  } catch (error) {
    console.error("Failed to get users", error);
    res.status(500).json({ error: "Failed to get users" });
  }
}

async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, {
      attributes: ["id", "name", "email", "createdAt"],
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    console.error("Failed to get user", error);
    res.status(500).json({ error: "Failed to get user" });
  }
}

async function updateUser(req, res) {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (req.user.id !== parseInt(id)) {
    return res
      .status(403)
      .json({ error: "Not authorized to update this account" });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const updates = { name, email };
    if (password) updates.password = await bcrypt.hash(password, 10);

    await user.update(updates);
    res.status(200).json({ message: "User updated" });
  } catch (error) {
    console.error("Failed to update user", error);
    res.status(500).json({ error: "Failed to update user" });
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;

  if (req.user.id !== parseInt(id)) {
    return res
      .status(403)
      .json({ error: "Not authorized to delete this account" });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.destroy();
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.error("Failed to delete user", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
}

export {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
