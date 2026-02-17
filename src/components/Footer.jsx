import { NavLink } from "react-router-dom";
import logo from "../assets/CINESCOPE.jpg";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <img src={logo} alt="CineScope" className="footer-logo" />
                    <p className="footer-tagline">Your ultimate movie destination</p>
                    <p className="footer-copyright">© 2026 CineScope. All rights reserved.</p>
                </div>

                <div className="footer-section">
                    <h4 className="footer-title">Explore</h4>
                    <div className="footer-nav">
                        <NavLink className="footer-link" to="/movies">Movies</NavLink>
                        <NavLink className="footer-link" to="/tv">TV Shows</NavLink>
                        <NavLink className="footer-link" to="/people">People</NavLink>
                    </div>
                </div>

                <div className="footer-section">
                    <h4 className="footer-title">Your Space</h4>
                    <div className="footer-nav">
                        <NavLink className="footer-link" to="/watchlist">Watchlist</NavLink>

                    </div>
                </div>

                <div className="footer-section footer-credit">
                    <h4 className="footer-title">Powered by</h4>
                    <p className="tmdb-text">“This product uses the TMDB API but is not endorsed or certified by TMDB.”</p>
                    <div className="social-links">
                        <a href="#" className="social-link" aria-label="GitHub">📘 GitHub</a>
                        <a href="#" className="social-link" aria-label="Email">📧 Email</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;