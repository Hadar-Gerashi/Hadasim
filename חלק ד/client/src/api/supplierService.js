import axios from 'axios'

// const baseUrl = "https://grocery-1-350n.onrender.com/api/supplier"
const baseUrl = "http://localhost:4000/api/supplier"


//אפשרות לכניסת ספק
export const login = (password,phone) => {
    return axios.post(`${baseUrl}/login`,{password,phone})
}

//אפשרות להוספת ספק
export const signUp = (data) => {
    return axios.post(`${baseUrl}`,data)
}

//קבלת כל הספקים
export const getAllSupplier = () => {
    return axios.get(`${baseUrl}`)
}

// קבלת ספק לפי המזהה שלו
export const getSupplierById = (id) => {
    return axios.get(`${baseUrl}/${id}`)
}




