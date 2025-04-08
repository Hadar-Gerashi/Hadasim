import axios from 'axios'

const baseUrl = "http://localhost:4000/api/order"

//אפשרות להוספת הזמנה
export const addOrder = (data, token) => {
    console.log(data)
    return axios.post(`${baseUrl}`, data, {
        headers: {
            authorization: token
        }
    })
}

//אפשרות לקבלת רשימת הזמנות לפי ספק
export const getOrdersBySupplier = (supplierId) => {
    return axios.get(`${baseUrl}/${supplierId}`)
}


//אפשרות לקבלת כל ההזמנות שבוצעו
export const getOrders = () => {
    return axios.get(`${baseUrl}/`)
}

// אפשרות לשנות סטטוס הזמנה ל inprocess כמובן רק לספק
export const updateOrderConfirmationInProcess = (orderId,token) => {
    return axios.put(`${baseUrl}/process/${orderId}`,{},
    {
        headers: {
            authorization: token
        }
    })
}


//קבלת כל ההזמנות הקימות שלא הושלמו כבר
export const getOrdersNotCompleted = () => {
    return axios.get(`${baseUrl}/notCompleted`)
}


// אפשרות לשנות סטטוס הזמנה ל completed כמובן רק למנהל
export const updateOrderConfirmationCompleted = (orderId,token) => {
    return axios.put(`${baseUrl}/completed/${orderId}`,{}, {
        headers: {
            authorization: token
        }
    })
}






