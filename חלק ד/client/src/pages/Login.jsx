import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Box, Typography } from '@mui/material';
import { useDispatch } from "react-redux";

import { login } from '../api/supplierService.js'
import { supplierIn } from '../features/supplierSlice.js'

// קומפוננטה לכניסת משתמש
const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const onSubmit = async (data) => {
        try {
            const res = await login(data.password, data.phone);
            // עדכון משתמש נוכחי
            dispatch(supplierIn(res.data));
            if (res.data.role == 'USER')
                navigate("/supplierProducts");

            else
                navigate("/suppliers");

        } catch (err) {
            console.error(err);
            if (err.status === 404) {
                alert("ספק לא רשום")
            }

            if (err.status === 401) {
                alert("סיסמא שגויה")
            }

        }

        console.log(data);
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
                    maxWidth: 250,
                    margin: 'auto',
                    marginTop: "5%",
                    padding: 3,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: 2,
                }}
            >
                <Typography variant="h6" gutterBottom align="center">
                    טופס התחברות
                </Typography>

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


                <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
                    אין לך חשבון?{' '}
                    <Link to="/signup" style={{ textDecoration: 'none', color: '#1976d2' }}>
                        הירשם עכשיו
                    </Link>
                </Typography>

                <Button type="submit" variant="contained" color="primary">
                    שלח
                </Button>
            </Box>
        </>
    );
}

export default Login;
