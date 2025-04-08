import { Schema, model, Types } from "mongoose"
import { productSchema } from './product.js'


export const inventorySchema = Schema({
    name: String,
    minQty: { type: Number },
    inventoryQty: { type: Number, default: 0 },
    suppliers: {
        type: [Types.ObjectId],
        ref: "Suppliers"
    }
    ,
    productsInStore: { type: [productSchema], default: [] }

})

export const inventoryModel = model("inventorys", inventorySchema)


