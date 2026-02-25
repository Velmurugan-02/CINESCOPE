// utils/cookieUtils.js
export function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie =
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}; ` +
    `expires=${expires}; path=/; SameSite=Lax`;
}

export function getCookie(name) {
  const key = encodeURIComponent(name) + "=";
  const encoded = document.cookie
    .split("; ")
    .find((row) => row.startsWith(key))
    ?.slice(key.length) || null;
  return encoded ? decodeURIComponent(encoded) : null;
}