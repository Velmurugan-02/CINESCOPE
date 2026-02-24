import TrendingMovieSection from "../components/HomeComponent/TrendingMovieSection";
import PopularPeopleSection from "../components/HomeComponent/PopularPeopleSection";
import PopularTVSection from "../components/HomeComponent/PopularTVSection";
import TrendingTVshows from "../components/HomeComponent/TrendingTVshows";
import TopRatedMoviesSection from "../components/HomeComponent/TopRatedMoviesSection";
import { IntroComponent } from "../components/HomeComponent/IntroComponent";

const Home = () => {
    return (
        <>
            <div>
                <IntroComponent />
            </div>
            <div>
                <TrendingMovieSection />
            </div>
            <div>
                <TrendingTVshows />
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