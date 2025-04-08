import { useDispatch, useSelector } from "react-redux"
import { NavLink, useNavigate } from "react-router-dom"
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton } from "@mui/material";

import { supplierOut } from '../features/supplierSlice.js';
import { currentSupplierOrderOut, deleteCart } from '../features/cartSlice.js';
import '../style/navbar.css'


// קומפוננטה להצגת הנבבר של האתר
export default function NavBar() {
    const currentSupplier = useSelector(state => state.suppliers.currentSupplier)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    console.log(currentSupplier);

    return <>

        <ul className="header_links">


            {currentSupplier && (
                <IconButton style={{ height: "40px", marginTop: "15px" }} color="white" onClick={() => {
                    dispatch(supplierOut());
                    dispatch(currentSupplierOrderOut());
                    dispatch(deleteCart())

                    navigate('/login');
                }}>
                    <LogoutIcon sx={{ color: "white" }} />
                </IconButton>
            )}
            <li><NavLink to="/">למוצרים </NavLink></li>

            {currentSupplier == null && <>
                <li><NavLink to="/login">להתחברות</NavLink></li>
                <li><NavLink to="/signup">להרשמה</NavLink></li>
            </>}



            {currentSupplier?.role == 'USER' && <>
                <li><NavLink to="/supplierProducts">למוצרים שלי</NavLink></li>
                <li><NavLink to="/orders"> להזמנות של בעל המכולת</NavLink></li>

            </>}


            {currentSupplier?.role == 'ADMIN' && <>
                <li><NavLink to="/suppliers">לספקים</NavLink></li>
                <li><NavLink to="/myOrder">הזמנות שבדרך</NavLink></li>
                <li><NavLink to="/orders">כל ההזמנות</NavLink></li>
                <li><NavLink to="/inventory">למלאי שלי</NavLink></li>
                <li><NavLink to="/productInventory">הוספת מוצר למלאי </NavLink></li>
            </>}


        </ul>
    </>

}
