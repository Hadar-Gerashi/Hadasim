import { Schema, model, Types } from "mongoose"
import Joi from 'joi';

import { productSchema } from './product.js'

export const supplierSchema = Schema({
    companyName: String,
    phone: String,
    representativeName: String,
    goods:{type:[productSchema],default:undefined},
    role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: 'USER'
    }
    , password: { type: String }


})

export const supplierModel = model("suppliers", supplierSchema)





export function validateAddSupplier(supplier) {
    const JoiSchema = Joi.object({
        companyName: Joi.string()
            .min(1)
            .max(30)
            .required(),

        phone: Joi.string()
            .min(10)
            .max(15)
            .pattern(/^(\+972|0)5[0-9]{1}-?[0-9]{3}-?[0-9]{4}$/) // אימות מספר טלפון תקני
            .required(),

        representativeName: Joi.string()
            .min(2)
            .max(30)
            .required(),

        goods: Joi.array().items(
            Joi.object({
                name: Joi.string().min(2).max(100).required(),
                price: Joi.number().positive().required(),
                minCount: Joi.number().integer().positive().required()
            })
        ).required(),


        role: Joi.string()
            .default("USER")
            .valid("USER", "ADMIN")
            .optional(),
        password: Joi.string()
            .min(7)
            .required()

    }).options({ abortEarly: false });

    return JoiSchema.validate(supplier);
}




export function validateLoginSupplier(supplier) {
    const JoiSchema = Joi.object({


        phone: Joi.string()
            .min(10)
            .max(15)
            .pattern(/^(\+972|0)5[0-9]{1}-?[0-9]{3}-?[0-9]{4}$/) // אימות מספר טלפון תקני
            .required(),
        password: Joi.string()
            .min(7)
            .required()

    }).options({ abortEarly: false });

    return JoiSchema.validate(supplier);
}



export function validateManager(supplier) {
    const JoiSchema = Joi.object({

        phone: Joi.string()
            .min(10)
            .max(15)
            .pattern(/^(\+972|0)5[0-9]{1}-?[0-9]{3}-?[0-9]{4}$/) // אימות מספר טלפון תקני
            .required(),

        role: Joi.string()
            .valid("USER", "ADMIN")
            .required(),
        password: Joi.string()
            .min(7)
            .required()


    }).options({ abortEarly: false });

    return JoiSchema.validate(supplier);
}






