(function () {
  "use strict";
  var P = window.PORTFOLIO;
  if (!P) { document.body.innerHTML = "<p style='padding:40px;font-family:sans-serif'>data.js did not load. Keep data.js in the same folder as index.html.</p>"; return; }
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var has = function (u) { return u && u !== "#"; };
  var link = function (u, t, cls) { return has(u) ? '<a class="' + cls + '" href="' + esc(u) + '" target="_blank" rel="noopener">' + t + "</a>" : ""; };

  /* ---------- content ---------- */
  document.title = P.name + " | " + (P.roles[0] || "Portfolio");
  $("logo").textContent = P.name.split(/\s+/).map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase();
  $("name").textContent = P.name;
  $("tagline").textContent = P.tagline;
  $("heroBtns").innerHTML = '<a class="btn p" href="#projects">View my work</a>' + link(P.linkedin, "LinkedIn", "btn") + link(P.github, "GitHub", "btn") + link(P.resume, "Download CV", "btn");
  $("stats").innerHTML = P.stats.map(function (s) { return '<div class="stat"><b>' + esc(s.value) + "</b><span>" + esc(s.label) + "</span></div>"; }).join("");
  $("aboutText").innerHTML = P.about.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("");
  $("skillsWrap").innerHTML = P.skills.map(function (g) {
    return '<div class="sg"><h3>' + esc(g.group) + '</h3><div class="pills">' + g.items.map(function (i) {
      return '<span class="pill">' + esc(i) + "</span>";
    }).join("") + "</div></div>";
  }).join("");
  $("certGrid").innerHTML = P.certifications.map(function (c) {
    return '<div class="card"><h3>' + esc(c.name) + "</h3><p>" + esc(c.issuer) + " · " + esc(c.year) + '</p><div class="links">' + link(c.link, "View credential ↗", "") + "</div></div>";
  }).join("");
  $("timeline").innerHTML = P.experience.map(function (e) {
    return '<div class="job"><small>' + esc(e.when) + "</small><h3>" + esc(e.title) + " · " + esc(e.where) + "</h3><p>" + esc(e.desc) + "</p></div>";
  }).join("");
  $("contactText").textContent = "Open to data analyst and web development opportunities. Based in " + P.location + ".";
  $("contactLinks").innerHTML = '<a class="btn p" href="mailto:' + esc(P.email) + '">' + esc(P.email) + "</a>" + link(P.linkedin, "LinkedIn", "btn") + link(P.github, "GitHub", "btn") + (P.phone ? '<a class="btn" href="tel:' + esc(P.phone) + '">' + esc(P.phone) + "</a>" : "");
  $("foot").textContent = "© " + new Date().getFullYear() + " " + P.name + ". Built with HTML, CSS and JavaScript.";

  /* ---------- projects with tag filter ---------- */
  var tags = ["All"];
  P.projects.forEach(function (p) { p.tags.forEach(function (t) { if (tags.indexOf(t) < 0) tags.push(t); }); });
  function showProjects(tag) {
    $("projGrid").innerHTML = P.projects.filter(function (p) { return tag === "All" || p.tags.indexOf(tag) >= 0; }).map(function (p) {
      return '<div class="card"><h3>' + esc(p.title) + "</h3><p>" + esc(p.desc) + '</p><div class="tags">' + p.tags.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + '</div><div class="links">' + link(p.live, "Live demo ↗", "") + link(p.code, "Source code ↗", "") + "</div></div>";
    }).join("");
    Array.prototype.forEach.call($("filters").children, function (b) { b.className = b.textContent === tag ? "on" : ""; });
  }
  $("filters").innerHTML = tags.map(function (t) { return "<button>" + esc(t) + "</button>"; }).join("");
  $("filters").addEventListener("click", function (e) { if (e.target.tagName === "BUTTON") showProjects(e.target.textContent); });
  showProjects("All");

  /* ---------- typing effect ---------- */
  var ri = 0, ci = 0, del = false, typed = $("typed");
  (function tick() {
    var w = P.roles[ri];
    typed.textContent = w.slice(0, ci);
    if (!del && ci === w.length) { del = true; return setTimeout(tick, 1400); }
    if (del && ci === 0) { del = false; ri = (ri + 1) % P.roles.length; }
    ci += del ? -1 : 1;
    setTimeout(tick, del ? 45 : 90);
  })();

  /* ---------- scroll reveal ---------- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach(function (s) { io.observe(s); });

  /* ---------- theme + mobile menu ---------- */
  try { var t = localStorage.getItem("pf-theme"); if (t) document.documentElement.dataset.theme = t; } catch (e) {}
  $("theme").onclick = function () {
    var n = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = n;
    try { localStorage.setItem("pf-theme", n); } catch (e) {}
  };
  $("burger").onclick = function () { $("menu").classList.toggle("open"); };
  $("menu").onclick = function () { $("menu").classList.remove("open"); };

  /* ---------- animated particle background ---------- */
  var cv = $("bg"), cx = cv.getContext("2d"), pts = [], W, H, mx = -999, my = -999;
  function size() { W = cv.width = innerWidth; H = cv.height = innerHeight; pts = []; var n = Math.min(90, Math.floor(W * H / 16000)); for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45 }); }
  addEventListener("resize", size); addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; });
  function draw() {
    cx.clearRect(0, 0, W, H);
    var dark = document.documentElement.dataset.theme === "dark", col = dark ? "150,200,255" : "60,80,160";
    pts.forEach(function (p, i) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
      cx.fillStyle = "rgba(" + col + ",.8)"; cx.beginPath(); cx.arc(p.x, p.y, 1.6, 0, 6.283); cx.fill();
      for (var j = i + 1; j < pts.length; j++) { var q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y); if (d < 130) { cx.strokeStyle = "rgba(" + col + "," + (.22 * (1 - d / 130)) + ")"; cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(q.x, q.y); cx.stroke(); } }
      var dm = Math.hypot(p.x - mx, p.y - my); if (dm < 160) { cx.strokeStyle = "rgba(34,211,238," + (.5 * (1 - dm / 160)) + ")"; cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(mx, my); cx.stroke(); }
    });
    requestAnimationFrame(draw);
  }
  size();
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) draw();
})();
