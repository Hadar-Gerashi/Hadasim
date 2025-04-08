import { orderModel } from '../modules/order.js'


//קבלת כל ההזמנות של בעל המכולת 
export async function getAllOrders(req, res) {
    try {
        let data = await orderModel.find()
        res.json(data)
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ title: "can't get all orders", massege: err.massege })
    }
}



//קבלת כל ההזמנות הקימות - לא אלה שהושלמו כבר של בעל המכולת 
export async function getOrdersNotCompleted(req, res) {
    try {
        let data = await orderModel.find({ orderConfirmation: { $ne: "COMPLETED" } })

        if (data.length === 0) {
            return res.status(404).json({ title: "No orders not completed", message: "No orders found with status different than COMPLETED" });
        }

        res.json(data);

    }
    catch (err) {
        console.log(err)
        res.status(400).json({ title: "can't get all orders", massege: err.massege })
    }
}



//קבלת כל ההזמנות שבוצעו אצל ספק מסוים
export async function getOrdersBySupplier(req, res) {
    let { supplierId } = req.params
    try {
        let result = await orderModel.find({ supplierId: supplierId })
        res.json(result)
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ title: "can't get all order for this supplier", massege: err.massege })
    }

}


// אישור הגעת המוצרים לבעל המכולת
export async function updateOrderConfirmationCompleted(req, res) {
    let { id } = req.params
    try {
        let data = await orderModel.findByIdAndUpdate(id, { orderConfirmation: 'COMPLETED' }, { new: true })
        if (!data)
            return res.status(404).json({ title: "can't update this order", massege: "No such id found" })
        res.json(data)
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ title: "can't update order", massege: err.massege })
    }
}



// אישור הגעת המוצרים לספק
export async function updateOrderConfirmationInProcess(req, res) {
    let { id } = req.params
    try {
        let data = await orderModel.findByIdAndUpdate(id, { orderConfirmation: 'INPROCESS' }, { new: true })
        if (!data)
            return res.status(404).json({ title: "can't update this order", massege: "No such id found" })
        res.json(data)
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ title: "can't update order", massege: err.massege })
    }
}



//הוספת הזמנה חדשה
export async function addOrder(req, res) {
    let { body } = req

    if (!body.supplierId || !body.products || !body.sum || !body.count)
        return res.status(400).json({ title: "can't add new order", massege: "you are missing required fields" })

    if (body.date || body.orderConfirmation)
        return res.status(400).json({ title: "fields error", massege: "you tried to initialize a date or orderConfirmation field" })

    if (body.sum < 0 || body.count < 0)
        return res.status(400).json({ title: "fields error", massege: "sum or count cannot be negative" })




    try {

        let newData = new orderModel(body)
        let data = await newData.save()
        res.json(data)
    }

    catch (err) {
        console.log(err)
        res.status(400).json({ title: "can't add new order", massege: err.massege })
    }
}
