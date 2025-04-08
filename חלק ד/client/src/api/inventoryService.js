import axios from 'axios'

const baseUrl = "http://localhost:4000/api/inventory"

// קבלת כל המוצרים במלאי
export const getAllProductInInventory = () => {
    return axios.get(`${baseUrl}`)
}

// שמוסיפים הזמנה נוסיף את פרטי ההזמנה למלאי המוצרים
export const addNewProductByNewOrder = (products) => {
    return axios.post(`${baseUrl}/order`,{products})
}

// שמוסיפים ספק חדש נכניס אותו כמיבא מוצרים במלאי לפי הסחורה שלו
export const addNewSupplierToInventory = (products,supplierId) => {
    return axios.post(`${baseUrl}`,{products,supplierId})
}

// הוספת מוצר חדש למלאי
export const addNewProductByAdmin = (name,minQty) => {
    return axios.post(`${baseUrl}/product`,{name,minQty})
}

// קניה תגרום להפחתה מהמלאי
export const reductionFromInventory = (products) => {
    return axios.put(`${baseUrl}`,products)
}

// ביצוע הזמנה אוטומטית 
export const addingOrderAutomatically = (products) => {
    return axios.post(`${baseUrl}/orderAutomatically`,products)
}

