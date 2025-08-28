import {pool} from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const ProductModel = {
    getAll: async (user_id) => {
        const [rows] = await pool.query(
            `SELECT p.id, p.name, p.description, p.price, p.stock, c.name AS category_name, p.is_active FROM products p 
                JOIN categories c ON p.category_id = c.id
            WHERE p.user_id = ?`,
            [user_id]
        );
        return rows;
    },
    getById: async (id) => {
        const [rows] = await pool.query(
            `SELECT p.id, p.name, p.description, p.price, p.stock, c.name AS category_name, p.is_active FROM products p 
                JOIN categories c ON p.category_id = c.id 
            WHERE p.id = ?`,
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    },
    create: async (name, description, price, stock, category_id, user_id) => {
        const id = uuidv4()

        const [result] = await pool.query(
            'INSERT INTO products (id, name, description, price, stock, category_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, name, description, price, stock, category_id, user_id]
        );
        return result.affectedRows === 0 ? null : await ProductModel.getById(id);
    },
    update: async (id, name, description, price, stock, category_id) => {
        const [result] = await pool.query(
            `UPDATE products SET 
                name = IFNULL(?, name), 
                description = IFNULL(?, description), 
                price = IFNULL(?, price), 
                stock = IFNULL(?, stock), 
                category_id = IFNULL(?, category_id) 
            WHERE id = ?`,
            [name, description, price, stock, category_id, id]
        );
        return result.affectedRows === 0 ? null : await ProductModel.getById(id);
    },
    delete: async (id) => {
        const [result] = await pool.query(
            `UPDATE products SET is_active = 0 WHERE id = ?`,
            [id]
        );
        return result.affectedRows === 0 ? null : true;
    },
};