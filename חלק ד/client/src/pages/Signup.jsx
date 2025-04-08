import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, IconButton, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from "react-redux";

import { signUp } from '../api/supplierService.js';
import { supplierIn } from '../features/supplierSlice.js'
import { addNewSupplierToInventory } from '../api/inventoryService.js'

// קומפוננטה להצטרפות של ספק חדש למערכת
const Signup = () => {
    const { register, handleSubmit, control, formState: { errors } } = useForm();
    // טיפול במערך הסחורות
    const { fields, append, remove } = useFieldArray({ control, name: "goods" });
    // בדיקה אם הכניס סחורה או לא על מנת להתריע
    const [isGoods, setIsGoods] = useState("")

    const navigate = useNavigate();
    const dispatch = useDispatch()

    const onSubmit = async (data) => {
        if (data.goods.length === 0) {
            setIsGoods("* יש להוסיף לפחות מוצר אחד")
            return;
        }

        try {
            const res = await signUp(data);
            console.log(res)
            //    הוספת המוצרים לספקים שמיבאים מוצר זה במלאי
            await addNewSupplierToInventory(data.goods, res.data._id)
            dispatch(supplierIn(res.data));
            navigate("/supplierProducts");
        } catch (err) {
            console.error(err);
            if (err.status === 404) {
                alert("קיים ספק כזה")
            }
        }
    };

    return (
        <>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxWidth: 400,
                    margin: 'auto',
                    marginTop: "2%",
                    padding: 3,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: 2,
                }}
            >
                <Typography variant="h6" gutterBottom align="center">
                    טופס הרשמה
                </Typography>

                <TextField
                    label="שם חברה"
                    variant="outlined"
                    {...register("companyName", { required: "שם חברה הוא שדה חובה" })}
                    error={!!errors.companyName}
                    helperText={errors.companyName ? errors.companyName.message : ""}
                    fullWidth
                />

                <TextField
                    label="נציג החברה"
                    variant="outlined"
                    {...register("representativeName", { required: "נציג הוא שדה חובה" })}
                    error={!!errors.representativeName}
                    helperText={errors.representativeName ? errors.representativeName.message : ""}
                    fullWidth
                />

                <TextField
                    label="טלפון"
                    variant="outlined"
                    type="tel"
                    {...register("phone", {
                        required: "טלפון הוא שדה חובה",
                        pattern: {
                            value: /^(\+972|0)5[0-9]{1}-?[0-9]{3}-?[0-9]{4}$/,
                            message: "הכנס מספר טלפון תקני"
                        }
                    })}
                    error={!!errors.phone}
                    helperText={errors.phone ? errors.phone.message : ""}
                    fullWidth
                />

                <TextField
                    label="סיסמה"
                    type="password"
                    variant="outlined"
                    {...register("password", {
                        required: "סיסמה היא שדה חובה",
                        minLength: {
                            value: 7,
                            message: "הסיסמה חייבת להיות לפחות 7 תווים"
                        }
                    })}
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ""}
                    fullWidth
                />

                <Typography variant="h6" gutterBottom align="center" sx={{ marginTop: 2 }}>
                    רשימת סחורה
                </Typography>

                {fields.map((item, index) => (

                    <Grid container spacing={2} key={item.id} sx={{ marginRight: "23%" }}>


                        <Grid item xs={12} sm={4}>
                            <p >
                                {`מוצר ${index + 1}:`}
                            </p>
                            <TextField
                                label="שם המוצר"
                                variant="outlined"
                                {...register(`goods[${index}].name`, { required: "שם המוצר הוא שדה חובה" })}
                                error={!!errors.goods?.[index]?.name}
                                helperText={errors.goods?.[index]?.name ? errors.goods[index].name.message : ""}
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="מחיר"
                                variant="outlined"
                                slotProps={{
                                    htmlInput: {
                                        step: "any"
                                    }
                                }}
                                type="number"
                                {...register(`goods[${index}].price`, {
                                    required: "מחיר הוא שדה חובה",
                                    valueAsNumber: true,
                                    min: { value: 1, message: "המחיר חייב להיות לפחות 1" }
                                })}
                                error={!!errors.goods?.[index]?.price}
                                helperText={errors.goods?.[index]?.price ? errors.goods[index].price.message : ""}
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="כמות מינימלית"
                                variant="outlined"
                                type="number"
                                {...register(`goods[${index}].minCount`, {
                                    required: "כמות מינימלית היא שדה חובה",
                                    valueAsNumber: true,
                                    min: { value: 1, message: "הכמות חייבת להיות לפחות 1" }
                                })}
                                error={!!errors.goods?.[index]?.minCount}
                                helperText={errors.goods?.[index]?.minCount ? errors.goods[index].minCount.message : ""}
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <IconButton onClick={() => remove(index)} color="blue" >
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}

                <Button
                    type="button"
                    variant="outlined"
                    color="primary"
                    onClick={() => append({ name: '', price: 0, minCount: 1 })}
                    sx={{ marginBottom: 2 }}
                >
                    הוסף סחורה
                    <AddIcon sx={{ marginLeft: 1 }} />
                </Button>
                <div>{isGoods}</div>

                <Button type="submit" variant="contained" color="primary">
                    הרשמה
                </Button>
            </Box>
        </>
    );
}

export default Signup;
