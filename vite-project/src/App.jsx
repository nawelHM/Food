import React , {useState} from 'react'
import Navbar from './components/Navbar/Navbar'
import {Routes , Route} from 'react-router-dom'
import Placerorder from './pages/PlaceOrder/Placerorder.jsx'
import Cart from './pages/Cart/Cart'
import Home from './pages/Home/Home'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup';
import Orders from "./order/Orders.jsx";
import axios from 'axios';
const App = () => {
  const[showLogin,setShowLogin]=useState(false);
axios.defaults.withCredentials = true;
  return (

    <> 
    {showLogin?<LoginPopup setShowLogin={setShowLogin} />:<></>}
    <div className='app'>
      <Navbar setShowLogin={setShowLogin} />
      <Routes>
        <Route path='/' element={<Home/>} />
         <Route path='/cart' element={<Cart/>} />
          <Route path='/order' element={<Placerorder/>} />
          <Route path="/orders" element={<Orders />} />

      </Routes>
    </div>
    <Footer />
    </>
  )
}

export default App
