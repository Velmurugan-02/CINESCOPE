import { useState } from "react";
export default function TrendingSection (){
    let [trendbtn,setTrendbtn] = useState("Week"); 
    let toggle_btn_trending = () =>{
        if(trendbtn === "Week"){
            setTrendbtn(prev => prev = "Day");
        }
        else setTrendbtn(prev => prev = "Week");
    }
    return(
        <>
            <div className="section">
                <div className="trending_div">
                    
                </div>
                <div className="trending_div_button">
                    <button onClick={toggle_btn_trending}>{trendbtn}</button>
                </div>
            </div>
        </>
    );
}