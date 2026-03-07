import { NavLink } from "react-router-dom";
import { Github, Mail, Film, Tv2, Users, Bookmark, Search, Star, TrendingUp, Heart, Globe, HelpCircle, Info, MessageSquare } from "lucide-react";
import "./Footer.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            {/* Decorative top glow line */}
            <div className="footer-glow-line" />

            <div className="footer-container">

                {/* Brand Column */}
                <div className="footer-brand">
                    <div className="footer-logo-wrap">
                        <span className="navLogo_text">
                            CINE<span className="navLogo_accent">SCOPE</span>
                        </span>
                    </div>
                    <p className="footer-tagline">
                        Your ultimate destination for movies, TV shows, and the people behind them.
                    </p>
                    <p className="footer-copyright">
                        © {currentYear} CineScope. All rights reserved.
                    </p>
                </div>

                {/* Explore Column */}
                <div className="footer-section">
                    <h4 className="footer-title">Explore</h4>
                    <nav className="footer-nav">
                        <NavLink className="footer-link" to="/movies">
                            <Film size={15} /> Movies
                        </NavLink>
                        <NavLink className="footer-link" to="/tv">
                            <Tv2 size={15} /> TV Shows
                        </NavLink>
                        <NavLink className="footer-link" to="/people">
                            <Users size={15} /> People
                        </NavLink>
                        <NavLink className="footer-link" to="/search">
                            <Search size={15} /> Search
                        </NavLink>
                    </nav>
                </div>

                {/* My Space Column */}
                <div className="footer-section">
                    <h4 className="footer-title">Your Space</h4>
                    <nav className="footer-nav">
                        <NavLink className="footer-link" to="/watchlater">
                            <Bookmark size={15} /> Watchlater
                        </NavLink>
                        <NavLink className="footer-link" to="/favourites">
                            <Heart size={15} /> Favourites
                        </NavLink>
                    </nav>
                </div>

                {/* Support Column */}
                <div className="footer-section">
                    <h4 className="footer-title">Support</h4>
                    <nav className="footer-nav">
                        <NavLink className="footer-link" to="/help"><HelpCircle size={15} /> Help Center</NavLink>
                        <NavLink className="footer-link" to="/about"><Info size={15} /> About Us</NavLink>
                        <NavLink className="footer-link" to="/feedback"><MessageSquare size={15} /> Feedback</NavLink>
                    </nav>
                </div>

                {/* Credit & Social Column */}
                <div className="footer-section footer-credit">
                    <h4 className="footer-title">Powered By</h4>
                    <div className="tmdb-badge">
                        <div className="tmdb-logo-text">TMDB</div>
                        <p className="tmdb-text">
                            This product uses the TMDB API but is not endorsed or certified by TMDB.
                        </p>
                    </div>

                    <h4 className="footer-title" style={{ marginTop: "1.5rem" }}>Connect</h4>
                    <div className="social-links">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            aria-label="GitHub"
                        >
                            <Github size={16} />
                            GitHub
                        </a>
                        <a
                            href="mailto:contact@cinescope.app"
                            className="social-link"
                            aria-label="Email"
                        >
                            <Mail size={16} />
                            Contact
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="footer-bottom">
                <p className="footer-bottom-text">
                    Made with <Heart size={13} className="footer-heart" /> using React &amp; TMDB API
                </p>
                <div className="footer-bottom-links">
                    <NavLink to="/privacy" className="footer-bottom-link">Privacy Policy</NavLink>
                    <span className="footer-bottom-dot">·</span>
                    <NavLink to="/terms" className="footer-bottom-link">Terms of Use</NavLink>
                </div>
            </div>
        </footer>
    );
};

export default Footer;