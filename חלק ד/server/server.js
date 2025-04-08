import express from "express";
import dotenv from "dotenv"
import cors from 'cors'

import { connectToDB } from "./config/DB.js"
import supplierRoutes from "./routes/supplier.js";
import orderRouter from "./routes/order.js";
import inventoryRouter from "./routes/inventory.js";

dotenv.config()
const app = express()
connectToDB()
app.use(cors())
app.use(express.json())


app.use("/api/supplier", supplierRoutes)
app.use("/api/order", orderRouter)
app.use("/api/inventory", inventoryRouter)

app.use((err, req, res, next) => {
    return res.status(500).json({ title: "שגיאה בשרת", message: err.message });
});

let port = process.env.PORT;
app.listen(port, () => {
    console.log("app is listening in port " + port)
})



