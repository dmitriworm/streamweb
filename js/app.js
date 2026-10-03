/* App init + routing */
(async function init() {
  const nav = document.getElementById("nav");
  const search = document.getElementById("search");

  function syncNav() {
    nav.querySelectorAll("button").forEach(b =>
      b.classList.toggle("active", b.dataset.view === state.view));
  }

  async function loadSection(view, title, fetcher) {
    Views.loadingThen(title);
    const items = await fetcher();
    Views.grid(items, title, `${items.length} titles`, t => Player.open(t));
  }

  async function render() {
    syncNav();
    try {
      if (state.view === "web") {
        await Views.web(cat => go(cat), item => Player.open(item));
      } else if (state.view === "movies") {
        await loadSection("movies", "🎬 Movies — Official Trailers", () => API.movies());
      } else if (state.view === "series") {
        await loadSection("series", "📺 Series — Top Rated", () => API.series());
      } else if (state.view === "anime") {
        await loadSection("anime", "🌸 Anime — Top on MyAnimeList", () => API.anime());
      } else if (state.view === "watchlist") {
        Views.grid(state.watchlist, "★ Your Watchlist",
          state.watchlist.length ? `${state.watchlist.length} saved titles`
          : "Nothing saved yet — star a title after watching a trailer.",
          t => Player.open(t));
      } else if (state.view === "search") {
        await loadSection("search", `🔍 Results for "${state.query}"`, () => API.search(state.query));
      }
    } catch (e) {
      Views.header("⚠️ API Error", "Could not load data. Check your connection. (" + e.message + ")");
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
