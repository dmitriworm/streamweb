/* App init + routing */
(async function init() {
  const nav = document.getElementById("nav");
  const search = document.getElementById("search");

  function syncNav() {
    nav.querySelectorAll("button").forEach(b =>
      b.classList.toggle("active", b.dataset.view === state.view));
  }

  async function render() {
    syncNav();
    const v = state.view;
    try {
      if (v === "web") {
        await Views.web(cat => go(cat), item => Player.open(item));
      } else if (v === "movies") {
        Views.loadingThen("🎬 Movies — Trending This Week");
        const items = await TMDB.trendingMovies();
        Views.grid(items, "🎬 Movies — Trending This Week", `${items.length} titles`, t => Player.open(t));
      } else if (v === "series") {
        Views.loadingThen("📺 Series — Trending This Week");
        const items = await TMDB.trendingTV();
        Views.grid(items, "📺 Series — Trending This Week", `${items.length} titles`, t => Player.open(t));
      } else if (v === "anime") {
        Views.loadingThen("🌸 Anime — Popular Now");
        const items = await TMDB.anime();
        Views.grid(items, "🌸 Anime — Popular Now", `${items.length} titles`, t => Player.open(t));
      } else if (v === "watchlist") {
        Views.grid(state.watchlist, "★ Your Watchlist",
          state.watchlist.length ? `${state.watchlist.length} saved titles` : "Nothing saved yet — star a title after watching a trailer.",
          t => Player.open(t));
      } else if (v === "search") {
        Views.loadingThen(`🔍 Results for "${state.query}"`);
        const items = await TMDB.search(state.query);
        Views.grid(items, `🔍 Results for "${state.query}"`, `${items.length} matches`, t => Player.open(t));
      }
    } catch (e) {
      Views.header("⚠️ TMDB Error", "Could not reach TMDB. Check your API key in js/config.js. (" + e.message + ")");
    }
    Ads.refresh();
  }

  function go(v) { state.setView(v); state.setQuery(""); search.value = ""; render(); }

  nav.querySelectorAll("button").forEach(b => b.onclick = () => go(b.dataset.view));

  let t;
  search.oninput = e => {
    clearTimeout(t);
    const q = e.target.value.trim();
    t = setTimeout(() => {
      state.setQuery(q);
      if (q.length >= 2) { state.setView("search"); render(); }
      else if (state.view === "search") { go("web"); }
    }, 400);
  };

  Ads.init();
  render();
})();