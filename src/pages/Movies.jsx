import Genre from "../components/MoviesComponent/Genre";
import NowPlaying from "../components/MoviesComponent/NowPlaying";
import PopularMoviesSection from "../components/MoviesComponent/PopularMoviesSection"; "../components/MoviesComponent/PopularMoviesSection.jsx"
const Movies = () => {
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
    </div>
  );
}

export default Movies;