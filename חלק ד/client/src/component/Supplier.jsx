import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { currentSupplierOrder } from '../features/cartSlice.js'
import { deleteCart } from '../features/cartSlice.js'

// קומפוננטה להצגת ספק בודד
const Supplier = ({ supplier }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()



    return (
        <Card sx={{ maxWidth: 345, margin: '20px' }}>
            <CardContent>
                <Typography variant="h6" component="div">
                    שם חברה: {supplier.companyName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    נציג: {supplier.representativeName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    טלפון: {supplier.phone}
                </Typography>
                <Button onClick={() => {
                    // שאני לוחצת על ספק מסוים נעדכן שזה ספק שאנו בתהליך הזמנה איתו ונמחק את כל הפריטים שהיו עד עכשיו ברכישה
                    dispatch(currentSupplierOrder(supplier))
                    dispatch(deleteCart())
                    navigate('/supplierProducts')
                }}>להזמנת סחורה</Button>


            </CardContent>
        </Card>
    );
};

export default Supplier;
