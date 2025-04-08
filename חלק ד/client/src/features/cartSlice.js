import { createSlice } from "@reduxjs/toolkit"

const updateLocalStorage = (state) => {
    localStorage.setItem('cart', JSON.stringify(state.arr))
    localStorage.setItem('sum', state.sum)
    localStorage.setItem('count', state.count)
}


const initialState = {
    arr: JSON.parse(localStorage.getItem('cart')) || [],
    sum: Number(localStorage.getItem('sum')) || 0,
    count: Number(localStorage.getItem('count')) || 0,
    currentSupplier: JSON.parse(localStorage.getItem('currentSupplierOrder')) || null

}
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            let copy;
            copy = { ...action.payload, qty: action.payload.count }
            state.arr.push(copy)
            console.log(copy)
            state.sum += action.payload.sum;
            state.count += action.payload.count;
            console.log([...state.arr])

            updateLocalStorage(state)
        },
        removeFromCart: (state, action) => {
            let index = state.arr.findIndex(product => product._id == action.payload)
            state.sum -= (state.arr[index].price * state.arr[index].qty);
            state.count -= state.arr[index].qty;
            state.arr.splice(index, 1)
            updateLocalStorage(state)
        },
        deleteCart: (state) => {
            state.sum = 0;
            state.count = 0;
            state.arr = [];
            updateLocalStorage(state)
        }
        , currentSupplierOrder: (state, action) => {
            state.currentSupplier = action.payload;
            localStorage.setItem('currentSupplierOrder', JSON.stringify(state.currentSupplier))

        },
        currentSupplierOrderOut: (state) => {
            state.currentSupplier = null;
            localStorage.setItem('currentSupplierOrder', JSON.stringify(state.currentSupplier))
        },
   





    }
})


export const {currentSupplierOrderOut, currentSupplierOrder, deleteCart, addToCart, removeFromCart, isOpenDrawer } = cartSlice.actions
export default cartSlice.reducer


