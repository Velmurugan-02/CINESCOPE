import { memo } from "react";

import "./IntroComponent.css"

import bgImage from "../../assets/movie_poster_collage.jpg";

export const IntroComponent = memo(() => {
  return (
    <section
      className="intro"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(11, 15, 23, 0.85), rgba(11, 15, 23, 0.95)), url(${bgImage})`
      }}
    >
      <div className="intro_inner">
        <div className="intro_content">
          <h1 className="intro_title">
            Discover movies & series you'll actually love.
          </h1>

          <p className="intro_para">
            CINESCOPE helps you explore trending movies and TV shows
            with ratings, trailers, cast details, and smart discovery — so you waste
            less time scrolling and more time watching.
          </p>

          <ul className="intro_features" aria-label="Key features">
            <li>Trending Movies & TV Series</li>
            <li>Ratings, Genres, Cast & Trailers</li>
            <li>Save favorites to your Watchlist</li>
          </ul>
        </div>
      </div>
    </section >
  );
});