// Team Wed-3 site scripts: mobile nav, graph selector (Data page), lightbox (Attachments).
document.documentElement.classList.remove("no-js");

// ---- Mobile nav toggle ----
(function () {
  var btn = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (!btn || !nav) return;
  btn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
})();

// ---- Graph selector (data.html) ----
(function () {
  var root = document.getElementById("graph-selector");
  if (!root) return;

  // Average R² vs. theory, as printed on the team's graphs.
  var R2 = {
    "18in_1-8": [0.9989, 0.9211],
    "22in_1-8": [0.9984, 0.9251],
    "27in_1-8": [0.9982, 0.9420],
    "18in_3-16": [0.9548, 0.7433],
    "22in_3-16": [0.9486, 0.7648],
    "27in_3-16": [0.9444, 0.7227]
  };
  var orificeLabel = { "1-8": "1/8 in", "3-16": "3/16 in" };
  var state = { height: "27", orifice: "1-8" };

  var hImg = document.getElementById("sel-height-img");
  var vImg = document.getElementById("sel-velocity-img");
  var hLink = document.getElementById("sel-height-link");
  var vLink = document.getElementById("sel-velocity-link");
  var cap = document.getElementById("sel-caption");

  function render() {
    var key = state.height + "in_" + state.orifice;
    var suite = state.height + " in start height, " + orificeLabel[state.orifice] + " orifice";
    hImg.src = "images/graphs/height_" + key + ".png";
    vImg.src = "images/graphs/velocity_" + key + ".png";
    hLink.href = hImg.src;
    vLink.href = vImg.src;
    hImg.alt = "Liquid height (in) versus time (s) for all four trials of the " + suite +
      " suite, with the dashed ideal Torricelli curve. Average R² = " + R2[key][0].toFixed(4) + ".";
    vImg.alt = "Exit velocity v2 (in/s) versus time (s) for all four trials of the " + suite +
      " suite, with the dashed ideal Torricelli line. Average R² = " + R2[key][1].toFixed(4) + ".";
    cap.innerHTML = "<strong>Figure 3.</strong> Measured (Trials 1–4) and theoretical (dashed) " +
      "results for the <strong>" + suite + "</strong> suite. (a) Liquid height vs. time, " +
      "average R² = <b>" + R2[key][0].toFixed(4) + "</b>. (b) Exit velocity v₂ vs. time, " +
      "average R² = <b>" + R2[key][1].toFixed(4) + "</b>. Click a graph to enlarge it; all 12 graphs are also on the <a href=\"attachments.html#graphs\">Attachments</a> page.";
  }

  root.querySelectorAll(".btn-group").forEach(function (group) {
    var prop = group.getAttribute("data-prop");
    group.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () {
        state[prop] = b.getAttribute("data-value");
        group.querySelectorAll("button").forEach(function (o) {
          o.setAttribute("aria-pressed", o === b ? "true" : "false");
        });
        render();
      });
    });
  });
  render();
})();

// ---- Lightbox (any a.zoom) ----
(function () {
  var links = document.querySelectorAll("a.zoom");
  if (!links.length) return;
  var box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Enlarged figure");
  box.innerHTML = '<button class="lightbox-close" type="button">Close ✕</button>' +
    '<figure><img alt=""><figcaption></figcaption></figure>';
  document.body.appendChild(box);
  var img = box.querySelector("img");
  var cap = box.querySelector("figcaption");
  var closeBtn = box.querySelector(".lightbox-close");
  var lastFocus = null;

  function close() {
    box.classList.remove("open");
    img.removeAttribute("src");
    if (lastFocus) lastFocus.focus();
  }
  links.forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      lastFocus = a;
      var inner = a.querySelector("img");
      img.src = a.getAttribute("href");
      img.alt = inner ? inner.alt : "";
      cap.textContent = a.getAttribute("data-caption") || "";
      box.classList.add("open");
      closeBtn.focus();
    });
  });
  closeBtn.addEventListener("click", close);
  box.addEventListener("click", function (e) { if (e.target === box) close(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && box.classList.contains("open")) close();
  });
})();

// ---- Drain-time chart tooltips (any [data-tip] inside .chart-wrap) ----
(function () {
  document.querySelectorAll(".chart-wrap").forEach(function (wrap) {
    var tip = document.createElement("div");
    tip.className = "chart-tip";
    tip.hidden = true;
    wrap.appendChild(tip);
    function show(el) {
      var w = wrap.getBoundingClientRect(), r = el.getBoundingClientRect();
      tip.textContent = el.getAttribute("data-tip");
      tip.style.left = (r.left + r.width / 2 - w.left + wrap.scrollLeft) + "px";
      tip.style.top = (r.top - w.top) + "px";
      tip.hidden = false;
    }
    wrap.querySelectorAll("[data-tip]").forEach(function (el) {
      var t = el.querySelector("title");
      if (t) t.remove(); // avoid a duplicate native tooltip
      el.setAttribute("aria-label", el.getAttribute("data-tip"));
      el.addEventListener("mouseenter", function () { show(el); });
      el.addEventListener("focus", function () { show(el); });
      el.addEventListener("mouseleave", function () { tip.hidden = true; });
      el.addEventListener("blur", function () { tip.hidden = true; });
    });
  });
})();
