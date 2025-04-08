import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography, List, ListItem, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { updateOrderConfirmationInProcess, updateOrderConfirmationCompleted } from '../api/orderService.js';
import { getSupplierById } from '../api/supplierService.js';

// קומפוננטה להצגת פרטי הזמנה
const OrderDetails = ({ order, updateOrder }) => {
    // פרטי ההזמנה
    const { _id, date, orderConfirmation, products, supplierId } = order;
    // משתמש נוכחי
    const currentSupplier = useSelector(state => state.suppliers.currentSupplier);
    // פרטי ספק שממנו הזמינו
    const [supplierDetails, setSupplierDetails] = useState()
    const navigate = useNavigate();


    // קבלת פרטי ספק שממנו הזמינו 
    useEffect(() => {
        const fetchSupplierId = async () => {
            try {
                const res = await getSupplierById(supplierId);
                // הוספת פרטי ההזמנה למלאי
                setSupplierDetails(res.data)

            } catch (err) {
                console.log(err);
            }
        }

        fetchSupplierId()

    }, [])



    //הצגת פורמט של תאריך
    const formatDate = (dateString) => {
        const dateObj = new Date(dateString);
        return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`;
    };


    // אפשרות לשנות את סטטוס ההזמנה לפי הרשאה כמובן
    const changeOrderConfirmation = async () => {
        try {
            let res;
            if (currentSupplier.role === 'ADMIN' && order.orderConfirmation === 'INPROCESS') {
                res = await updateOrderConfirmationCompleted(_id, currentSupplier.token);


            }
            else if (currentSupplier.role === 'USER' && order.orderConfirmation === 'PENDING') {
                res = await updateOrderConfirmationInProcess(_id, currentSupplier.token);

            }

            // שינוי ברשימת ההזמנות את ההזמנה הנוכחית לראיה מיידית של שינוי סטטוס 
            updateOrder(res.data);



        } catch (err) {
            if (err.response?.status === 401) {
                alert("טוקן לא תקף");
                navigate("/login");
            }
            console.log(err);
        }
    };

    return (
        <Card sx={{ maxWidth: 600, margin: "20px auto", boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>הזמנה {_id}</Typography>
                <Typography variant="h6" gutterBottom>שם ספק: {supplierDetails?.companyName}</Typography>
                <Typography variant="body2" color="textSecondary">טלפון חברה: {supplierDetails?.phone}</Typography>
                <Typography variant="body2" color="textSecondary">נציג החברה: {supplierDetails?.representativeName}</Typography>
                <Typography variant="body2" color="textSecondary">תאריך הזמנה: {formatDate(date)}</Typography>



                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle1">סטטוס הזמנה:</Typography>
                    <Button
                        variant="contained"
                        disabled={orderConfirmation === "COMPLETED"}
                        color={
                            orderConfirmation === "COMPLETED" ? "success" :
                                orderConfirmation === "PENDING" ? "primary" :
                                    orderConfirmation === "INPROCESS" ? "warning" : "default"
                        }
                        onClick={changeOrderConfirmation}
                    >
                        {orderConfirmation}
                    </Button>
                </Box>
                <Typography variant="subtitle1" sx={{ mt: 3 }}>מוצרים בהזמנה:</Typography>
                <List sx={{ textAlign: "right" }}>
                    {products.map((product, index) => (
                        <ListItem key={index} sx={{ border: "1px solid #ddd", borderRadius: 1, mb: 1, padding: "10px", justifyContent: "flex-start" }}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                <Typography variant="body1"><strong>שם מוצר:</strong> {product.name}</Typography>
                                <Typography variant="body2"><strong>מחיר:</strong> {product.price} ש"ח</Typography>
                                <Typography variant="body2"><strong>כמות:</strong> {product.qty}</Typography>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default OrderDetails;
