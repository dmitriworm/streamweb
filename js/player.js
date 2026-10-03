/* Trailer modal — YouTube embed (anime), mp4 preview (movies), search link (series) */
const Player = (() => {
  const modal = document.getElementById("modal");
  const host = document.getElementById("yt-player");
  const titleEl = document.getElementById("p-title");
  const metaEl = document.getElementById("p-meta");
  const watchBtn = document.getElementById("p-watch");
  let current = null;

  function open(item) {
    current = item;
    titleEl.textContent = item.name;
    metaEl.textContent = `${item.type} · ${item.year} · ★ ${item.rating}`;
    updateWatchBtn();

    const t = API.trailerFor(item);
    if (t.kind === "youtube") {
      const key = t.url.includes("embed=") ? t.url.split("embed=")[1] : t.url.replace("https://www.youtube.com/watch?v=", "");
      host.innerHTML = `<iframe src="https://www.youtube.com/embed/${key}?autoplay=1&rel=0"
        title="${item.name} trailer" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe>`;
    } else if (t.kind === "mp4") {
      host.innerHTML = `<video src="${t.url}" controls autoplay style="width:100%;height:100%;background:#000"></video>`;
    } else {
      host.innerHTML = `<div class="loading" style="height:100%">
        No direct trailer source for this one.<br><br>
        <a href="${t.url}" target="_blank" rel="noopener" style="color:#00e5ff">▶ Watch trailer on YouTube</a></div>`;
    }
    modal.classList.add("open");
    Ads.refresh();
  }

  function close() {
    modal.classList.remove("open");
    host.innerHTML = "";
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
