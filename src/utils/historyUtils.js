// utils/historyUtils.js
// Stores recently viewed items in localStorage (max 50 entries)

const HISTORY_KEY = "cinescope_history";
const MAX_ITEMS = 50;

export function getHistory() {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    } catch {
        return [];
    }
}

export function addToHistory(item) {
    // item = { id, type, title, poster_path, vote_average, viewedAt }
    try {
        const history = getHistory();
        // Remove duplicate if already exists
        const filtered = history.filter(
            (h) => !(h.id === item.id && h.type === item.type)
        );
        // Add to front with timestamp
        const updated = [
            { ...item, viewedAt: new Date().toISOString() },
            ...filtered,
        ].slice(0, MAX_ITEMS);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch {
        // Silently fail if localStorage is unavailable
    }
}

export function removeFromHistory(id, type) {
    try {
        const history = getHistory();
        const updated = history.filter(
            (h) => !(h.id === id && h.type === type)
        );
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
        return updated;
    } catch {
        return getHistory();
    }
}

export function clearHistory() {
    try {
        localStorage.removeItem(HISTORY_KEY);
    } catch {
        // Silently fail
    }
}

export function formatViewedAt(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
