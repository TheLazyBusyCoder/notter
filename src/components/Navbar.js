import { Link } from "react-router-dom";
import "./Navbar.css";
import { React } from "react";

function Navbar() {
  return (
    <nav className="nav">
      <div className="logo">Noteer...</div>
      {/* <Box link={"/"} text={"Home"} /> */}
    </nav>
  );
}

function Box({ link, text }) {
  return (
    <div className="link">
      <Link style={{ color: "white", textDecoration: "none" }} to={link}>
        {text}
      </Link>
    </div>
  );
}

export default Navbar;
