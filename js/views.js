/* Renders: web map / poster grids / detail modal content */
const Views = (() => {
  const viewEl = document.getElementById("view");

  function header(title, sub) {
    viewEl.innerHTML = `<h2 class="view-title">${title}</h2><p class="view-sub">${sub}</p>`;
  }

  async function web(onCategory, onTitle) {
    header("🕸️ The Web", "Live from TMDB — click a node to explore, a poster to watch its trailer.");
    const [movies] = await Promise.all([TMDB.trendingMovies()]).catch(() => [[]]);
    const stage = document.createElement("div");
    stage.className = "web-stage";
    viewEl.appendChild(stage);
    WebMap.render(stage, movies, onCategory, onTitle);
  }

  function grid(items, title, sub, onTitle) {
    header(title, sub);
    const g = document.createElement("div");
    g.className = "grid";
    items.forEach((t, i) => {
      // insert in-grid native ad every 12 cards
      if (i > 0 && i % 12 === 0 && CONFIG.AD_SLOTS.inGrid.html) {
        const ad = document.createElement("div");
        ad.className = "ad ad-filled"; ad.style.gridColumn = "1 / -1";
        ad.innerHTML = CONFIG.AD_SLOTS.inGrid.html;
        g.appendChild(ad);
      }
      const c = document.createElement("div");
      c.className = "card";
      c.innerHTML = `
        <div class="poster">
          ${t.poster ? `<img src="${t.poster}" alt="${t.name}" loading="lazy">` : "🎞️"}
          <span class="badge">${t.type === "movie" ? "Movie" : "Series"}</span>
          <span class="rating">★ ${t.rating}</span>
        </div>
        <div class="info"><h3>${t.name}</h3>
        <p>${t.year || "—"} · click to play trailer</p></div>`;
      c.onclick = () => onTitle(t);
      g.appendChild(c);
    });
    viewEl.appendChild(g);
  }

  async function loadingThen(title) {
    header(title, "Loading from TMDB…");
    const l = document.createElement("div");
    l.className = "loading"; l.textContent = "✨ Fetching posters…";
    viewEl.appendChild(l);
  }

  return { web, grid, loadingThen, header };
})();