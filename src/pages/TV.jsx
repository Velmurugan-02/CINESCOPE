import Genre from "../components/TVComponent/Genre";
import PopularTVshows from "../components/TVComponent/PopularTVshows";
import NowPlayingTVshows from "../components/TVComponent/NowPlayingTVshows";
import { useNavigate } from "react-router-dom";

export default function TV() {
  const navigate = useNavigate();
  return (
    <div className="tv-page">
      <PopularTVshows />
      <NowPlayingTVshows />
      <Genre />
      <section className="genre-section section-divider">
        <div className="section-header">
          <div className="header-left">
            <h2 className="section-title">Industries</h2>
            <span className="section-badge">Regional</span>
          </div>
          <p className="section-subtitle">Explore TV shows from your favorite industry</p>
        </div>

        <div className="genre-grid">
          <button className="genre-pill" onClick={() => navigate('/industry/tv/kollywood')}>
            <span className="genre-name">Kollywood</span>
          </button>
          <button className="genre-pill" onClick={() => navigate('/industry/tv/bollywood')}>
            <span className="genre-name">Bollywood</span>
          </button>
          <button className="genre-pill" onClick={() => navigate('/industry/tv/hollywood')}>
            <span className="genre-name">Hollywood</span>
          </button>
          <button className="genre-pill" onClick={() => navigate('/industry/tv/tollywood')}>
            <span className="genre-name">Tollywood</span>
          </button>
          <button className="genre-pill" onClick={() => navigate('/industry/tv/mollywood')}>
            <span className="genre-name">Mollywood</span>
          </button>
          <button className="genre-pill" onClick={() => navigate('/industry/tv/sandalwood')}>
            <span className="genre-name">Sandalwood</span>
          </button>
          <button className="genre-pill" onClick={() => navigate('/industry/tv/k_drama')}>
            <span className="genre-name">Korean</span>
          </button>
          <button className="genre-pill" onClick={() => navigate('/industry/tv/anime')}>
            <span className="genre-name">Japanese</span>
          </button>
          <button className="genre-pill" onClick={() => navigate('/industry/tv/spanish')}>
            <span className="genre-name">Spanish</span>
          </button>
          <button className="genre-pill" onClick={() => navigate('/industry/tv/french')}>
            <span className="genre-name">French</span>
          </button>
        </div>
      </section>

    </div>
  );
}
