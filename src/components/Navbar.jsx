import { NavLink } from "react-router-dom";
import SearchBar from "./SearchBar";
import "./StyleNavbar.css";

// Vite-safe image import (recommended)
import logo from "../assets/CINESCOPE.jpg";

export default function Navbar() {
  return (
    <header className="navWrap">
      <nav className="nav">
        {/* LEFT */}
        <div className="navLeft">
          <img className="logo" src={logo} alt="Cinescope" />
          <NavLink className="navLink" to="/">
            Home
          </NavLink>
        </div>

        {/* CENTER */}
        <div className="navCenter">
          <SearchBar />
        </div>

        {/* RIGHT */}
        <div className="navRight">
          <NavLink className="navLink" to="/movies">Movies</NavLink>
          <NavLink className="navLink" to="/people">People</NavLink>
          <NavLink className="navLink" to="/tv">TV Shows</NavLink>
          <NavLink className="navLink" to="/watchlist">Watchlist</NavLink>
        </div>
      </nav>
    </header>
  );
}
