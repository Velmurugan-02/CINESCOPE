import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieDetails } from "../api/tmdb"; 
const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError("Failed to load movie.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);
  if (loading) return <p>Loading...</p>;
  if (error)   return <p>{error}</p>;
  return (
    <div>
      <button 
        onClick={() => navigate(-1)}
        className="btn_close"
      >
        ← Back
      </button>
      <h1>{movie.title}</h1>
      <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
      <p>{movie.overview}</p>
      <p>⭐ {movie.vote_average} · {movie.release_date?.slice(0,4)}</p>
    </div>
  );
};
export default MovieDetails;