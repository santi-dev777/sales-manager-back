import { pool } from "../config/db.js";

export const UserModel = {
    getAll: async () => {
        const [rows] = await pool.query("SELECT id, name, email, created_at FROM users");
        return rows;
    },

    getById: async (id) => {
        const [rows] = await pool.query("SELECT id, name, email, created_at FROM users WHERE id = ?", [id]);
        return rows[0];
    },

    create: async (name, email, passwordHash) => {
        const [rows] = await pool.query ("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length > 0) {
            throw new Error("User already exists with this email");
        }
        const [result] = await pool.query(
            "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
            [name, email, passwordHash]
        );
        return { id: result.insertId, name, email };
    },

    update: async (id, name, email) => {
        await pool.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, id]);
    },

    delete: async (id) => {
        await pool.query("DELETE FROM users WHERE id = ?", [id]);
    },

    findByEmail: async (email) => {
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        return rows[0];
    }
};
