import headerImg from "../../assets/header_img.png";
import "./Header.css";

function Header() {
  return (
    <div className="header" style={{ backgroundImage: `url(${headerImg})` }}>
      <div className="header-contents">
        <h2>Order your favourite food here</h2>
        <p>Choose from a diverse menu...</p>
        <button>View Menu</button>
      </div>
    </div>
  );
}

export default Header;
