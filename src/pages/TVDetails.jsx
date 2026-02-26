import { useEffect,useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTVDetails } from "../api/tmdb";
import "./TVDetails.css";

const TVDetails = () =>{
    const {id} = useParams();
    const navigate = useNavigate();
    const [tv, setTv] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]   = useState(null);
    useEffect(() =>{
        const fetch = async () =>{
            try{
                const data = await getTVDetails(id);
                setTv(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetch();
    }, [id]);
    if (loading) return <p>Loading...</p>;
    if (error)   return <p>{error}</p>;
    return(
        <div>
            <button 
                onClick={() => navigate(-1)}
                className="btn_close"
            >
                ← Back
            </button>
            <h1>{tv?.title}</h1>
            <img src={`https://image.tmdb.org/t/p/w500${tv?.poster_path}`} alt={tv?.title} />
            <p>{tv?.overview}</p>
            <p>⭐ {tv?.vote_average} · {tv?.first_air_date?.slice(0,4)}</p>
        </div>
    );
}

export default TVDetails;