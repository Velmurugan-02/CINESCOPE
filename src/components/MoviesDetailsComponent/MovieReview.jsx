import { useState, useEffect } from "react";
import { getMovieReviews, getTVReviews } from "../../api/tmdb";
import "./MovieReview.css";

const STAR_COUNT = 10;

function StarRating({ value, onChange }) {
    const [hovered, setHovered] = useState(0);
    const active = hovered || value;

    return (
        <div className="star-selector" role="group" aria-label="Rate this title">
            {Array.from({ length: STAR_COUNT }, (_, i) => i + 1).map((star) => (
                <button
                    key={star}
                    type="button"
                    className={`star-btn ${star <= active ? "filled" : ""}`}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => onChange(star)}
                    aria-label={`Rate ${star} out of ${STAR_COUNT}`}
                >
                    ★
                </button>
            ))}
            {value > 0 && (
                <span className="star-value">{value}/{STAR_COUNT}</span>
            )}
        </div>
    );
}

export default function MovieReview({ id, type = "movie" }) {
    const storageKey = `user_reviews_${type}_${id}`;

    // User's own reviews (stored locally)
    const [userReviews, setUserReviews] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(storageKey) || "[]");
        } catch { return []; }
    });

    // Form state
    const [rating, setRating] = useState(0);
    const [text, setText] = useState("");
    const [formError, setFormError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    // TMDB community reviews
    const [tmdbReviews, setTmdbReviews] = useState([]);
    const [tmdbLoading, setTmdbLoading] = useState(true);
    const [tmdbError, setTmdbError] = useState(null);

    // Expand/collapse for long TMDB reviews
    const [expanded, setExpanded] = useState({});

    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        const fetchReviews = async () => {
            setTmdbLoading(true);
            setTmdbError(null);
            try {
                const data = type === "tv"
                    ? await getTVReviews(id)
                    : await getMovieReviews(id);
                if (!cancelled) setTmdbReviews(data?.results || []);
            } catch (err) {
                if (!cancelled) setTmdbError(err.message || "Failed to load reviews.");
            } finally {
                if (!cancelled) setTmdbLoading(false);
            }
        };
        fetchReviews();
        return () => { cancelled = true; };
    }, [id, type]);

    // Sync userReviews from state source on id/type change
    useEffect(() => {
        try {
            setUserReviews(JSON.parse(localStorage.getItem(storageKey) || "[]"));
        } catch { setUserReviews([]); }
    }, [storageKey]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) { setFormError("Please select a star rating."); return; }
        if (text.trim().length < 10) { setFormError("Review must be at least 10 characters."); return; }

        const newReview = {
            id: `local_${Date.now()}`,
            author: "You",
            rating,
            content: text.trim(),
            created_at: new Date().toISOString(),
            local: true,
        };

        const updated = [newReview, ...userReviews];
        setUserReviews(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        setText("");
        setRating(0);
        setFormError("");
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    const deleteUserReview = (reviewId) => {
        const updated = userReviews.filter((r) => r.id !== reviewId);
        setUserReviews(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
    };

    const toggleExpand = (reviewId) => {
        setExpanded((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }));
    };

    const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

    const getAvatarUrl = (path) => {
        if (!path) return null;
        if (path.startsWith("/https://") || path.startsWith("/http://")) return path.slice(1);
        return `https://image.tmdb.org/t/p/w185${path}`;
    };

    const TRUNCATE = 450;
    const totalCount = userReviews.length + tmdbReviews.length;

    return (
        <section className="reviews-section">
            {/* ── Section Header ── */}
            <div className="reviews-header">
                <h2 className="reviews-heading">Reviews</h2>
                {!tmdbLoading && (
                    <span className="reviews-count">
                        {totalCount} review{totalCount !== 1 ? "s" : ""}
                    </span>
                )}
            </div>

            {/* ── Write a Review Form ── */}
            <div className="review-form-card">
                <h3 className="review-form-title">✍️ Write a Review</h3>
                <form onSubmit={handleSubmit} className="review-form">
                    <div className="review-form-rating-row">
                        <label className="review-form-label">Your Rating</label>
                        <StarRating value={rating} onChange={setRating} />
                    </div>

                    <div className="review-form-textarea-row">
                        <label className="review-form-label" htmlFor="review-text">
                            Your Review
                        </label>
                        <textarea
                            id="review-text"
                            className="review-textarea"
                            rows={4}
                            placeholder="Share your thoughts about this title..."
                            value={text}
                            onChange={(e) => { setText(e.target.value); setFormError(""); }}
                            maxLength={2000}
                        />
                        <div className="review-char-count">{text.length}/2000</div>
                    </div>

                    {formError && <p className="review-form-error">⚠️ {formError}</p>}
                    {submitted && <p className="review-form-success">✅ Review submitted!</p>}

                    <button type="submit" className="review-submit-btn">
                        Submit Review
                    </button>
                </form>
            </div>

            {/* ── Your Reviews ── */}
            {userReviews.length > 0 && (
                <div className="reviews-group">
                    <p className="reviews-group-label">Your Reviews</p>
                    <div className="reviews-list">
                        {userReviews.map((review) => (
                            <div key={review.id} className="review-card review-card--local">
                                <div className="review-card-header">
                                    <div className="review-avatar review-avatar--you">
                                        <div className="review-avatar-fallback">Y</div>
                                    </div>
                                    <div className="review-meta">
                                        <span className="review-author">You</span>
                                        <span className="review-date">
                                            {new Date(review.created_at).toLocaleDateString("en-US", {
                                                year: "numeric", month: "short", day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                    <div className="review-rating">
                                        <span className="review-star">⭐</span>
                                        <span className="review-rating-value">{review.rating}</span>
                                        <span className="review-rating-max">/10</span>
                                    </div>
                                    <button
                                        className="review-delete-btn"
                                        onClick={() => deleteUserReview(review.id)}
                                        title="Delete this review"
                                        type="button"
                                    >
                                        🗑
                                    </button>
                                </div>
                                <div className="review-body">
                                    <p className="review-content">{review.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── TMDB Community Reviews ── */}
            <div className="reviews-group">
                <p className="reviews-group-label">Community Reviews</p>
                {tmdbLoading ? (
                    <div className="reviews-loading">
                        <div className="reviews-spinner" />
                        <span>Loading community reviews...</span>
                    </div>
                ) : tmdbError ? (
                    <div className="reviews-error">⚠️ {tmdbError}</div>
                ) : tmdbReviews.length === 0 ? (
                    <div className="reviews-empty">
                        <span className="reviews-empty-icon">💬</span>
                        <p>No community reviews on TMDB yet.</p>
                    </div>
                ) : (
                    <div className="reviews-list">
                        {tmdbReviews.map((review) => {
                            const ratingVal = review.author_details?.rating;
                            const rating = (ratingVal !== null && ratingVal !== undefined && ratingVal !== "")
                                ? parseFloat(ratingVal).toFixed(1)
                                : null;
                            const avatarUrl = getAvatarUrl(review.author_details?.avatar_path);
                            const isLong = review.content.length > TRUNCATE;
                            const isExp = expanded[review.id];
                            const displayContent = isLong && !isExp
                                ? review.content.slice(0, TRUNCATE) + "…"
                                : review.content;

                            return (
                                <div key={review.id} className="review-card">
                                    <div className="review-card-header">
                                        <div className="review-avatar">
                                            {avatarUrl ? (
                                                <img src={avatarUrl} alt={review.author} className="review-avatar-img" />
                                            ) : (
                                                <div className="review-avatar-fallback">
                                                    {getInitial(review.author)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="review-meta">
                                            <span className="review-author">{review.author}</span>
                                            {review.created_at && (
                                                <span className="review-date">
                                                    {new Date(review.created_at).toLocaleDateString("en-US", {
                                                        year: "numeric", month: "short", day: "numeric",
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                        {rating && (
                                            <div className="review-rating">
                                                <span className="review-star">⭐</span>
                                                <span className="review-rating-value">{rating}</span>
                                                <span className="review-rating-max">/10</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="review-body">
                                        <p className="review-content">{displayContent}</p>
                                        {isLong && (
                                            <button
                                                className="review-expand-btn"
                                                onClick={() => toggleExpand(review.id)}
                                                type="button"
                                            >
                                                {isExp ? "Show less ↑" : "Read more ↓"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}