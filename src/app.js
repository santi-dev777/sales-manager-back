import express, { json } from "express"
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import saleRoutes from "./routes/sale.routes.js";

const app = express()

dotenv.config();

app.use(json())
app.use(morgan("dev"))
app.use(cookieParser())

app.use("/auth", userRoutes)
app.use("/category", categoryRoutes)
app.use("/product", productRoutes)
app.use("/sale", saleRoutes)

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`)
})


