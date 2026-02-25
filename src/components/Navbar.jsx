import { NavLink } from "react-router-dom";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import { useState, useEffect } from "react";
import { Home, Film, Tv, Users, Bookmark, Menu, X } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change / outside click
  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const links = [
    { to: "/", label: "Home", Icon: Home },
    { to: "/movies", label: "Movies", Icon: Film },
    { to: "/tv", label: "TV Shows", Icon: Tv },
    { to: "/people", label: "People", Icon: Users },
    { to: "/watchlist", label: "Watchlist", Icon: Bookmark },
  ];

  return (
    <>
      <header className={`navWrap${isScrolled ? " scrolled" : ""}`}>
        <nav className="nav">

          {/* ── LOGO ── */}
          <NavLink to="/" className="navLogo" onClick={() => setMenuOpen(false)}>
            <span className="navLogo_text">
              CINE<span className="navLogo_accent">SCOPE</span>
            </span>
          </NavLink>

          {/* ── DESKTOP LINKS ── */}
          <ul className="navLinks">
            {links.map(({ to, label, Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    "navLink" + (isActive ? " active" : "")
                  }
                >
                  <Icon size={15} className="navLink_icon" />
                  <span>{label}</span>
                  <span className="navLink_glow" />
                </NavLink>
              </li>
            ))}
          </ul>

          {/* ── SEARCH ── */}
          <div className="navSearch">
            <SearchBar />
          </div>

          {/* ── RIGHT CONTROLS ── */}
          <div className="navControls">
            <ThemeToggle />
            <button
              className="navHamburger"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </nav>
      </header>

      {/* ── MOBILE DRAWER ── */}
      <div className={`navDrawer${menuOpen ? " open" : ""}`}>
        <div className="navDrawer_inner">
          {/* Search inside drawer */}
          <div className="navDrawer_search">
            <SearchBar />
          </div>

          <ul className="navDrawer_links">
            {links.map(({ to, label, Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    "navDrawer_link" + (isActive ? " active" : "")
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="navDrawer_footer">
            <span className="navDrawer_brand">🎬 CINESCOPE</span>
            <span className="navDrawer_tagline">Your Cinema Universe</span>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div className="navOverlay" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
}