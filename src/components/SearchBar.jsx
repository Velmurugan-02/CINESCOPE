import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import useDebounce from "../hooks/useDebounce";
import { searchMulti, searchMovie, searchTV, searchPerson } from "../api/tmdb";
import "./SearchBar.css";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const debouncedQuery = useDebounce(q, 300);
  const [filter, setFilter] = useState("all");
  const [selectedIndex, setSelectedIndex] = useState(-1);


  const onSubmit = (e) => {
    e.preventDefault();
    const value = q.trim();
    if (!value) return;
    navigate(`/search?q=${encodeURIComponent(value)}&type=${filter}&page=1`);
  };

  const clear = () => {
    setQ("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (debouncedQuery.trim().length > 1) {
      // Determine which API function to use based on filter
      let searchFn = searchMulti;
      if (filter === "movie") searchFn = searchMovie;
      else if (filter === "tv") searchFn = searchTV;
      else if (filter === "person") searchFn = searchPerson;

      searchFn(debouncedQuery).then(data => {
        setSuggestions(data.results?.slice(0, 6) || []);
        setSelectedIndex(-1); // Reset highlight when results change
      });
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, filter]);

  const onKeyDown = (e) => {
    if (suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      const item = suggestions[selectedIndex];
      const query = item.title || item.name;
      navigate(`/search?q=${encodeURIComponent(query)}&type=${filter}&page=1`);
      setFocused(false);
    }
  };


  return (
    <form
      onSubmit={onSubmit}
      className={`searchBar${focused ? " focused" : ""}`}
      role="search"
    >
      {/* Search icon */}
      <Search className="searchIcon" size={16} />
      {suggestions.length > 0 && focused && (
        <ul className="suggestionsList">
          {suggestions.map((item, index) => (
            <li
              key={item.id}
              className={`suggestionItem ${index === selectedIndex ? 'selected' : ''}`}
              onMouseDown={() => navigate(`/search?q=${encodeURIComponent(item.title || item.name)}&type=${filter}&page=1`)}
            >
              <span className="suggestionIcon">
                {item.media_type === 'movie' ? '🎬' : '📺'}
              </span>
              <span className="suggestionText">
                {item.title || item.name}
              </span>
            </li>
          ))}
        </ul>
      )}

      <select
        className="searchFilter"
        value={filter}
        onChange={(e) => {
          const newFilter = e.target.value;
          setFilter(newFilter);
          if (q.trim()) {
            navigate(`/search?q=${encodeURIComponent(q.trim())}&type=${newFilter}&page=1`);
          }
        }}
      >
        <option value="all">All</option>
        <option value="movie">Movies</option>
        <option value="tv">TV</option>
        <option value="person">People</option>
      </select>


      {/* Input */}
      <input
        ref={inputRef}
        className="searchInput"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search movies, TV, people…"
        aria-label="Search"
        autoComplete="off"
        spellCheck={false}
        onKeyDown={onKeyDown}
      />

      {/* Clear button — only when there's text */}
      {q && (
        <button
          type="button"
          className="searchClear"
          onClick={clear}
          aria-label="Clear search"
          tabIndex={-1}
        >
          <X size={13} />
        </button>
      )}

      {/* Keyboard shortcut hint — hidden when typing */}
      {!q && !focused && (
        <kbd className="searchKbd">⌘K</kbd>
      )}
    </form>
  );
}
