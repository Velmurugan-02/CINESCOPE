import { useParams } from "react-router-dom";
const TVDetails = () =>{
    const {id} = useParams();
    return(
        <>
            <h1>TVDetails</h1>
            <p>Id : {id}</p>
        </>
    );
}

export default TVDetails;