import { z } from "zod";

const userSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

export function validateRegister(data) {
    return userSchema.safeParse(data);
}

export function validateLogin(data) {
    return userSchema.pick({ email: true, password: true }).safeParse(data);
}