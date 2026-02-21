import TrendingSection from "../components/HomeComponent/TrendingSection";
import PopularPeopleSection from "../components/HomeComponent/PopularPeopleSection";
import PopularTVSection from "../components/HomeComponent/PopularTVSection";
import TopRatedMoviesSection from "../components/HomeComponent/TopRatedMoviesSection";
import { IntroComponent } from "../components/HomeComponent/IntroComponent";

const Home = () =>{
    return(
        <>
            <div>
                <IntroComponent />
            </div>
            <div>
                <TrendingSection />
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