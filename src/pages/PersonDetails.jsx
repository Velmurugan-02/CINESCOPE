import { useEffect,useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPersonDetails, getTVDetails } from "../api/tmdb";
import "./PersonDetails.css";

const PersonDetails = () =>{
    const {id} = useParams();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]   = useState(null);
    useEffect(() =>{
        const fetch = async () =>{
            try{
                const data = await getPersonDetails(id);
                setPerson(data);
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
            <h1>{person?.name}</h1>
            <img src={`https://image.tmdb.org/t/p/w500${person?.profile_path}`} alt={person?.name} />
            <p>{person?.biography}</p>
            <p>⭐ {person?.popularity}</p>
        </div>
    );
}

export default PersonDetails;