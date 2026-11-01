/* Change these values to update every page. Number: country code + digits, no plus or spaces. */
var BUSINESS = "Website Studio";
var WA_NUMBER = "9779714205851";
var EMAIL = "websitestudio88@gmail.com";
var TAGLINE = "Your Vision. Our Creativity. One Digital Future.";

function waLink(text) { return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text); }
function pretty(n) { return "+" + n.slice(0, 3) + " " + n.slice(3); }

(function () {
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var page = document.body.getAttribute("data-page") || "home";
  var pages = [["home", "index.html", "Home"], ["about", "about.html", "About"], ["services", "services.html", "Services"], ["contact", "contact.html", "Contact"]];
  var nav = pages.map(function (p) {
    return '<a href="' + p[1] + '"' + (p[0] === page ? ' aria-current="page"' : "") + ">" + p[2] + "</a>";
  }).join("");
  var hello = waLink("Hello " + BUSINESS + ", I would like to talk about a website.");

  var head = document.getElementById("site-header");
  if (head) head.innerHTML = '<header class="bar wide"><a class="logo" href="index.html">' + BUSINESS + '</a><nav aria-label="Main">' + nav + "</nav></header>";
  var foot = document.getElementById("site-footer");
  if (foot) foot.innerHTML = '<footer class="wide"><span class="tagline">' + TAGLINE + "</span><span>" + EMAIL + " · " + pretty(WA_NUMBER) + "</span></footer>" +
    '<a class="btn wa float" href="' + hello + '" target="_blank" rel="noopener">WhatsApp</a>';

  document.querySelectorAll("[data-wa]").forEach(function (a) { a.href = hello; });
  document.querySelectorAll("[data-number]").forEach(function (s) { s.textContent = pretty(WA_NUMBER); });
  document.querySelectorAll("[data-email]").forEach(function (s) { s.textContent = EMAIL; });

  var form = document.getElementById("orderForm");
  if (form) {
    var n = document.getElementById("fName"), t = document.getElementById("fType"), m = document.getElementById("fMsg"), a = document.getElementById("formWa");
    var update = function () {
      var who = n.value.trim() || "a visitor";
      a.href = waLink("Hello " + BUSINESS + ", this is " + who + ". I need: " + t.value + ". " + m.value.trim());
    };
    [n, t, m].forEach(function (el) { el.addEventListener("input", update); });
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    update();
  }

  document.querySelectorAll("[data-copy]").forEach(function (b) {
    var original = b.textContent;
    b.addEventListener("click", function () {
      var txt = b.getAttribute("data-copy") === "email" ? EMAIL : pretty(WA_NUMBER);
      try { navigator.clipboard.writeText(txt).then(function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = original; }, 1600); }, function () { b.textContent = txt; }); }
      catch (err) { b.textContent = txt; }
    });
  });

  /* 3D card tilt with a red spotlight that follows the pointer */
  document.querySelectorAll(".tilt").forEach(function (el) {
    var pointerFrame = 0, pointerX = 0, pointerY = 0;
    el.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(function () {
        var r = el.getBoundingClientRect(), x = (pointerX - r.left) / r.width, y = (pointerY - r.top) / r.height;
        el.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
        el.style.setProperty("--my", (y * 100).toFixed(1) + "%");
        el.style.setProperty("--ry", ((x - 0.5) * 10).toFixed(2) + "deg");
        el.style.setProperty("--rx", ((0.5 - y) * 10).toFixed(2) + "deg");
        pointerFrame = 0;
      });
    });
    el.addEventListener("pointerleave", function () {
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      pointerFrame = 0;
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    });
  });

  /* slow background parallax */
  if (!reduced) {
    var ticking = false;
    addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        document.documentElement.style.setProperty("--sy", String(Math.round(window.scrollY)));
        ticking = false;
      });
    }, { passive: true });
  }

  /* drifting particles */
  var c = document.createElement("canvas");
  c.id = "fx";
  c.setAttribute("aria-hidden", "true");
  document.body.insertBefore(c, document.body.firstChild);
  var ctx = c.getContext("2d");
  if (!ctx) return;
  var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 1.5), P = [], raf = 0, lastFrame = 0;
  function mk() {
    return { x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + 0.4, vx: (Math.random() - 0.5) * 0.15, vy: -(Math.random() * 0.25 + 0.05), red: Math.random() < 0.45, a: Math.random() * 0.5 + 0.2 };
  }
  function size() {
    W = window.innerWidth; H = window.innerHeight;
    c.width = W * dpr; c.height = H * dpr; c.style.width = W + "px"; c.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var N = Math.round(Math.min(36, (W * H) / 36000));
    while (P.length < N) P.push(mk());
    P.length = N;
  }
  function draw(time) {
    if (!reduced && time - lastFrame < 1000 / 120) { raf = requestAnimationFrame(draw); return; }
    var frameScale = lastFrame ? Math.min((time - lastFrame) / (1000 / 60), 2) : 1;
    lastFrame = time;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < P.length; i++) {
      var p = P[i];
      if (!reduced) {
        p.x += p.vx * frameScale; p.y += p.vy * frameScale;
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
        if (p.x < -5) p.x = W + 5;
        if (p.x > W + 5) p.x = -5;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 6.2832);
      if (p.red) ctx.fillStyle = "rgba(255,0,60," + p.a + ")";
      else ctx.fillStyle = "rgba(255,255,255," + (p.a * 0.6) + ")";
      ctx.fill();
    }
    if (!reduced) raf = requestAnimationFrame(draw);
  }
  size();
  draw();
  addEventListener("resize", function () { size(); if (reduced) draw(); });
  document.addEventListener("visibilitychange", function () {
    if (reduced) return;
    if (document.hidden) cancelAnimationFrame(raf);
    else { lastFrame = 0; raf = requestAnimationFrame(draw); }
  });
})();
