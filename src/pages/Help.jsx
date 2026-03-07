import { useNavigate } from "react-router-dom";
import { HelpCircle, Mail, MessageSquare } from "lucide-react";
import "./Movies.css";

const Help = () => {
    const navigate = useNavigate();

    const faqs = [
        {
            q: "Where does the movie data come from?",
            a: "All movie, TV, and person data is provided by The Movie Database (TMDB) API. While we use their data, we are not officially endorsed by them."
        },
        {
            q: "How does the 'Watchlater' work?",
            a: "When you add a movie or show to your Watchlater, we save it locally in your browser's cookies so it stays there even if you refresh the page!"
        },
        {
            q: "Can I watch movies on CineScope?",
            a: "CineScope is a discovery platform. We provide trailers, ratings, and information, but we do not host actual streaming content."
        },
        {
            q: "Is there support for regional cinema?",
            a: "Yes! We have dedicated sections for Bollywood, Kollywood, Anime, K-Dramas, and many other regional industries."
        }
    ];

    return (
        <section className="home-section page-container">
            <div className="section-header">
                <button className="back-link" onClick={() => navigate("/")}>
                    ← Back to Home
                </button>
                <h2 className="section-title">Help Center</h2>
                <p className="section-subtitle">Find answers and support</p>
            </div>

            <div style={{ maxWidth: "900px", marginTop: "2rem" }}>
                <h3 style={{ color: "var(--text)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.7rem" }}>
                    <HelpCircle color="var(--primary)" /> Frequently Asked Questions
                </h3>

                <div style={{ display: "grid", gap: "1.5rem" }}>
                    {faqs.map((faq, i) => (
                        <div key={i} style={{
                            background: "rgba(255, 255, 255, 0.03)",
                            padding: "1.5rem",
                            borderRadius: "15px",
                            border: "1px solid rgba(255, 255, 255, 0.05)"
                        }}>
                            <h4 style={{ color: "var(--primary)", marginBottom: "0.5rem" }}>{faq.q}</h4>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>{faq.a}</p>
                        </div>
                    ))}
                </div>

                <div style={{
                    marginTop: "3rem",
                    padding: "2rem",
                    borderRadius: "20px",
                    background: "linear-gradient(135deg, rgba(114, 16, 211, 0.1), rgba(0,0,0,0))",
                    border: "1px solid rgba(114, 16, 211, 0.2)",
                    textAlign: "center"
                }}>
                    <h3 style={{ color: "var(--text)", marginBottom: "0.5rem" }}>Still need help?</h3>
                    <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>Our team is here to assist you with any issues.</p>
                    <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                        <a href="mailto:support@cinescope.app" style={{
                            display: "flex", alignItems: "center", gap: "0.5rem",
                            padding: "0.8rem 1.5rem", background: "var(--primary)",
                            color: "white", borderRadius: "50px", textDecoration: "none", fontWeight: "600"
                        }}>
                            <Mail size={18} /> Email Support
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Help;
