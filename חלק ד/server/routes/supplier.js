import express from 'express'

import {sign_up,login ,getAllsupplier,getSupplierById,} from '../controllers/supplier.js'


const router=express.Router();

router.get("/",getAllsupplier)
router.get("/:id",getSupplierById)
router.post("/",sign_up)
router.post("/login",login)


export default router