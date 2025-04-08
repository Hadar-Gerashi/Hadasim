import { Schema, model ,Types} from "mongoose"

export const productSchema = Schema({
name:String,
price:Number,
minCount:Number,
qty:Number
})

export const productModel = model("products", productSchema)


