import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Search from "../pages/Search";
import Movies from "../pages/Movies";
import TV from "../pages/TV";
import People from "../pages/People";
import MovieDetails from "../pages/MovieDetails";
import TVDetails from "../pages/TVDetails";
import PersonDetails from "../pages/PersonDetails";
import WatchLater from "../pages/Watchlater";
import GenreMovies from "../pages/GenreMovies";
import GenreTV from "../pages/GenreTVshows";
import NotFound from "../pages/NotFound";

const RoutesConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />

      <Route path="/movies" element={<Movies />} />
      <Route path="/tv" element={<TV />} />
      <Route path="/people" element={<People />} />

      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/tv/:id" element={<TVDetails />} />
      <Route path="/person/:id" element={<PersonDetails />} />

      <Route path="/genre/movie/list/:id" element={<GenreMovies />} />
      <Route path="/genre/tv/list/:id" element={<GenreTV />} />

      <Route path="/watchlater" element={<WatchLater />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoutesConfig;
