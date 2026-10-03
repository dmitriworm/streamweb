/* StreamWeb config — ads only now (APIs are keyless) */
const CONFIG = {
  // ===== Ads =====
  // Paste your ad network script URL(s) here; they load once on init.
  AD_SCRIPTS: [
    // e.g. "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX"
  ],
  AD_SLOTS: {
    header:  { network: "custom", html: null },
    sidebar: { network: "custom", html: null },
    player:  { network: "custom", html: null },
    inGrid:  { network: "custom", html: null },
  },
};
