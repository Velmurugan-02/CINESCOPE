import TrendingSection from "../components/HomeComponent/TrendingSection";
import PopularMoviesSection from "../components/HomeComponent/PopularMoviesSection";
import PopularPeopleSection from "../components/HomeComponent/PopularPeopleSection";
import PopularTVSection from "../components/HomeComponent/PopularTVSection";
import TopRatedMoviesSection from "../components/HomeComponent/TopRatedMoviesSection";

const Home = () =>{
    return(
        <>
            <div>
                <TrendingSection />
            </div>  
            <div>
                <PopularMoviesSection />
            </div>
            <div>
                <TopRatedMoviesSection />
            </div>
            <div>
                <PopularTVSection />
            </div>
            <div>
                <PopularPeopleSection />
            </div>
        </>
    );
}

export default Home;