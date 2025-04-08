import './App.css'
import Login from './pages/Login'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import NavBar from './component/NavBar'
import Signup from './pages/Signup'
import OrderList from './pages/OrderList'
import SupplierList from './pages/SupplierList'
import SupplierProducts from './pages/SupplierProducts'
import Payment from './pages/Payment'
import Inventory from './inventory/Inventory'
import ProductList from './inventory/ProductList'
import AddProductInventory from './inventory/AddProductInventory'




function App() {


  return (
    <>
    <BrowserRouter>
    <NavBar/>
    

    <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/orders' element={<OrderList mood={'all'} key='all'/>}/>
        <Route path='/supplierProducts' element={<SupplierProducts/>}/>
        <Route path='/suppliers' element={<SupplierList/>}/>
        <Route path='/payment' element={<Payment/>}/>
        <Route path='/myOrder' element={<OrderList mood={'notCompleted'} key='notCompleted'/>}/>


        <Route path='/inventory' element={<Inventory/>}/>
        <Route path='/' element={<ProductList/>}/>
        <Route path='/productInventory' element={<AddProductInventory/>}/>


       
      </Routes>
      
   </BrowserRouter>

    </>
  )
}

export default App
