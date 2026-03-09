import Genre from "../components/TVComponent/Genre";
import PopularTVshows from "../components/TVComponent/PopularTVshows";
import NowPlayingTVshows from "../components/TVComponent/NowPlayingTVshows";
import Industry from "../components/Industry";
import { useNavigate } from "react-router-dom";

export default function TV() {
  const navigate = useNavigate();
  return (
    <div className="tv-page">
      <PopularTVshows />
      <NowPlayingTVshows />
      <Genre />
      <Industry isTV />
    </div>
  );
}
