import { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { CircularProgress } from '@mui/material';

import { getOrdersBySupplier, getOrders } from '../api/orderService.js'
import OrderDetails from '../component/OrderDetails.jsx';
import { getOrdersNotCompleted } from '../api/orderService.js'


// קומפוננטה לרשימת ההזמנות
const OrderList = ({ mood }) => {
    // רשימת ההזמנות
    const [orders, setOrders] = useState([])
    // משתמש נוכחי
    const currentSupplier = useSelector(state => state.suppliers.currentSupplier)
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                let res;
                // אם אתה לא מנהל אתה יכול לראות את ההזמנות שהתבצעו אצלך בלבד
                if (currentSupplier.role == 'USER')
                    res = await getOrdersBySupplier(currentSupplier._id);

                // אם אתה מנהל ואתה רוצה לראות את כל ההזמנות
                else if (mood == 'all')
                    res = await getOrders();
                //  אם אתה מנהל ואתה רוצה לראות את כל ההזמנות הקימות בלבד כלומר בלי אלה שהושלמו
                else
                    res = await getOrdersNotCompleted();

                setOrders(res.data);
            } catch (err) {
                console.log(err);
            }
            finally {
                setLoading(false);
            }
        };

        fetchOrders();


    }, [])

    // פונקציה לעדכון שינוי של הזמנה במערך ההזמנות לראיה מיידת של השינוי ולא לאחר רענון הדף
    const updateOrder = (updatedOrder) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order._id === updatedOrder._id ? updatedOrder : order
            )
        );
    };


    return (<>




        {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                <CircularProgress />
            </div>)
            :
            <>
                {orders.length === 0 ? (
                    <p>{`אין כרגע שום הזמנה :)`}</p> // תוכל להחליף עם רכיב או הודעה אחרת
                ) : (
                    orders.map(order => {
                        return <OrderDetails key={order._id} order={order} updateOrder={updateOrder} />;
                    })
                )}
            </>
        }


    </>


    );
}

export default OrderList;



