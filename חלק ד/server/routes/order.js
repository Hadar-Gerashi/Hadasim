import express from 'express'

import {getAllOrders,getOrdersBySupplier,getOrdersNotCompleted,addOrder,updateOrderConfirmationInProcess,updateOrderConfirmationCompleted} from '../controllers/order.js'
import {isManager,isSupplierIn} from '../middleWares/isSupplierIn.js'

const router=express.Router();

router.get("/notCompleted",getOrdersNotCompleted)
router.get("/",getAllOrders)
router.get("/:supplierId",getOrdersBySupplier)
router.post("/",isManager,addOrder)
router.put("/process/:id",isSupplierIn,updateOrderConfirmationInProcess)
router.put("/completed/:id",isManager,updateOrderConfirmationCompleted)

export default router