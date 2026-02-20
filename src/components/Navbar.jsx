import { NavLink } from "react-router-dom";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import "./Navbar.css";

// Vite-safe image import (recommended)
import logo from "../assets/CINESCOPE.jpg";

export default function Navbar() {
  return (
    <header className="navWrap">
      <nav className="nav">
        {/* LEFT */}
        <div className="navLeft">
          <img className="logo" src={logo} alt="Cinescope" />
          <NavLink 
            className={({ isActive }) => 
              isActive ? "navLink active" : "navLink"
            } 
            to="/"
          >
            Home
          </NavLink>
        </div>

        {/* CENTER */}
        <div className="navCenter">
          <SearchBar />
        </div>

        {/* RIGHT */}
        <div className="navRight">
          <NavLink 
            className={({ isActive }) => 
              isActive ? "navLink active" : "navLink"
            } 
            to="/movies"
          >
            Movies
          </NavLink>
          <NavLink 
            className={({ isActive }) => 
              isActive ? "navLink active" : "navLink"
            } 
            to="/people"
          >
            People
          </NavLink>
          <NavLink 
            className={({ isActive }) => 
              isActive ? "navLink active" : "navLink"
            } 
            to="/tv"
          >
            TV Shows
          </NavLink>
          <NavLink 
            className={({ isActive }) => 
              isActive ? "navLink active" : "navLink"
            } 
            to="/watchlist"
          >
            Watchlist
          </NavLink>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}