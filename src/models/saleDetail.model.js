import {pool} from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const SaleDetailModel = {
    create: async (sale_id, product_id, quantity) => {
        const id = uuidv4()
        const [rows] = await pool.query(
            "SELECT * FROM sales WHERE id = ?", [sale_id]
        )
        if (rows.length === 0) throw new Error("Sale not found");

        const [product] = await pool.query(
            "SELECT price FROM products WHERE id = ?", [product_id]
        )
        if (product.length === 0) throw new Error("Product not found");
        const price = product[0].price;

        const [result] = await pool.query(
            `INSERT INTO 
                sales_details (id, sale_id, product_id, quantity,unit_price) 
            VALUES (?, ?, ?, ?,?)`,
            [id, sale_id, product_id, quantity, price]);
        return await SaleDetailModel.getById(id);
    },
    getById: async (id) => {
        const [rows] = await pool.query("SELECT * FROM sales_details WHERE id = ?", [id]);
        if (rows.length === 0) throw new Error("Sale detail not found");
        return rows[0];
    },
    getAllBySaleId: async (sale_id) => {
        const [rows] = await pool.query("SELECT * FROM sales_details WHERE sale_id = ?", [sale_id]);
        return rows;
    },
    update: async (id, quantity, product_id) => {
        const [product] = await pool.query(
            "SELECT price FROM products WHERE id = ?", [product_id]
        )
        if (product.length === 0) throw new Error("Product not found");
        const price = product[0].price;
        const [result] = await pool.query(
            `UPDATE sales_details SET 
                product_id = IFNULL(?, product_id), 
                quantity = IFNULL(?, quantity),
                unit_price = IFNULL(?, unit_price) 
            WHERE id = ?`,
            [product_id, quantity, price, id]
        );
        if (result.affectedRows === 0) throw new Error("Sale detail not found");
        return await SaleDetailModel.getById(id);
    },
    delete: async (id) => {
        const [result] = await pool.query("DELETE FROM sales_details WHERE id = ?", [id]);
        if (result.affectedRows === 0) throw new Error("Sale detail not found");
    },
}