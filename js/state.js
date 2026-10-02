/* App state + localStorage watchlist */
const state = {
  view: "web",        // web | movies | series | anime | watchlist | search
  query: "",
  results: [],
  watchlist: JSON.parse(localStorage.getItem("sw_watchlist") || "[]"),

  setView(v) { this.view = v; },
  setQuery(q) { this.query = q; },
  inWatchlist(id) { return this.watchlist.some(t => t.id === id); },
  toggleWatchlist(item) {
    if (this.inWatchlist(item.id)) {
      this.watchlist = this.watchlist.filter(t => t.id !== item.id);
    } else {
      this.watchlist.push(item);
    }
    localStorage.setItem("sw_watchlist", JSON.stringify(this.watchlist));
  },
};