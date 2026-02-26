import TrendingMovieSection from "../components/HomeComponent/TrendingMovieSection";
import TrendingTVshows from "../components/HomeComponent/TrendingTVshows";
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
        </>
    );
}

export default Home;