/* YouTube trailer embed controller */
const Player = (() => {
  const modal = document.getElementById("modal");
  const host = document.getElementById("yt-player");
  const titleEl = document.getElementById("p-title");
  const metaEl = document.getElementById("p-meta");
  const watchBtn = document.getElementById("p-watch");
  let current = null;

  async function open(item) {
    current = item;
    titleEl.textContent = item.name;
    metaEl.textContent = `${item.type === "movie" ? "Movie" : "Series"} · ${item.year || "—"} · ★ ${item.rating}`;
    updateWatchBtn();
    host.innerHTML = `<div class="loading" style="height:100%">Loading trailer…</div>`;
    modal.classList.add("open");
    Ads.refresh(); // refresh the under-player ad slot

    const key = await TMDB.trailerKey(item).catch(() => null);
    if (!current || current.id !== item.id) return; // user closed meanwhile
    host.innerHTML = key
      ? `<iframe id="yt-player" src="https://www.youtube.com/embed/${key}?autoplay=1&rel=0"
          title="${item.name} trailer" allowfullscreen></iframe>`
      : `<div class="loading" style="height:100%">No official trailer found 😢</div>`;
  }

  function close() {
    modal.classList.remove("open");
    host.innerHTML = ""; // stops playback
    current = null;
  }

  function updateWatchBtn() {
    if (!current) return;
    watchBtn.textContent = state.inWatchlist(current.id) ? "✓ In watchlist" : "★ Add to watchlist";
  }

  watchBtn.onclick = () => { if (current) { state.toggleWatchlist(current); updateWatchBtn(); } };
  document.getElementById("p-close").onclick = close;
  modal.addEventListener("click", e => { if (e.target === modal) close(); });

  return { open, close };
})();