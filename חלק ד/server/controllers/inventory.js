import { inventoryModel } from '../modules/inventory.js'
import { supplierModel } from '../modules/supplier.js'
import { Types } from 'mongoose';

import { orderModel } from '../modules/order.js'



// שנוסף ספק חדש שומרים אותו כמייבא את הסחורה שלו במערך המלאי
export async function addNewSupplierToInventory(req, res) {
    let { products, supplierId } = req.body
    try {

        for (let product of products) {
            let { name } = product;

            let result = await inventoryModel.findOne({ name: name })
            if (result) {
                if (!result.suppliers.includes(supplierId)) {
                    result.suppliers.push(supplierId);
                    await result.save();
                }

            }
        }


        res.json("ספק נוסף בהצלחה")

    }
    catch (err) {
        console.log(err)
        res.status(400).json({ title: "can't add this supplier", massege: err.massege })
    }
}



// מנהל יכול להוסיף מוצר למלאי
export async function addNewProductByAdmin(req, res) {
    let { body } = req

    if (!body.minQty || !body.name)
        return res.status(400).json({ title: "can't add new product", massege: "you are missing required fields" })

    if (body.minQty <= 0)
        return res.status(400).json({ title: "can't add new product", massege: "minQty need be bigger than 0" })


    try {
        let isExist = await inventoryModel.findOne({ name: body.name }).lean();
        if (isExist)
            return res.status(404).json({ title: "can't add new product", massege: "name already exist" })


        let newData = new inventoryModel(body)
        let data = await newData.save()
        res.json(data)

    }

    catch (err) {
        console.log(err)
        res.status(400).json({ title: "can't add new product", massege: err.massege })
    }
}



// שנוספת הזמנה חדשה נוסיף את המוצרים שהזמינו למערך המלאי
export async function addNewProductByNewOrder(req, res) {
    let { body } = req


    if (!body.products)
        return res.status(400).json({ title: "can't add new product", massege: "you are missing required fields" })

    try {


        for (let product of body.products) {

            let { name, qty, _id } = product;

            let result = await inventoryModel.findOne({ name: name })
            if (result) {
                result.inventoryQty += Number(qty)

                const existingProductIndex = result.productsInStore.findIndex(p => String(p._id) === String(_id));
                console.log(existingProductIndex)

                if (existingProductIndex !== -1) {
                    // אם המוצר קיים, עדכן את הכמות והסכום שלו
                    const existingProduct = result.productsInStore[existingProductIndex];
                    existingProduct.qty += qty; // הוסף כמות חדשה

                }
                else
                    result.productsInStore.push(product)
                await result.save();

            }

        }
       
    }

    catch (err) {
        console.log(err)
        res.status(400).json({ title: "can't add new product by order", massege: err.massege })
    }
}



//קבלת כל המוצרים במלאי וכמות מינימלית
export async function getAllProductInInventory(req, res) {
    try {
        let data = await inventoryModel.find()
        res.json(data)
    }

    catch (err) {
        console.log(err)
        res.status(400).json({ title: "can't get all products", massege: err.massege })
    }

}


// אם קונים מוצרים אז הפחתתם מהמלאי
export async function reductionFromInventory(req, res) {
    let { products } = req.body
    try {
        let resultes = {}
        for (let product of products) {
            let result = await inventoryModel.findOne({ name: product.name })

            result.inventoryQty -= product.qty

            const existingProductIndex = result.productsInStore.findIndex(p => String(p._id) === String(product._id));


            const existingProduct = result.productsInStore[existingProductIndex];
            console.log(product)
            existingProduct.qty -= product.qty;
            console.log(existingProduct.qty)
            if (Number(existingProduct.qty) <= 0) {
                resultes[product.name] = result.minQty;

            }

            await result.save();

        }
        res.json(resultes)

    }

    catch (err) {
        console.log(err)
        res.status(400).json({ title: "can't reduce products", massege: err.massege })
    }

}



// ההזמנה האוטומטית שהקופה עושה כאשר מוצא אוזל מהמלאי
export async function addingOrderAutomatically(req, res) {
    let products = req.body
    const { ObjectId } = Types;
    try {

        let productCheap = {}
        let productSupplier
        for (let productName in products) {

            let result = await inventoryModel.findOne({ name: productName })
            console.log(result)
            let min = Infinity

            for (let supplier of result.suppliers) {
                let currentSupplier = await supplierModel.findById(supplier)

                for (let good of currentSupplier.goods) {
                    if (good.name==productName && good.price < min) {
                        min = good.price

                        productCheap = good
                        productSupplier = currentSupplier._id

                    }

                }

            }

            if (productCheap.minCount > products[productName])
                productCheap.qty = productCheap.minCount

            else
                productCheap.qty = products[productName]


            let order = {
                supplierId: productSupplier.toString(),
                products: [productCheap],
                count: products[productName],
                sum: products[productName] * productCheap.price
            };

            console.log(order)
            let newData = new orderModel(order)

            let data = await newData.save()
            console.log(data)

            const req = {
                body: {
                    products: [productCheap]
                }
            }
            await addNewProductByNewOrder(req)



        }
        res.json("ההזמנה האוטומטית הצליחה")

    }

    catch (err) {
        console.log(err)
        res.status(400).json({ title: "can't adding order automatically", massege: err.massege })
    }

}










