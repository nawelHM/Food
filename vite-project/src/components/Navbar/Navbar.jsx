import React from "react";
import {useState , useContext} from "react";
import "./Navbar.css";
import logo from "../../assets/frontend_assets/logo.png";
import search from "../../assets/frontend_assets/search_icon.png";
import basket from "../../assets/frontend_assets/basket_icon.png";
import {Link  } from "react-router-dom";
import { StoreContext } from './../../content/StoreContext';
import { assets } from '../../assets/assets.js';
import { useNavigate } from "react-router-dom";
const Navbar = ({setShowLogin}) => {
const navigate = useNavigate();
    const [menu, setMenu] = useState("home");
      const { getTotalCartAmount , token , setToken} = useContext(StoreContext);


  return (
    <div className="navbar">
   <Link to="/">   <img src={logo} alt="Logo" /> </Link>
      <ul className="navbar-menu">
       <Link to='/' onClick={()=>setMenu("home")} className={menu==="home"?"active":""}>home</Link>
       <a  href='#explore-menu' onClick={()=>setMenu("menu")} className={menu==="menu"?"active":""}>menu</a>
       <a href='#app-download' onClick={()=>setMenu("mobile-app")} className={menu==="mobile-app"?"active":""}>mobile-app</a>
       <a href='#footer' onClick={()=>setMenu("contact-us")} className={menu==="contact-us"?"active":""}>contact us</a>
      </ul>
      <div className="navbar-right">
        <img src={search} alt="search" />
        
       <div className="navbar-basket">
  <Link to="/cart"> <img src={basket} alt="basket" /> </Link>
  <div className={getTotalCartAmount()===0 ? "" : "dot" }></div>
</div>
{!token ? (
  /* Sign in button */
  <button
    onClick={() => setShowLogin(true)}
    className="sign-in-btn"
  >
    Sign in
  </button>
) : (
  <div className="navbar-profile">
    <img src={assets.profile_icon} alt="profile" />

    <ul className="nav-profile-dropdown">
     <li onClick={() => navigate("/orders")} style={{ cursor: "pointer" }}>
        <img src={assets.bag_icon} alt="orders" />
        <p>Orders</p>
      </li>

      <hr />

    <li
  onClick={() => {
    setToken(null);   // 🔥 UI refresh immédiat
  }}
>
  <img src={assets.logout_icon} alt="logout" />
  <p>Logout</p>
</li>

    </ul>
  </div>
)}

       
      </div>
    </div>
  );
};

export default Navbar;
