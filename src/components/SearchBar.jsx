import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const value = q.trim();
    if (!value) return;
    navigate(`/search?q=${encodeURIComponent(value)}&page=1`);
  };

  return (
    <form onSubmit={onSubmit} className="searchBar">
      <Search className="searchIcon" size={18} />
      <input
        className="searchInput"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search movies, TV, people…"
      />
    </form>
  );
}
