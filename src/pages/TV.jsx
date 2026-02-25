import Genre from "../components/TVComponent/Genre";
import PopularTVshows from "../components/TVComponent/PopularTVshows";
import NowPlayingTVshows from "../components/TVComponent/NowPlayingTVshows";

export default function TV() {
  return (
    <div className="tv-page">
      <Genre />
      <PopularTVshows />
      <NowPlayingTVshows />
    </div>
  );
}
