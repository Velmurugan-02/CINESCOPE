import Genre from "../components/MoviesComponent/Genre";
import NowPlaying from "../components/MoviesComponent/NowPlaying";
import PopularMoviesSection from "../components/MoviesComponent/PopularMoviesSection";
import { useNavigate } from "react-router-dom";

const Movies = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <PopularMoviesSection />
      </div>
      <div>
        <NowPlaying />
      </div>
      <div>
        <Genre />
      </div>
      <section className="genre-section section-divider">
        <div className="section-header">
          <div className="header-left">
            <h2 className="section-title">Industries</h2>
            <span className="section-badge">Regional</span>
          </div>
          <p className="section-subtitle">Explore movies from your favorite industry</p>
        </div>

        <div className="genre-grid">
          <button className="genre-pill" onClick={() => navigate('/industry/kollywood')}>
            <span className="genre-name">Kollywood</span>
          </button>
          <button className="genre-pill" onClick={() => navigate('/industry/bollywood')}>
            <span className="genre-name">Bollywood</span>
          </button>
          <button className="genre-pill" onClick={() => navigate('/industry/hollywood')}>
            <span className="genre-name">Hollywood</span>
          </button>
          <button className="genre-pill" onClick={() => navigate('/industry/tollywood')}>
            <span className="genre-name">Tollywood</span>
          </button>
          <button className="genre-pill" onClick={() => navigate('/industry/mollywood')}>
            <span className="genre-name">Mollywood</span>
          </button>
          <button className="genre-pill" onClick={() => navigate('/industry/sandalwood')}>
            <span className="genre-name">Sandalwood</span>
          </button>
          <button className="genre-pill" onClick={() => navigate('/industry/k_drama')}>
            <span className="genre-name">Korean</span>
          </button>
          <button className="genre-pill" onClick={() => navigate('/industry/anime')}>
            <span className="genre-name">Anime</span>
          </button>
          <button className="genre-pill" onClick={() => navigate('/industry/spanish')}>
            <span className="genre-name">Spanish</span>
          </button>
          <button className="genre-pill" onClick={() => navigate('/industry/french')}>
            <span className="genre-name">French</span>
          </button>
        </div>
      </section>
    </div>
  );
}

export default Movies;