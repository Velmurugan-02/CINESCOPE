import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import "./SearchBar.css";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const value = q.trim();
    if (!value) return;
    navigate(`/search?q=${encodeURIComponent(value)}&page=1`);
  };

  const clear = () => {
    setQ("");
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`searchBar${focused ? " focused" : ""}`}
      role="search"
    >
      {/* Search icon */}
      <Search className="searchIcon" size={16} />

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
