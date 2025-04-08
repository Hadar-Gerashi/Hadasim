import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';

import { getAllSupplier } from '../api/supplierService.js'
import Supplier from '../component/Supplier.jsx';

// קומפוננטה להצגת רשימת הספקים
const SupplierList = () => {
  // רשימת הספקים
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(false);



  useEffect(() => {

    const fetchSuppliers = async () => {

      try {
        setLoading(true);
        const res = await getAllSupplier();
        console.log(res.data);
        setSuppliers(res.data);
      } catch (err) {
        console.log(err);
      }
      finally {
        setLoading(false);
      }
    };

    fetchSuppliers();


  }, [])


  return (

    <>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <CircularProgress />
        </div>) :

        <div className="products-container">
          {suppliers.map(supplier => {
            if (supplier.role != 'ADMIN')
              return <Supplier className="product-item" key={supplier._id} supplier={supplier} />
          })}
        </div>
      }
    </>
  );
}

export default SupplierList;