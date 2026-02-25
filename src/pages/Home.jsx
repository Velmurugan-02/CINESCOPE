import TrendingMovieSection from "../components/HomeComponent/TrendingMovieSection";
import TrendingTVshows from "../components/HomeComponent/TrendingTVshows";
import { IntroComponent } from "../components/HomeComponent/IntroComponent";
import TrendingPeople from "../components/HomeComponent/TrendingPeople";

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
                <TrendingPeople />
            </div>
        </>
    );
}

export default Home;