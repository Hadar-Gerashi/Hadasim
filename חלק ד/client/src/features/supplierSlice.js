import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    currentSupplier: JSON.parse(localStorage.getItem('currentSupplier')) || null
}

const supplierSlice = createSlice({
    name: "supplier",
    initialState,
    reducers: {
        supplierIn: (state, action) => {
            state.currentSupplier = action.payload;
            localStorage.setItem('currentSupplier', JSON.stringify(state.currentSupplier))
        },
        supplierOut: (state) => {
            state.currentSupplier = null;
            localStorage.setItem('currentSupplier', JSON.stringify(state.currentSupplier))
        }


    }
})



export const { supplierIn, supplierOut } = supplierSlice.actions
export default supplierSlice.reducer


