import { useEffect, useState } from 'react'
import { Box, Typography, List, ListItem, Paper, Grid, CircularProgress } from '@mui/material';

import { getAllProductInInventory } from '../api/inventoryService.js'


const Inventory = () => {
    // מערך המוצרים שבמלאי
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await getAllProductInInventory();
                setProducts(res.data)
            } catch (err) {
                console.log(err);
            }
            finally {
                setLoading(false);
            }
        }

        fetchProduct()
    }, [])




    return (<>{loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <CircularProgress />
        </div>)
        :
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                ניהול מלאי
            </Typography>

            <Grid container spacing={3}>
                {products.map((p, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper
                            sx={{
                                padding: 2,
                                borderRadius: 2,
                                boxShadow: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: '300px'
                                , width: "250px" // כל כרטיס יהיה בגובה אחיד
                            }}>
                            <Typography variant="h6" sx={{ flexShrink: 0 }}>
                                {p.name}
                            </Typography>
                            <Typography variant="body1" sx={{ marginBottom: 1 }}>
                                <strong>כמות במלאי:</strong> {p.inventoryQty}
                            </Typography>
                            <Typography variant="body1" sx={{ marginBottom: 1 }}>
                                <strong>כמות מינימלית:</strong> {p.minQty}
                            </Typography>
                            <Typography variant="body1" sx={{ marginBottom: 1 }}>
                                <strong>ספקים:</strong>
                            </Typography>
                            <List sx={{ paddingLeft: 2, flexGrow: 1 }}>
                                {p.suppliers.map((supplierId, idx) => (
                                    <ListItem key={idx}>
                                        <Typography variant="body2">{supplierId}</Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>}</>
    );
}

export default Inventory;
