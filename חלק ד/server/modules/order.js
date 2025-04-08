import { Schema, model, Types } from "mongoose"

import { productSchema } from './product.js'


export const orderSchema = Schema({
    date: { type: Date, default: new Date() },
    supplierId: {
        type: Types.ObjectId,
        ref: "Suppliers"
    },
    orderConfirmation: {
        type: String,
        enum: ['COMPLETED', 'INPROCESS', 'PENDING'],
        default: 'PENDING'
    },
    products: [productSchema],
    count: Number,
    sum: Number

})

export const orderModel = model("order", orderSchema)


