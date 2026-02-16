import { useParams } from "react-router-dom";
const PersonDetails = () =>{
    const { id } = useParams();
    return(
        <>
            <h1>Person Details</h1>
            <p>id : {id}</p>
        </>
    );
}

export default PersonDetails;