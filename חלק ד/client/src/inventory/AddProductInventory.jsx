import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Paper, Alert } from "@mui/material";

import { addNewProductByAdmin, addNewSupplierToInventory,addingOrderAutomatically } from '../api/inventoryService.js';
import { getAllSupplier } from '../api/supplierService.js';


export default function AddProductInventory() {
    const [name, setName] = useState("");
    const [minQty, setMinQty] = useState("");
    const [error, setError] = useState(null); // שדה חדש לשמירת השגיאה
    const navigate = useNavigate()


    // מעבר על הספקים לראות מי מייבא מוצר כזה ואם כן להוסיף אותו כספק שמייבא מוצר זה במערך המלאי
    const addSuppliersProductToInventory = async () => {
        const res = await getAllSupplier()
        console.log(res.data)
        for (const supplier of res.data) {
            console.log(supplier.goods)
            if (supplier.goods) {

                for (const good of supplier.goods) {
                    if (good.name == name)
                        await addNewSupplierToInventory([good], supplier._id)
                }

            }
        }
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // איפוס שגיאה קודם

        try {
            // הוספת מוצר למלאי
            await addNewProductByAdmin(name, minQty);
            await addSuppliersProductToInventory()
            let addOrder = {
                [name]: minQty // הערך 10 ייכנס תחת המפתח שנשמר במשתנה minQty
              };
            console.log(addOrder)
            await addingOrderAutomatically(addOrder)
            navigate('/productInventory')
            setName("");
            setMinQty("");
        } catch (err) {
            console.log(err);
            setError("שגיאה בהוספת המוצר. נסה שוב.");
        }
    };

    return (
        <Paper elevation={3} sx={{ maxWidth: 400, mx: "auto", p: 4, marginTop: "5%" }}>
            <Typography variant="h6" gutterBottom>
                הוספת מוצר חדש
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
                <TextField
                    label="שם מוצר"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <TextField
                    label="כמות מינימלית במלאי"
                    type="number"
                    value={minQty}
                    onChange={(e) => setMinQty(e.target.value)}
                    required
                    inputProps={{ min: 0 }}
                />

                <Button type="submit" variant="contained" color="primary">
                    הוסף מוצר
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
        </Paper>
    );
}
