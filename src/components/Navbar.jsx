import { NavLink } from "react-router-dom";

const Navbar = () =>{
    return(
        <>
            <nav>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/search">Search</NavLink>
                <NavLink to="/movie/:id">Movies</NavLink>
                <NavLink to="/person/:id">Persons</NavLink>
                <NavLink to="/tv/id">TV Shows</NavLink>
                <NavLink to="/watchlist">Watchlist</NavLink>
            </nav>
        </>
    );
}

export default Navbar; 