import { Card, CardContent, Checkbox, TextField, Typography, Box, Button } from "@mui/material";
import { useState } from "react";
import { useDispatch, } from "react-redux";

import { addToCart, removeFromCart } from "../features/cartSlice";

// קומפוננטה להצגת פרטי מוצר
const Product = ({ product, setCount, setSum }) => {
    // הערך שמוצג בinput של כמות מינימלית שמאותחל במינימום ומשתנה בעת שינוי
    const [value, setValue] = useState(1);
    //   הסכום המלא למוצר זה שמוצג בקומפוננטה של המוצר 
    const [fullSum, setFullSum] = useState(value * product.price);
    // אם המוצא נבחר או שלא
    const [isChecked, setIsChecked] = useState(false)
    // ספק נוכחי שממנו מזמינים או שעליו נמצאים
    const dispatch = useDispatch();




    const handleChange = (e) => {
        const newValue = parseInt(e.target.value, 10);
        //אם זה לא מספר או שזה פחות ממגבלת המינימום
        if (isNaN(newValue) || newValue > product.qty) {
            setValue(product.qty);
        } else {
            const priceSum = newValue * product.price;
            const countDiff = newValue - value;
            setValue(newValue);
            setFullSum(priceSum);


            // רק אם בחרנו את המוצר נוסיף לסכום הכללי ולכמות הכללית מוצר זה
            if (isChecked) {
                dispatch(removeFromCart(product._id));
                dispatch(addToCart({ ...product, sum: priceSum, count: newValue }));

                setCount(prev => prev + countDiff);
                // אם אתה נבחרת כבר אז נפחית מהסכום הכללי את מה שהיה עד עכשיו ונוסיף את הסכום הנוכחי לפי השינוי
                setSum(prev => prev - fullSum + priceSum);
            }
        }
    };


    return (
        <Card sx={{ maxWidth: 345, padding: 3, borderRadius: 2 }}>
            <CardContent>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Checkbox sx={{ marginRight: "-5%" }} onClick={(e) => {
                        if (e.target.checked) {
                            // אם המוצר נבחר אז נוסיף אותו לעגלה כביכול ונוסיף לסכום ןלכמות
                            setIsChecked(true)
                            dispatch(addToCart({ ...product, sum: fullSum, count: value }));
                            setCount(prev => prev + value);
                            setSum(prev => prev + fullSum);
                        } else {
                            // אחרת נעשה ההפך
                            setIsChecked(false)
                            dispatch(removeFromCart(product._id));
                            setCount(prev => prev - value);
                            setSum(prev => prev - fullSum);
                        }
                    }} />
                    <Typography variant="body2" color="text.secondary">הוסף לסל</Typography>
                </Box>


                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mt: 2 }}>
                    {product.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    מחיר: {product.price} ₪
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    כמות במלאי: {product.qty}
                </Typography>


                <>
                    <TextField
                        type="number"
                        label="כמות"
                        value={value}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <Typography variant="body1" color="text.secondary">
                        מחיר סופי: {fullSum} ₪
                    </Typography>
                </>

            </CardContent>
        </Card>
    );
};

export default Product;
