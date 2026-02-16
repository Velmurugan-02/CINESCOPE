import {Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';
import Search from '../pages/Search';
import MovieDetails from '../pages/MovieDetails';
import PersonDetails from '../pages/PersonDetails';
import TVDetails from '../pages/TVDetails';
import WatchList from '../pages/WatchList';
import NotFound from '../pages/NotFound';
const RoutesConfig = () =>{
    return(
        <>
            <Routes>
                <Route path='/' element={<Home />}></Route>
                <Route path='/search' element={<Search />}></Route>
                <Route path='/movie/:id' element={<MovieDetails />}></Route>
                <Route path='/person/:id' element={<PersonDetails />}></Route>
                <Route path='/tv/:id' element={<TVDetails />}></Route>
                <Route path='/watchlist' element={<WatchList />}></Route>
                <Route path='/*' element={<NotFound />}></Route>
            </Routes>
        </>
    );
}

export default RoutesConfig;