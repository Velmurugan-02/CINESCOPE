import TrendingSection from "../components/Home_component/TrendingSection";
import PopularMoviesSection from "../components/Home_component/PopularMoviesSection";
import PopularPeopleSection from "../components/Home_component/PopularPeopleSection";
import PopularTVSection from "../components/Home_component/PopularTVSection";
import TopRatedMoviesSection from "../components/Home_component/TopRatedMoviesSection";

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