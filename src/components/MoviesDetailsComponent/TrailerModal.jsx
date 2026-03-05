import { X } from "lucide-react";
import "./TrailerModal.css";

export default function TrailerModal({ isOpen, onClose, trailerKey, title }) {
    if (!isOpen) return null;

    return (
        <div className="trailer-modal-overlay" onClick={onClose}>
            <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="trailer-modal-header">
                    <h2 className="trailer-modal-title">{title} - Official Trailer</h2>
                    <button className="trailer-modal-close" onClick={onClose} aria-label="Close modal">
                        <X size={24} />
                    </button>
                </div>

                <div className="trailer-video-container">
                    {trailerKey ? (
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                            title={`${title} Trailer`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div className="no-trailer-message">
                            <span>📭</span>
                            <p>Sorry, no trailer found for this item.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
