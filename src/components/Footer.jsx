import { NavLink } from "react-router-dom";
import {
    Github, Mail, Film, Tv2, Users, Bookmark, Search,
    Heart, HelpCircle, Info, MessageSquare,
    Star, Zap, Shield, Clock, TrendingUp, Youtube
} from "lucide-react";
import "./Footer.css";

/* Custom SVG icons for platforms lucide doesn't have */
const TwitterXIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const InstagramIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
);

const appFeatures = [
    { icon: <Film size={14} />, label: "10,000+ Movies" },
    { icon: <Tv2 size={14} />, label: "5,000+ TV Shows" },
    { icon: <Users size={14} />, label: "People & Cast Info" },
    { icon: <Star size={14} />, label: "Ratings & Reviews" },
    { icon: <Bookmark size={14} />, label: "Watch Later Lists" },
    { icon: <Heart size={14} />, label: "Favourites" },
    { icon: <TrendingUp size={14} />, label: "Trending Charts" },
    { icon: <Zap size={14} />, label: "Fast Search" },
    { icon: <Shield size={14} />, label: "No Login Required" },
    { icon: <Clock size={14} />, label: "Watch Providers" },
];

const socialLinks = [
    {
        href: "https://twitter.com",
        label: "Twitter / X",
        icon: <TwitterXIcon />,
        className: "social-icon--twitter",
    },
    {
        href: "https://instagram.com",
        label: "Instagram",
        icon: <InstagramIcon />,
        className: "social-icon--instagram",
    },
    {
        href: "https://youtube.com",
        label: "YouTube",
        icon: <Youtube size={16} />,
        className: "social-icon--youtube",
    },
    {
        href: "https://github.com",
        label: "GitHub",
        icon: <Github size={16} />,
        className: "social-icon--github",
    },
    {
        href: "mailto:contact@cinescope.app",
        label: "Email",
        icon: <Mail size={16} />,
        className: "social-icon--email",
    },
];

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

                    {/* Social Media Icons */}
                    <div className="social-icons-row">
                        {socialLinks.map((s) => (
                            <a
                                key={s.label}
                                href={s.href}
                                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                                rel="noopener noreferrer"
                                className={`social-icon-btn ${s.className}`}
                                aria-label={s.label}
                                title={s.label}
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
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
                    </nav>
                </div>

                {/* Quick Search Column */}
                <div className="footer-section footer-search-section">
                    <h4 className="footer-title">Quick Search</h4>
                    <form
                        className="footer-search-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            const q = e.target.search.value.trim();
                            if (q) window.location.href = `/search?q=${encodeURIComponent(q)}&type=all&page=1`;
                        }}
                    >
                        <div className="footer-search-input-wrap">
                            <input
                                type="text"
                                name="search"
                                placeholder="Search..."
                                className="footer-search-input"
                                required
                            />
                            <button type="submit" className="footer-search-btn">
                                <Search size={16} />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Your Space Column */}
                <div className="footer-section">
                    <h4 className="footer-title">Your Space</h4>
                    <nav className="footer-nav">
                        <NavLink className="footer-link" to="/watchlater">
                            <Bookmark size={15} /> Watch Later
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

                {/* App Features Column */}
                <div className="footer-section footer-features-section">
                    <h4 className="footer-title">App Features</h4>
                    <ul className="footer-features-list">
                        {appFeatures.map((f) => (
                            <li key={f.label} className="footer-feature-item">
                                <span className="footer-feature-icon">{f.icon}</span>
                                <span>{f.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Powered By Column */}
                <div className="footer-section footer-credit">
                    <h4 className="footer-title">Powered By</h4>
                    <div className="tmdb-badge">
                        <div className="tmdb-logo-text">TMDB</div>
                        <p className="tmdb-text">
                            This product uses the TMDB API but is not endorsed or certified by TMDB.
                        </p>
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