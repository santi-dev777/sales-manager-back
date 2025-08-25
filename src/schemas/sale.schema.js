import { z } from "zod";

const saleSchema = z.object({
    product_id: z.string(),
    quantity: z.number().min(1, "Quantity must be at least 1")
});

export const validateSaleDetail = (data) => {
    return saleSchema.safeParse(data);
}

export const validateSaleDetailUpdate = (data) => {
    return saleSchema.partial().safeParse(data);
}


