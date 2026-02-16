import { useParams } from "react-router-dom";
const MovieDetails = () =>{
    const { id } = useParams();
    return(
        <>
            <h1>Movies</h1>
            <p>id : {id}</p>
        </>
    );
}

export default MovieDetails;