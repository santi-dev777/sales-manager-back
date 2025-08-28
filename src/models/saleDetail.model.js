import {pool} from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const SaleDetailModel = {
    create: async (sale_id, product_id, quantity, price) => {
        const id = uuidv4()

        const [result] = await pool.query(
            `INSERT INTO 
                sales_details (id, sale_id, product_id, quantity,unit_price) 
            VALUES (?, ?, ?, ?,?)`,
            [id, sale_id, product_id, quantity, price]);
        return result.affectedRows === 0 ? null : await SaleDetailModel.getById(id);
    },
    getById: async (id) => {
        const [rows] = await pool.query("SELECT * FROM sales_details WHERE id = ?", [id]);
        return rows.length === 0 ? null : rows[0];
    },
    update: async (id, quantity, product_id, price) => {
        const [result] = await pool.query(
            `UPDATE sales_details SET 
                product_id = IFNULL(?, product_id), 
                quantity = IFNULL(?, quantity),
                unit_price = IFNULL(?, unit_price) 
            WHERE id = ?`,
            [product_id, quantity, price, id]
        );
        return result.affectedRows === 0 ? null : await SaleDetailModel.getById(id);
    },
    delete: async (id) => {
        const [result] = await pool.query("DELETE FROM sales_details WHERE id = ?", [id]);
        return result.affectedRows === 0 ? null : true;
    },
}