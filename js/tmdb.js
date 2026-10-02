/* TMDB API wrapper — real posters, metadata, trailer keys */
const TMDB = (() => {
  const KEY = CONFIG.TMDB_KEY;
  const BASE = CONFIG.TMDB_BASE;
  const IMG = CONFIG.IMG_BASE;

  async function get(path, params = {}) {
    const url = new URL(BASE + path);
    url.searchParams.set("api_key", KEY);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url);
    if (!res.ok) throw new Error("TMDB " + res.status);
    return res.json();
  }

  const poster = p => p ? `${IMG}/${CONFIG.POSTER_SIZE}${p}` : null;

  // Normalize a movie or tv item to our shape
  function mapItem(raw, type) {
    return {
      id: raw.id,
      type, // "movie" | "tv"
      name: raw.title || raw.name,
      year: (raw.release_date || raw.first_air_date || "").slice(0, 4),
      rating: raw.vote_average ? raw.vote_average.toFixed(1) : "—",
      poster: poster(raw.poster_path),
      overview: raw.overview || "",
      genreIds: raw.genre_ids || [],
    };
  }

  return {
    trendingMovies: async (page = 1) =>
      (await get("/trending/movie/week", { page })).results.map(r => mapItem(r, "movie")),
    trendingTV: async (page = 1) =>
      (await get("/trending/tv/week", { page })).results.map(r => mapItem(r, "tv")),
    anime: async (page = 1) =>
      (await get("/discover/tv", {
        page, sort_by: "popularity.desc",
        with_genres: "16", with_origin_country: "JP",
      })).results.map(r => mapItem(r, "tv")),

    search: async (q) => {
      const [m, t] = await Promise.all([
        get("/search/movie", { query: q }),
        get("/search/tv", { query: q }),
      ]);
      return [...m.results.map(r => mapItem(r, "movie")),
              ...t.results.map(r => mapItem(r, "tv"))];
    },

    // Official trailer YouTube key for a title
    trailerKey: async (item) => {
      const path = `/${item.type}/${item.id}/videos`;
      const data = await get(path);
      const trailer = data.results.find(v => v.site === "YouTube" && v.type === "Trailer")
        || data.results.find(v => v.site === "YouTube");
      return trailer ? trailer.key : null;
    },

    poster,
  };
})();