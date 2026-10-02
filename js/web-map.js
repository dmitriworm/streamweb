/* Spider-web node graph: genres around a center, trending posters as satellites */
const WebMap = (() => {
  const NODES = [
    { name: "Movies", type: "movies", r: 0.30, icon: "🎬" },
    { name: "Series", type: "series", r: 0.30, icon: "📺" },
    { name: "Anime", type: "anime", r: 0.30, icon: "🌸" },
    { name: "Sci-Fi", type: "movies", r: 0.34, icon: "🚀" },
    { name: "Trending", type: "movies", r: 0.24, icon: "🔥" },
    { name: "Top Rated", type: "series", r: 0.38, icon: "🏆" },
  ];

  function render(stage, items, onCategory, onTitle) {
    const N = NODES.length;
    let svg = `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs><linearGradient id="threadGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#7c4dff"/>
        <stop offset="50%" stop-color="#00e5ff"/>
        <stop offset="100%" stop-color="#ff3d9a"/>
      </linearGradient></defs>
      <circle cx="50" cy="50" r="14" class="web-ring"/>
      <circle cx="50" cy="50" r="26" class="web-ring"/>
      <circle cx="50" cy="50" r="38" class="web-ring"/>
      <circle cx="50" cy="50" r="46" class="web-ring"/>`;

    const pts = NODES.map((n, i) => {
      const a = (i / N) * Math.PI * 2 - Math.PI / 2;
      return { ...n, x: 50 + Math.cos(a) * n.r * 100, y: 50 + Math.sin(a) * n.r * 78 };
    });

    pts.forEach((p, i) => {
      svg += `<line x1="50" y1="50" x2="${p.x}" y2="${p.y}"
        class="web-thread ${i % 2 ? "pulse" : ""}" style="animation-delay:${i * 0.4}s"/>`;
    });

    // satellites: trending titles on outer ring, threads to nearest category
    const sats = items.slice(0, 8).map((t, i) => {
      const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
      const near = pts[i % pts.length];
      return { ...t, x: 50 + Math.cos(a) * 46, y: 50 + Math.sin(a) * 40, near };
    });
    sats.forEach((s, i) => {
      svg += `<line x1="${s.near.x}" y1="${s.near.y}" x2="${s.x}" y2="${s.y}"
        class="web-thread ${i % 3 ? "" : "pulse"}" style="animation-delay:${i * 0.3}s"/>`;
    });
    svg += "</svg>";
    stage.innerHTML = svg;

    // center
    const c = mkNode("node center", "50%", "50%",
      `<div class="orb">🕸️</div><div class="label">StreamWeb</div><div class="count">${items.length} trending</div>`);
    stage.appendChild(c);

    // category nodes
    pts.forEach(p => {
      const n = mkNode("node", p.x + "%", p.y + "%",
        `<div class="orb">${p.icon}</div><div class="label">${p.name}</div>`);
      n.onclick = () => onCategory(p.type);
      stage.appendChild(n);
    });

    // trending satellites with real posters
    sats.forEach(s => {
      const img = s.poster ? `<img src="${s.poster}" alt="${s.name}" loading="lazy">` : "🎞️";
      const n = mkNode("node", s.x + "%", s.y + "%",
        `<div class="orb">${img}</div><div class="label">${s.name}</div>`);
      n.onclick = () => onTitle(s);
      stage.appendChild(n);
    });
  }

  function mkNode(cls, left, top, html) {
    const n = document.createElement("div");
    n.className = cls;
    n.style.left = left; n.style.top = top;
    n.innerHTML = html;
    return n;
  }

  return { render, NODES };
})();