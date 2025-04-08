import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

import ProductDetails from "../component/ProductDetails";
import '../style/supplierProducts.css'

// קומפוננטה להצגת מוצרי ספק
const SupplierProducts = () => {
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



    useEffect(() => {

        // אם אני מנהל אז זה אומר שזה משתנה של ממי אני מזמין עכשיו אז תציג את הפרטים שלו
        if (currentSupplieOrder) {

            setProducts(currentSupplieOrder.goods)
        }
        // אחרת תציג פרטי המשתמש-הספק
        else {

            setProducts(currentSupplier.goods)
        }
    }, []);






    return (
        <> 
            {currentSupplieOrder ? <h1>{currentSupplieOrder.companyName}</h1> : <h1>{currentSupplier.companyName}</h1>}
            <div className="products-container">
                {products.map(product => (
                    <div className="product-item" key={product._id}>
                        <ProductDetails product={product} setCount={setCount} setSum={setSum} />
                    </div>
                ))}
            </div>


            {/* אם אני מנהל אז יוצג לי סכום וכמות כללי וכפתור לרכישה */}
            {currentSupplier?.role === 'ADMIN' && (
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
                        onClick={() => navigate('/payment')}
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
            )}





        </>);
}

export default SupplierProducts;