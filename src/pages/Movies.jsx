import Genre from "../components/MoviesComponent/Genre";
import NowPlaying from "../components/MoviesComponent/NowPlaying";
import PopularMoviesSection from "../components/MoviesComponent/PopularMoviesSection";
import Industry from "../components/Industry";
import { useNavigate } from "react-router-dom";

const Movies = () => {
  const navigate = useNavigate();
  return (
    <div className="movies-page">
      <PopularMoviesSection />
      <NowPlaying />
      <Genre />
      <Industry />
    </div>
  );
}

export default Movies;