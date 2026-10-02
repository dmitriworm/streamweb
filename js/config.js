/* StreamWeb config — paste your keys here (or set before this file loads) */
const CONFIG = {
  // Get a free key: https://www.themoviedb.org/signup -> Settings -> API
  TMDB_KEY: window.TMDB_API_KEY || "YOUR_TMDB_KEY",
  TMDB_BASE: "https://api.themoviedb.org/3",
  IMG_BASE: "https://image.tmdb.org/t/p",
  POSTER_SIZE: "w342",
  PROFILE_SIZE: "w185",

  // ===== Ads =====
  // Paste your ad network script URL(s) here; they load once on init.
  AD_SCRIPTS: [
    // e.g. "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX"
    // e.g. "https://your-adsterra-or-propellerads-url.js"
  ],
  // Slot map: where each ad unit appears. Replace ids with your network's.
  AD_SLOTS: {
    header:  { network: "custom", html: null }, // e.g. AdSense: "<ins class='adsbygoogle' data-ad-slot='123'></ins>"
    sidebar: { network: "custom", html: null },
    player:  { network: "custom", html: null },
    inGrid:  { network: "custom", html: null },
  },
};