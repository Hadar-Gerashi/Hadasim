import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

import { getAllProductInInventory } from '../api/inventoryService'
import '../style/supplierProducts.css'
import Product from "./Product";
import { deleteCart } from '../features/cartSlice.js'
import { currentSupplierOrderOut } from '../features/cartSlice.js';

// קומפוננטה להצגת מוצרי ספק
const ProductList = () => {
    //אם אני לא מנהל אז הצגת כל המוצרים
    const currentSupplier = useSelector(state => state.suppliers.currentSupplier)
    //אם אני מנהל אז ממי אני מזמין
    const currentSupplieOrder = useSelector(state => state.cart.currentSupplier)
    // המוצרים
    const [products, setProducts] = useState([])
    // כמות המוצרים הכללית אם אני במצב של הזמנה -כמובן מנהל
    const [count, setCount] = useState(0)
    // סכום המוצרים  אם אני במצב של הזמנה -כמובן מנהל
    const [sum, setSum] = useState(0)
    const navigate = useNavigate()
    const dispatch = useDispatch()



    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await getAllProductInInventory();
                dispatch(deleteCart())
                dispatch(currentSupplierOrderOut());
                setProducts(res.data)
                console.log(res.data)

            } catch (err) {
                console.log(err);
            }
        }

        fetchProduct()

    }, [])






    return (
        <>
            <div className="products-container">
                {products.map(product => (
                    product.productsInStore.map(p => (
                        p.qty > 0 && (<div className="product-item" key={p._id}>
                            <Product product={p} setCount={setCount} setSum={setSum} />
                        </div>
                        )
                    ))
                ))}
            </div>


            <Box sx={{ mt: 3, padding: 2, borderRadius: 2, boxShadow: 3, backgroundColor: "white", width: "200px", marginRight: "1.5%" }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    כמות כוללת: {count}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    סכום כולל: {sum} ₪
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={sum === 0}
                    onClick={() => navigate('/payment', { state: { status: "clientPay" } })}
                    sx={{
                        mt: 2,
                        width: '100%',
                        backgroundColor: sum > 0 ? 'primary.main' : 'grey.500',
                        '&:hover': { backgroundColor: sum > 0 ? 'primary.dark' : 'grey.700' }
                    }}
                >
                    לתשלום
                </Button>
            </Box>





        </>);
}

export default ProductList;