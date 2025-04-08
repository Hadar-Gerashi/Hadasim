import express from 'express'

import { addingOrderAutomatically, reductionFromInventory, getAllProductInInventory, addNewProductByAdmin, addNewSupplierToInventory, addNewProductByNewOrder } from '../controllers/inventory.js'

const router = express.Router();

router.get("/", getAllProductInInventory)
router.post('/product', addNewProductByAdmin)
router.post('/', addNewSupplierToInventory)
router.post('/order', addNewProductByNewOrder)
router.post('/orderAutomatically', addingOrderAutomatically)
router.put('/', reductionFromInventory)


export default router