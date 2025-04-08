import { useForm } from "react-hook-form";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

import { deleteCart } from '../features/cartSlice'
import { addOrder } from '../api/orderService'
import { addNewProductByNewOrder } from '../api/inventoryService'
import { reductionFromInventory, addingOrderAutomatically } from '../api/inventoryService'



// קומפוננטה לשלם על המוצרים שנבחרו
const Payment = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    // המוצרים שנבחרו לרכישה
    const products = useSelector(state => state.cart.arr);
    // הסכום הכולל של המוצרים
    const sum = useSelector(state => state.cart.sum);
    // כמות המוצרים
    const count = useSelector(state => state.cart.count);
    // ממי מזמינים את המוצרים
    const currentSupplierOrder = useSelector(state => state.cart.currentSupplier)
    // מי המשתמש הנוכחי
    const currentSupplier = useSelector(state => state.suppliers.currentSupplier)

    const location = useLocation();



    let supplierId = currentSupplierOrder?._id
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // פונקציה להצגת התשלום בוצע בהצלחה
    const show = () => {
        Swal.fire({
            title: "Payment sent successfully!",
            text: "Thank you for your purchase!",
            icon: "success",
            confirmButtonText: "Close",
            confirmButtonColor: "#3085d6",
            background: "#fefefe",
            customClass: { popup: "thank-you-popup" },
        }).then(() => {
            if (location.state?.status == "clientPay")
                navigate("/inventory");
            else
                navigate("/suppliers");
        });
    };


    const onSubmit = async (data) => {
        try {
            alert("Processing payment...");
            console.log(products)


            // אם אני במצב קניה של לקוח
            if (location.state?.status == "clientPay") {
                const res = await reductionFromInventory({ products })
                alert("הזמנה אוטומטית מתבצעת")
                await addingOrderAutomatically(res.data)
            }
            // במצב קניה של מנהל החנות של הסחורה מספקים
            else {
                addNewProductByNewOrder(products)
                await addOrder({ count, sum, products, supplierId }, currentSupplier.token);
            }

            show();
            dispatch(deleteCart());
        } catch (err) {
            if (err.response?.status === 401) {
                alert("טוקן לא תקף")
                navigate("/login");
            }
            console.error(err);
        }

    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", marginTop: "-4%" }}>
            <Card style={{ width: 400, padding: 20 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        תשלום
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            fullWidth
                            label="Card Number"
                            variant="outlined"
                            margin="normal"
                            {...register("cardNumber", {
                                required: "Card number is required",
                                pattern: {
                                    value: /^\d{16}$/,
                                    message: "Card number must be 16 digits"
                                }
                            })}
                            error={!!errors.cardNumber}
                            helperText={errors.cardNumber?.message}
                        />
                        <TextField
                            fullWidth
                            label="Expiry Date (MM/YY)"
                            variant="outlined"
                            margin="normal"
                            {...register("expiry", {
                                required: "Expiry date is required",
                                pattern: {
                                    value: /^(0[1-9]|1[0-2])\/(\d{2})$/,
                                    message: "Expiry date must be in MM/YY format"
                                }
                            })}
                            error={!!errors.expiry}
                            helperText={errors.expiry?.message}
                        />
                        <TextField
                            fullWidth
                            label="CVV"
                            variant="outlined"
                            margin="normal"
                            {...register("cvv", {
                                required: "CVV is required",
                                pattern: {
                                    value: /^\d{3,4}$/,
                                    message: "CVV must be 3 or 4 digits"
                                }
                            })}
                            error={!!errors.cvv}
                            helperText={errors.cvv?.message}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            style={{ marginTop: 20 }}
                        >
                            שלם עכשיו
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Payment;
