import React from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets.js";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/add" className="sidebar-option">
          <img src={assets.add_icon} alt="Add Items" />
          <span>Add Items</span>
        </NavLink>

        <NavLink to="/list" className="sidebar-option">
          <img src={assets.order_icon} alt="List Items" />
          <span>List Items</span>
        </NavLink>

        <NavLink to="/orders" className="sidebar-option">
          <img src={assets.order_icon} alt="Orders" />
          <span>Orders</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
