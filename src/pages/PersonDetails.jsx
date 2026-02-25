import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import { getPersonDetails, getTVDetails } from "../api/tmdb";
const PersonDetails = () =>{
    const {id} = useParams();
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
            <h1>{person?.name}</h1>
            <img src={`https://image.tmdb.org/t/p/w500${person?.profile_path}`} alt={person?.name} />
            <p>{person?.biography}</p>
            <p>⭐ {person?.popularity}</p>
        </div>
    );
}

export default PersonDetails;