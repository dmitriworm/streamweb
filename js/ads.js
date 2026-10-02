/* Ad network loader + slot management.
   Paste your network script URLs and slot definitions in config.js.
   Works with AdSense, Adsterra, PropellerAds, or any custom banner URL. */
const Ads = (() => {
  let loaded = false;

  function loadScripts() {
    if (loaded) return;
    CONFIG.AD_SCRIPTS.forEach(src => {
      const s = document.createElement("script");
      s.src = src; s.async = true;
      if (src.includes("adsbygoogle")) s.crossOrigin = "anonymous";
      document.head.appendChild(s);
    });
    loaded = true;
  }

  function fillSlot(el, slotName) {
    if (!el) return;
    const cfg = CONFIG.AD_SLOTS[slotName];
    if (!cfg || !cfg.html) return; // nothing configured — placeholder stays
    el.classList.add("ad-filled");
    el.innerHTML = cfg.html;
    // AdSense-style refresh
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  }

  function refresh() {
    document.querySelectorAll(".ad[data-ad-slot]").forEach(el =>
      fillSlot(el, el.dataset.adSlot));
  }

  function init() {
    loadScripts();
    refresh();
  }

  return { init, refresh, fillSlot };
})();