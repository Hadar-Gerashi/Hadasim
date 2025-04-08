import { configureStore } from "@reduxjs/toolkit";
import supplierSlice from "../features/supplierSlice.js";
import cartSlice from "../features/cartSlice.js";

export const store = configureStore({
    reducer: {
        suppliers: supplierSlice,
        cart: cartSlice
    }
})