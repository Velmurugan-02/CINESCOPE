import { NavLink } from "react-router-dom";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import "./Navbar.css";
import { useState, useEffect } from "react";

// Vite-safe image import (recommended)
import logo from "../assets/CINESCOPE.jpg";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navWrap${isScrolled ? " scrolled" : ""}`}>

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