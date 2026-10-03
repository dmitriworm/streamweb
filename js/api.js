/* Keyless API wrapper — TVMaze (series), Jikan (anime), iTunes (movies).
   No API keys, no signups. */
const API = (() => {

  async function getJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("API " + res.status);
    return res.json();
  }

  // iTunes needs JSONP (no CORS headers)
  function itunes(term) {
    return new Promise((resolve, reject) => {
      const cb = "sw_cb_" + Math.floor(Math.random() * 1e9);
      window[cb] = data => { resolve(data.results || []); delete window[cb]; };
      const s = document.createElement("script");
      s.src = `https://itunes.apple.com/search?media=movie&entity=movie&limit=24&term=${encodeURIComponent(term)}&callback=${cb}`;
      s.onerror = () => reject(new Error("iTunes unreachable"));
      document.body.appendChild(s);
    });
  }

  // ---- normalizers ----
  const tvItem = s => ({
    id: "tv" + s.id, type: "series",
    name: s.name,
    year: s.premiered ? s.premiered.slice(0, 4) : "—",
    rating: s.rating.average ? s.rating.average.toFixed(1) : "—",
    poster: s.image ? s.image.medium : null,
    overview: s.summary ? s.summary.replace(/<[^>]+>/g, "") : "",
  });

  const animeItem = a => ({
    id: "an" + a.mal_id, type: "anime",
    name: a.title,
    year: a.year || (a.aired ? String(a.aired.from).slice(0, 4) : "—"),
    rating: a.score ? a.score.toFixed(1) : "—",
    poster: a.images && a.images.jpg ? a.images.jpg.image_url : null,
    overview: a.synopsis || "",
    trailer: a.trailer_url || null, // YouTube trailer from MAL
  });

  const movieItem = m => ({
    id: "mv" + m.trackId, type: "movie",
    name: m.trackName.replace(/\s*[( Official Trailer| Trailer)[^)]*\]/gi, ""),
    year: (m.releaseDate || "").slice(0, 4),
    rating: m.contentAdvisoryRating || "—",
    poster: m.artworkUrl100 ? m.artworkUrl100.replace("100x100", "600x600") : null,
    overview: m.longDescription || m.shortDescription || "",
    preview: m.previewUrl || null, // 30s official trailer mp4
  });

  return {
    // ---- sections ----
    series: async () => (await getJSON("https://api.tvmaze.com/shows?page=0"))
      .sort((a, b) => (b.rating.average || 0) - (a.rating.average || 0))
      .slice(0, 24).map(tvItem),

    anime: async () => (await getJSON("https://api.jikan.moe/v4/top/anime?limit=24"))
      .data.map(animeItem),

    movies: async () => movieList(await itunes("official trailer 2025"), "Trending trailers"),

    search: async (q) => {
      const [tv, an, mv] = await Promise.allSettled([
        getJSON("https://api.tvmaze.com/search/shows?q=" + encodeURIComponent(q)),
        getJSON("https://api.jikan.moe/v4/search/anime?q=" + encodeURIComponent(q) + "&limit=12"),
        itunes(q),
      ]);
      return [
        ...(tv.status === "fulfilled" ? tv.value.map(r => tvItem(r.show)) : []),
        ...(an.status === "fulfilled" ? an.value.data.map(animeItem) : []),
        ...(mv.status === "fulfilled" ? mv.map(movieItem) : []),
      ];
    },

    // ---- trailer lookup ----
    // item.trailer (anime) or item.preview (movie) already carry media.
    // Series: no keyless trailer source — we return a YouTube search link.
    trailerFor: (item) => ({
      kind: item.trailer ? "youtube"
          : item.preview ? "mp4"
          : "search",
      url: item.trailer || item.preview
          || `https://www.youtube.com/results?search_query=${encodeURIComponent(item.name + " official trailer")}`,
    }),
  };

  async function movieList(raw) { return raw.map(movieItem); }
})();
