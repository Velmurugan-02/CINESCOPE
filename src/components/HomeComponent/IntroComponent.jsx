import { memo } from "react";
import "./IntroComponent.css";
import bgImage from "../../assets/movie_poster_collage.jpg";

const stats = [
  { value: "10K+", label: "Movies & Series" },
  { value: "4.9★", label: "User Rating" },
  { value: "150+", label: "Genres Covered" },
  { value: "Daily", label: "New Releases" },
];

const features = [
  { label: "Trending Charts" },
  { label: "Trailers & Clips" },
  { label: "IMDb Ratings" },
  { label: "Full Cast Info" },
  { label: "Personal Watchlist" },
  { label: "Smart Search" },
  { label: "Global Releases" },
  { label: "Soundtracks" },
];

export const IntroComponent = memo(() => {
  return (
    <section
      className="intro"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(11,15,23,0.8) 0%, rgba(11,15,23,0.95) 100%), url(${bgImage})`,
      }}
    >
      {/* Ambient glow orbs */}
      <div className="intro_orb intro_orb--amber" />
      <div className="intro_orb intro_orb--purple" />
      <div className="intro_orb intro_orb--blue" />

      <div className="intro_inner">

        {/* Badge */}
        <div className="intro_badge">
          <span className="intro_badge_dot" />
          The Ultimate Movie Discovery Platform
        </div>

        {/* Hero headline */}
        <h1 className="intro_title">
          Your Cinema Universe,<br />
          <span className="intro_title_highlight">Beautifully Explored</span>
        </h1>

        {/* Subtitle */}
        <p className="intro_para">
          CINESCOPE is where cinephiles and casual viewers unite. Dive into
          trending titles, uncover hidden gems, explore cast universes, and
          curate your perfect watchlist — all in one stunning experience.
        </p>

        {/* Feature chip cloud */}
        <div className="intro_chips">
          {features.map((f) => (
            <span key={f.label} className="intro_chip">
              {f.icon}&nbsp;{f.label}
            </span>
          ))}
        </div>

        {/* Tagline footer */}
        <p className="intro_tagline">
          Spend less time scrolling. More time&nbsp;<em>watching</em>.
        </p>

        {/* Scroll cue */}
        <div className="intro_scroll_cue" aria-hidden="true">
          <span className="intro_scroll_mouse">
            <span className="intro_scroll_wheel" />
          </span>
          <span className="intro_scroll_text">Scroll to explore</span>
        </div>

      </div>
    </section>
  );
});