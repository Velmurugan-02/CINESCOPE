import React from "react";
import "./GlassSpinner.css";

const GlassSpinner = ({ fullPage = false, message = "Loading Universe" }) => {
    return (
        <div className={`glass-spinner-container ${fullPage ? "glass-spinner-container--full" : ""}`}>
            <div className="glass-spinner">
                <div className="glass-spinner__orb" />
                <div className="glass-spinner__orb" />
                <div className="glass-spinner__orb" />
                <div className="glass-spinner__core" />
            </div>
            {message && <p className="glass-spinner-text">{message}...</p>}
        </div>
    );
};

export default GlassSpinner;
