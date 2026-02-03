import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
const List = () => {
  const [list, setList] = useState([]);

  // Récupérer tous les aliments
  const fetchList = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/foods/list");
      setList(response.data);
    } catch (error) {
      console.error("Failed to fetch foods:", error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Supprimer un aliment
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await axios.delete(`http://localhost:4000/api/foods/remove/${id}`);
      // Filtrer la liste pour retirer l'item supprimé
      setList((prev) => prev.filter((item) => item._id !== id));
       toast.success("Food deleted successfully ");
    } catch (error) {
      console.error("Failed to delete food:", error);
       toast.error("Failed to delete food");
    }
  };

  return (
    <div className="list add flex-col">
      <h2>Food Items</h2>

      {list.length === 0 && <p>No food found</p>}

      <div className="list-table">
        {/* Header */}
        <div className="list-table-row list-table-header">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span>Action</span>
        </div>

        {/* Rows */}
        {list.map((item) => (
          <div className="list-table-row" key={item._id}>
            <img
              src={`http://localhost:4000${item.image}`}
              alt={item.name}
              className="food-image"
              onError={(e) => (e.target.src = "/no-image.png")}
            />
            <span>{item.name}</span>
            <span>{item.category}</span>
            <span>${item.price}</span>
            <span
              className="delete-btn"
              onClick={() => handleDelete(item._id)}
            >
              X
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
