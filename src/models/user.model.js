import { pool } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const UserModel = {
    getAll: async () => {
        const [rows] = await pool.query("SELECT id, name, email, created_at FROM users");
        return rows;
    },

    getById: async (id) => {
        const [rows] = await pool.query("SELECT id, name, email, created_at FROM users WHERE id = ?", [id]);
        if (rows.length === 0) throw new Error("User not found");
        return rows[0];
    },

    create: async (name, email, passwordHash) => {
        const id = uuidv4()
        const [rows] = await pool.query ("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length > 0) {
            throw new Error("User already exists with this email");
        }
        const [result] = await pool.query(
            "INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)",
            [id, name, email, passwordHash]
        );
        return await UserModel.getById(id);
    },

    update: async (id, name, email) => {
        const [result] = await pool.query("UPDATE users SET name = IFNULL(?, name), email = IFNULL(?, email) WHERE id = ?", [name, email, id]);
        if (result.affectedRows === 0) throw new Error("User not found");
        return await UserModel.getById(id);
    },

    delete: async (id) => {
        const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
        if (result.affectedRows === 0) throw new Error("User not found");
    },

    findByEmail: async (email) => {
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        return rows[0];
    }
};
