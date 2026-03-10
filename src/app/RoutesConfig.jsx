import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Search from "../pages/Search";
import Movies from "../pages/Movies";
import TV from "../pages/TV";
import People from "../pages/People";
import MovieDetails from "../pages/MovieDetails";
import TVDetails from "../pages/TVDetails";
import PersonDetails from "../pages/PersonDetails";
import Watchlater from "../pages/Watchlater";
import GenreMovies from "../pages/GenreMovies";
import GenreTVshows from "../pages/GenreTVshows";
import IndustryMovies from "../pages/IndustryMovies";
import IndustryTV from "../pages/IndustryTV";
import About from "../pages/About";
import Help from "../pages/Help";
import Feedback from "../pages/Feedback";
import Privacy from "../pages/Privacy";
import Terms from "../pages/Terms";
import Favourites from "../pages/Favourites";
import NotFound from "../pages/NotFound";
import History from "../pages/History";

const RoutesConfig = () => {
    return (
        <Routes>
            {/* Priority & Support Routes */}
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/watchlater" element={<Watchlater />} />
            <Route path="/history" element={<History />} />

            {/* Core Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv" element={<TV />} />
            <Route path="/people" element={<People />} />

            {/* Details */}
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/tv/:id" element={<TVDetails />} />
            <Route path="/person/:id" element={<PersonDetails />} />

            {/* Lists & Industries */}
            <Route path="/genre/movie/list/:id" element={<GenreMovies />} />
            <Route path="/genre/tv/list/:id" element={<GenreTVshows />} />
            <Route path="/industry/:id" element={<IndustryMovies />} />
            <Route path="/industry/tv/:id" element={<IndustryTV />} />

            {/* Catch-all MUST be last */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default RoutesConfig;
