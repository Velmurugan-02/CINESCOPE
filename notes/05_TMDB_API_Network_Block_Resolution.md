# Interview Prep: Handling Third-Party API Network Blocks (TMDB)

## The Problem
While developing CINESCOPE, I encountered a critical issue where the TMDB API (`api.themoviedb.org`) would fetch perfectly on mobile screens but fail with a network error (`TypeError: Failed to fetch`) on desktop environments. 

Through debugging, I discovered that this was **not a codebase bug, but a network-level restriction**. 

Two major factors caused this:
1. **Adblockers/Privacy Extensions:** Desktop browsers heavily utilize aggressive adblockers (e.g., uBlock Origin). TMDB features queries like `include_adult=false`, which triggered naive adblocker rules because of the substring `"ad"`, causing the browser to abort the request.
2. **ISP-Level DNS Blocking:** In certain regions (like India), major ISPs (Jio, Airtel) enforce blanket blocklists against entertainment APIs like TMDB for anti-piracy reasons. Mobile devices often evade this naturally through cellular DNS routing, but home Wi-Fi forces the block on laptops.

## The Solution

I solved this in a multi-layered approach to ensure perfect operation during local development AND in the production environment.

### 1. Removing False Positives
First, I completely removed the `include_adult: false` parameter from all TMDB API calls. Because TMDB defaults to excluding adult content anyway, this was a safe change. This removed the `"ad"` string trigger, successfully bypassing basic adblockers.

### 2. Bypassing ISP Blocks Locally (During Development)
To bypass the ISP blocklist on my local machine without a VPN, I switched my Google Chrome settings to use **Secure DNS (Cloudflare 1.1.1.1)**. This encrypted my DNS requests, completely bypassing the local ISP's restrictions and allowing the `fetch` requests to reach TMDB directly from my localhost.

### 3. The Production Fix (The Reverse Proxy)
However, I realized that if a recruiter or HR manager opened my portfolio on a restricted network, the client-side app would crash for them. To achieve a **100% guarantee** that the site works on any device globally, I engineered a **Netlify Reverse Proxy**.

I implemented this by creating a `netlify.toml` file at the root of my project:
```toml
[[redirects]]
  from = "/tmdb-api/*"
  to = "https://api.themoviedb.org/3/:splat"
  status = 200
  force = true
```

Then, I dynamically altered my API configuration to route through this proxy *only* in the production build:
```javascript
// src/api/tmdb.js
const BASE_URL = import.meta.env.PROD 
    ? "/tmdb-api" 
    : import.meta.env.VITE_TMDB_BASE_URL;
```

## Why This Implementation is Robust
By using the reverse proxy, the client's browser only talks to `my-cinescope.netlify.app`. The client's ISP sees this as an innocent first-party request and allows it. Netlify's enterprise cloud servers (located in unrestricted regions) receive the request, fetch the data flawlessly from TMDB, and securely pass it back down to the browser. 

This guarantees uniform application behavior regardless of user environment, heavily restricted corporate Wi-Fi connections, or aggressive adblockers.
