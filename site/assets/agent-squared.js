/*
 * Agent Squared landing page behaviour.
 * The page body is a static port of the Base44 build (agent-squared-hub.base44.app);
 * this file reproduces its interactions and scroll transitions without React:
 *   - category radar: reveal on 20% visibility (sweep + staggered dot pop-in),
 *     scroll parallax (+/-17px), ring hover/select, "View as" brand switch
 *   - FAQ accordion (single, collapsible, animated height)
 *   - header mobile menu (kept from the original site)
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ data */
  var CATS = [
    { key: 'agentic', label: 'AGENTIC MEDIA' },
    { key: 'dam', label: 'DAM' },
    { key: 'image', label: 'IMAGE API' },
    { key: 'moderation', label: 'MODERATION' },
    { key: 'upload', label: 'UPLOAD UX' },
    { key: 'video', label: 'VIDEO API' }
  ];
  var RINGS = [
    { key: 'first', short: 'PICKED FIRST', title: 'Picked first', band: [0, 125], dot: [62, 116], dotFill: '#111111', dotStroke: '#111111', swatch: '#111111' },
    { key: 'second', short: 'NAMED 2ND', title: 'Named 2nd', band: [125, 250], dot: [146, 242], dotFill: '#5D5FEF', dotStroke: '#111111', swatch: '#5D5FEF' },
    { key: 'third', short: 'NAMED 3RD', title: 'Named 3rd', band: [250, 375], dot: [268, 366], dotFill: '#6CFCFC', dotStroke: '#111111', swatch: '#6CFCFC' },
    { key: 'fourth', short: 'NAMED 4TH+', title: 'Named 4th or lower', band: [375, 500], dot: [392, 490], dotFill: '#FCFCFF', dotStroke: '#111111', swatch: '#FCFCFF' },
    { key: 'notseen', short: 'NOT SEEN', title: 'Not seen', band: [500, 585], dot: [518, 578], dotFill: 'none', dotStroke: '#111111', swatch: 'none' }
  ];
  var STUDY = {
    label: 'Sample study', date: 'Oct 9', sessions: 148,
    agents: [
      { name: 'Claude Code', sessions: 144, rated: true },
      { name: 'Codex CLI', sessions: 4, rated: false, note: 'too few to rate' }
    ],
    brands: [
      { key: 'x', label: 'Brand X', note: 'a real vendor, anonymized', matrix: { agentic: [7, 3, 2, 5, 8], dam: [9, 3, 2, 4, 6], image: [11, 4, 2, 4, 4], moderation: [6, 3, 2, 5, 8], upload: [5, 3, 2, 5, 10], video: [11, 3, 2, 4, 5] } },
      { key: 'y', label: 'Brand Y', note: 'a real vendor, anonymized', matrix: { agentic: [8, 4, 3, 4, 6], dam: [13, 4, 2, 2, 3], image: [14, 5, 2, 2, 2], moderation: [8, 5, 2, 3, 6], upload: [8, 5, 2, 2, 8], video: [20, 3, 1, 1, 0] } },
      { key: 'z', label: 'Brand Z', note: 'a real vendor, anonymized', matrix: { agentic: [4, 3, 3, 7, 8], dam: [6, 4, 4, 6, 4], image: [3, 3, 3, 8, 8], moderation: [3, 3, 2, 5, 11], upload: [2, 3, 2, 4, 14], video: [4, 2, 1, 3, 15] } }
    ]
  };
  var VIEW = 1280;
  var BAND_FILL = { first: 'rgba(108, 252, 252, 0.22)', second: 'rgba(17, 17, 17, 0.035)', third: 'rgba(108, 252, 252, 0.07)', fourth: 'rgba(17, 17, 17, 0.05)', notseen: 'rgba(108, 252, 252, 0.1)' };
  var GRID_OPACITY = { first: 0.32, second: 0.2, third: 0.2, fourth: 0.24, notseen: 0.45 };
  var DOT_R = { first: 5.4, second: 4.6, third: 4.6, fourth: 4.2, notseen: 4.2 };
  var SWEEP_BG = 'conic-gradient(rgba(108, 252, 252, 0) 0deg, rgba(108, 252, 252, 0) 286deg, rgba(108, 252, 252, 0.55) 357deg, rgba(108, 252, 252, 0) 360deg)';

  /* --------------------------------------------------------------- helpers */
  function hash(s) { var t = 2166136261; for (var n = 0; n < s.length; n += 1) { t ^= s.charCodeAt(n); t = Math.imul(t, 16777619); } return t >>> 0; }
  function rng(seed) { var t = seed; return function () { t += 1831565813; var e = Math.imul(t ^ (t >>> 15), 1 | t); e ^= e + Math.imul(e ^ (e >>> 7), 61 | e); return ((e ^ (e >>> 14)) >>> 0) / 4294967296; }; }
  function polar(r, deg) { var a = deg * Math.PI / 180; return { x: Math.cos(a) * r, y: Math.sin(a) * r }; }
  function slice(i) { var n = 360 / CATS.length, s = -90 + i * n; return { start: s, end: s + n, center: s + n / 2 }; }
  function mid(ring) { return (ring.band[0] + ring.band[1]) / 2; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function buildDots(matrix, brandKey) {
    var out = [];
    CATS.forEach(function (cat, ci) {
      var sl = slice(ci);
      RINGS.forEach(function (ring, ri) {
        var count = (matrix && matrix[cat.key] && matrix[cat.key][ri]) || 0;
        if (!count) return;
        var rand = rng(hash(brandKey + ':' + cat.key + ':' + ring.key));
        var span = sl.end - sl.start - 12, d = ring.dot[0], f = ring.dot[1];
        for (var e = 0; e < count; e += 1) {
          var t = span * ((e + 0.5) / count);
          var ang = sl.start + 6 + t + (rand() - 0.5) * (span / count) * 0.7;
          var p = polar(d + (f - d) * (0.12 + rand() * 0.8), ang);
          out.push({ ring: ring.key, x: p.x, y: p.y });
        }
      });
    });
    return out;
  }
  function totalsFor(matrix) {
    var t = {};
    RINGS.forEach(function (ring, ri) { t[ring.key] = CATS.reduce(function (acc, c) { return acc + ((matrix && matrix[c.key] && matrix[c.key][ri]) || 0); }, 0); });
    return t;
  }
  function cls(el, list) { el.setAttribute('class', list.filter(Boolean).join(' ')); }

  /* ------------------------------------------------------- category radar */
  function radarSvgStatic() {
    var rim = RINGS[RINGS.length - 1].band[1];
    var s = '';
    RINGS.forEach(function (r) { s += '<circle r="' + mid(r) + '" fill="none" stroke="' + BAND_FILL[r.key] + '" stroke-width="' + (r.band[1] - r.band[0]) + '"></circle>'; });
    for (var k = 0; k < 36; k += 1) {
      var a = k * 10 - 90, p1 = polar(rim, a), p2 = polar(rim + 11, a);
      s += '<line x1="' + p1.x + '" y1="' + p1.y + '" x2="' + p2.x + '" y2="' + p2.y + '" stroke="#111111" stroke-opacity="0.28" stroke-width="1" vector-effect="non-scaling-stroke"></line>';
    }
    CATS.forEach(function (c, i) { var p = polar(rim, slice(i).start); s += '<line x1="0" y1="0" x2="' + p.x + '" y2="' + p.y + '" stroke="#111111" stroke-opacity="0.12" stroke-width="1" vector-effect="non-scaling-stroke"></line>'; });
    RINGS.forEach(function (r) { s += '<circle r="' + r.band[1] + '" fill="none" stroke="#111111" stroke-opacity="' + GRID_OPACITY[r.key] + '" stroke-width="' + (r.key === 'notseen' ? 1.6 : 1) + '" vector-effect="non-scaling-stroke"></circle>'; });
    s += '<g data-dots></g>';
    s += '<g class="hidden lg:block">';
    CATS.forEach(function (c, i) {
      var p = polar(535, slice(i).center), words = c.label.split(' ');
      s += '<text x="' + p.x + '" y="' + (p.y - (words.length - 1) * 26 / 2) + '" text-anchor="middle" font-size="22" letter-spacing="3" fill="#111111" fill-opacity="0.8" stroke="#FCFCFF" stroke-opacity="0.9" stroke-width="10" paint-order="stroke" style="font-family: &quot;JetBrains Mono&quot;, ui-monospace, monospace; font-weight: 500;">';
      words.forEach(function (w, wi) { s += '<tspan x="' + p.x + '" dy="' + (wi === 0 ? 0 : 26) + '">' + esc(w) + '</tspan>'; });
      s += '</text>';
    });
    s += '</g><circle r="9" fill="#111111"></circle>';
    s += '<line x1="-19" y1="0" x2="19" y2="0" stroke="#111111" stroke-opacity="0.35" stroke-width="1" vector-effect="non-scaling-stroke"></line>';
    s += '<line x1="0" y1="-19" x2="0" y2="19" stroke="#111111" stroke-opacity="0.35" stroke-width="1" vector-effect="non-scaling-stroke"></line>';
    return s;
  }

  function initCategoryRadar(root) {
    var state = { brand: 'x', ring: null, play: false };
    var brand = function () { return STUDY.brands.filter(function (b) { return b.key === state.brand; })[0] || STUDY.brands[0]; };

    var ringBtns = RINGS.map(function (r) {
      return '<button type="button" data-ring-label="' + r.key + '" style="left: 50%; top: ' + (50 - mid(r) / VIEW * 100) + '%;">' + r.short + '<span class="text-electric"></span></button>';
    }).join('');
    var legend = RINGS.map(function (r) {
      return '<button type="button" data-ring-card="' + r.key + '"><span class="flex items-center gap-2"><span class="h-2.5 w-2.5 shrink-0 rounded-full border border-ink" style="background: ' + (r.swatch === 'none' ? 'transparent' : r.swatch) + ';"></span><span class="font-mono text-[9px] uppercase tracking-[0.1em] text-ink/70">' + r.short + '</span></span><span class="flex items-baseline gap-1.5"><span class="text-xl font-black leading-none"></span><span class="font-mono text-[10px] text-ink/60"></span></span></button>';
    }).join('');
    var catCards = CATS.map(function (c) {
      return '<div class="border-2 border-ink bg-paper px-3 py-2.5"><p class="font-mono text-[9px] uppercase tracking-[0.12em] text-ink/60">' + c.label + '</p><p class="mt-1.5 text-lg font-black leading-none" data-cat="' + c.key + '"></p></div>';
    }).join('');
    var brandBtns = STUDY.brands.map(function (b) { return '<button type="button" data-brand="' + b.key + '">' + b.label + '</button>'; }).join('');
    var agents = STUDY.agents.map(function (a) { return '<span class="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/70">' + a.name + ' · ' + a.sessions + (a.rated ? '' : ' · ' + a.note) + '</span>'; }).join('');

    root.innerHTML =
      '<div class="relative mx-auto aspect-square w-full max-w-[680px]" data-stage>' +
        '<svg viewBox="-640 -640 1280 1280" class="absolute inset-0 h-full w-full" role="img">' + radarSvgStatic() + '</svg>' +
        '<div class="pointer-events-none absolute inset-0 hidden lg:block">' + ringBtns + '</div>' +
      '</div>' +
      '<div class="mt-5 flex flex-wrap items-center justify-between gap-3 border-2 border-ink bg-signal/60 px-4 py-3"><p class="font-mono text-[10px] uppercase tracking-[0.14em]" data-bar-label></p><div class="flex flex-wrap gap-x-4 gap-y-1">' + agents + '</div></div>' +
      '<div class="mt-4"><div class="grid grid-cols-2 gap-2 lg:grid-cols-5">' + legend + '</div></div>' +
      '<div class="mt-4 lg:hidden"><div class="grid grid-cols-2 gap-2 sm:grid-cols-3">' + catCards + '</div></div>' +
      '<div class="mt-5 flex flex-wrap items-center justify-between gap-4"><div class="flex flex-wrap items-center gap-3"><span class="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/60">View as</span><div class="inline-flex border-2 border-ink bg-paper fw-shadow-sm">' + brandBtns + '</div></div><p class="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60" data-brand-note></p></div>';

    var stage = root.querySelector('[data-stage]');
    var svg = stage.querySelector('svg');
    var q = function (sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); };

    function renderDots() {
      var b = brand();
      var dots = buildDots(b.matrix, b.key);
      var old = svg.querySelector('[data-dots]');
      var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('data-dots', '');
      g.innerHTML = dots.map(function (d, i) {
        var ring = RINGS.filter(function (r) { return r.key === d.ring; })[0];
        var anim = state.play ? ' class="radar-blip" style="animation-delay: ' + (i / Math.max(dots.length, 1) * 1.2).toFixed(3) + 's;"' : ' style="opacity: 0;"';
        return '<g opacity="1" data-ring="' + d.ring + '"><circle cx="' + d.x + '" cy="' + d.y + '" r="' + DOT_R[d.ring] + '" fill="' + ring.dotFill + '" stroke="' + ring.dotStroke + '" stroke-width="' + (d.ring === 'notseen' ? 1.6 : 0.9) + '"' + anim + '></circle></g>';
      }).join('');
      old.parentNode.replaceChild(g, old);
      svg.setAttribute('aria-label', 'Agent decision radar with ' + dots.length + ' sessions. One dot per session: the centre is picked first, outer rings are named lower, outside the rim is never named.');
      applyRing();
    }

    function applyRing() {
      var b = brand(), totals = totalsFor(b.matrix), active = state.ring;
      q('[data-dots] > g').forEach(function (g) { g.setAttribute('opacity', active && active !== g.getAttribute('data-ring') ? 0.12 : 1); });
      q('[data-ring-label]').forEach(function (btn) {
        var key = btn.getAttribute('data-ring-label'), on = active === key, r = RINGS.filter(function (x) { return x.key === key; })[0];
        cls(btn, ['pointer-events-auto absolute flex min-h-[28px] -translate-x-1/2 -translate-y-1/2 items-center gap-2 border-2 border-ink px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors', on ? 'bg-signal fw-shadow-sm' : 'bg-paper text-ink/70 hover:bg-signal/50']);
        btn.setAttribute('aria-label', r.title + ': ' + totals[key] + ' of ' + STUDY.sessions + ' sessions');
        btn.lastChild.textContent = totals[key];
      });
      q('[data-ring-card]').forEach(function (btn) {
        var key = btn.getAttribute('data-ring-card'), on = active === key;
        cls(btn, ['flex flex-col gap-2 border-2 border-ink p-3 text-left transition-colors', on ? 'bg-signal' : 'bg-paper hover:bg-signal/40']);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        var nums = btn.lastChild.children;
        nums[0].textContent = totals[key];
        nums[1].textContent = Math.round(totals[key] / STUDY.sessions * 100) + '%';
      });
      var r = RINGS.filter(function (x) { return x.key === active; })[0];
      root.querySelector('[data-bar-label]').textContent = r ? r.title + ': ' + totals[r.key] + ' of ' + STUDY.sessions + ' sessions' : STUDY.label + ' · ' + STUDY.date + ' · ' + STUDY.sessions + ' sessions';
    }

    function applyBrand() {
      var b = brand();
      q('[data-brand]').forEach(function (btn) {
        var on = btn.getAttribute('data-brand') === b.key;
        cls(btn, ['min-h-[40px] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors', on ? 'bg-electric text-white' : 'bg-paper text-ink hover:bg-signal/40']);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      q('[data-cat]').forEach(function (p) {
        var v = (b.matrix[p.getAttribute('data-cat')] || [])[0] || 0;
        p.innerHTML = v + '<span class="ml-1.5 font-mono text-[9px] font-normal uppercase tracking-[0.1em] text-ink/50">picked first</span>';
      });
      root.querySelector('[data-brand-note]').textContent = b.label + ', ' + b.note;
      renderDots();
    }

    function setRing(key) { if (state.ring === key) return; state.ring = key; applyRing(); }

    q('[data-ring-label]').forEach(function (btn) {
      var key = btn.getAttribute('data-ring-label');
      btn.addEventListener('click', function () { setRing(state.ring === key ? null : key); });
      btn.addEventListener('mouseenter', function () { setRing(key); });
      btn.addEventListener('mouseleave', function () { setRing(null); });
      btn.addEventListener('focus', function () { setRing(key); });
      btn.addEventListener('blur', function () { setRing(null); });
    });
    q('[data-ring-card]').forEach(function (btn) {
      var key = btn.getAttribute('data-ring-card');
      btn.addEventListener('click', function () { setRing(state.ring === key ? null : key); });
      btn.addEventListener('mouseenter', function () { setRing(key); });
      btn.addEventListener('mouseleave', function () { setRing(null); });
    });
    q('[data-brand]').forEach(function (btn) {
      btn.addEventListener('click', function () { var k = btn.getAttribute('data-brand'); if (k !== state.brand) { state.brand = k; applyBrand(); } });
    });

    applyBrand();

    return function play() {
      if (state.play) return;
      state.play = true;
      var wrap = document.createElement('div');
      wrap.className = 'pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[78.2%] -translate-x-1/2 -translate-y-1/2';
      wrap.innerHTML = '<div class="radar-sweep h-full w-full rounded-full" aria-hidden="true" style="background: ' + SWEEP_BG + ';"></div>';
      stage.insertBefore(wrap, svg);
      renderDots();
    };
  }

  /* Home: visibility trigger (once, threshold 0.2) + scroll parallax, as in the Base44 build.
     Sample report: the radar plays as soon as it mounts (data-autoplay). */
  function initRadarSection() {
    var root = document.querySelector('[data-cat-radar]');
    if (!root) return;
    var play = initCategoryRadar(root);
    if (root.hasAttribute('data-autoplay')) { play(); return; }
    var target = root.closest('[data-radar-track]');
    var mover = root.closest('[data-parallax]');

    if (typeof IntersectionObserver === 'undefined') { play(); }
    else {
      var io = new IntersectionObserver(function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) { play(); io.disconnect(); }
      }, { threshold: 0.2 });
      io.observe(target);
    }

    var raf = 0;
    function update() {
      raf = 0;
      var r = target.getBoundingClientRect();
      var n = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight + r.height)));
      mover.style.transform = 'translate3d(0, ' + ((n - 0.5) * -34).toFixed(2) + 'px, 0)';
    }
    function schedule() { if (!raf) raf = window.requestAnimationFrame(update); }
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
  }

  /* ---------------------------------------------------------------- FAQ */
  function initAccordion() {
    var root = document.querySelector('[data-accordion]');
    if (!root) return;
    var items = Array.prototype.slice.call(root.querySelectorAll('[data-accordion-item]')).map(function (el) {
      return { el: el, h3: el.querySelector('h3'), btn: el.querySelector('button'), panel: el.querySelector('[role="region"]') };
    });

    function set(item, open) {
      var p = item.panel, st = open ? 'open' : 'closed';
      p.hidden = false;
      var prevAnim = p.style.animationName;
      p.style.animationName = 'none';
      p.style.setProperty('--radix-collapsible-content-height', p.getBoundingClientRect().height + 'px');
      p.style.setProperty('--radix-collapsible-content-width', p.getBoundingClientRect().width + 'px');
      [item.el, item.h3, item.btn, p].forEach(function (n) { n.setAttribute('data-state', st); });
      item.btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      void p.offsetHeight;
      p.style.animationName = prevAnim;
      if (!open) {
        var done = function () { if (p.getAttribute('data-state') === 'closed') p.hidden = true; };
        var cs = window.getComputedStyle(p);
        if (cs.animationName === 'none' || parseFloat(cs.animationDuration) === 0) done();
        else p.addEventListener('animationend', done, { once: true });
      }
    }

    items.forEach(function (item, idx) {
      item.btn.addEventListener('click', function () {
        var isOpen = item.btn.getAttribute('aria-expanded') === 'true';
        items.forEach(function (other) { if (other !== item && other.btn.getAttribute('aria-expanded') === 'true') set(other, false); });
        set(item, !isOpen);
      });
      item.btn.addEventListener('keydown', function (e) {
        var keys = { ArrowDown: idx + 1, ArrowUp: idx - 1, Home: 0, End: items.length - 1 };
        if (!(e.key in keys)) return;
        e.preventDefault();
        var to = (keys[e.key] + items.length) % items.length;
        items[to].btn.focus();
      });
    });
  }

  /* ------------------------------------------------------- header menu */
  function initHeader() {
    var header = document.querySelector('[data-site-header]');
    if (!header) return;
    var btn = header.querySelector('[aria-controls="mobile-menu"]');
    var menu = document.getElementById('mobile-menu');
    var label = btn.querySelector('[data-menu-label]');
    function setOpen(open) {
      menu.hidden = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      header.classList.toggle('is-open', open);
      label.textContent = open ? 'Close' : 'Menu';
    }
    btn.addEventListener('click', function () { setOpen(menu.hidden); });
    Array.prototype.forEach.call(menu.querySelectorAll('a'), function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) setOpen(false); });
  }

  /* ------------------------------------------------------- study form */
  /* Same backend as the Base44 site: its submitStudyRequest function. */
  var STUDY_ENDPOINT = 'https://agent-squared-hub.base44.app/api/apps/6adf5536150bad5b6fba70b5/functions/submitStudyRequest';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var ICON_CHECK = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check h-8 w-8"><path d="M20 6 9 17l-5-5"></path></svg>';
  var ICON_SPIN = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle h-4 w-4 animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>';
  var BTN = 'inline-flex min-h-[48px] items-center justify-center gap-2 border-2 border-ink px-5 py-3 text-center font-mono text-[11px] uppercase leading-tight tracking-[0.14em] transition-transform duration-150 hover:-translate-y-[2px] active:translate-y-0';

  function initStudyForm() {
    var form = document.querySelector('[data-study-form]');
    if (!form) return;
    var REQUIRED = ['full_name', 'email', 'company', 'category'];
    var FIELDS = ['full_name', 'email', 'company', 'website', 'category', 'competitors', 'questions'];
    var btn = form.querySelector('button[type="submit"]');
    var field = function (n) { return form.elements[n]; };

    function setError(name, msg) {
      var input = field(name), label = input.parentNode;
      var old = label.querySelector('[data-error]');
      if (old) old.remove();
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      input.classList.toggle('border-destructive', !!msg);
      input.classList.toggle('border-ink', !msg);
      if (msg) {
        var span = document.createElement('span');
        span.setAttribute('data-error', '');
        span.className = 'mt-1.5 block font-mono text-[10px] uppercase tracking-[0.1em] text-destructive';
        span.textContent = msg;
        label.appendChild(span);
      }
    }
    function setFormError(msg) {
      var old = form.querySelector('[data-form-error]');
      if (old) old.remove();
      if (!msg) return;
      var p = document.createElement('p');
      p.setAttribute('data-form-error', '');
      p.className = 'mt-5 border-2 border-destructive px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-destructive';
      p.textContent = msg;
      btn.parentNode.parentNode.insertBefore(p, btn.parentNode);
    }
    function setSending(on) {
      btn.disabled = on;
      btn.innerHTML = on ? ICON_SPIN + 'Sending' : 'Request my category study';
    }
    function showSent(email) {
      var box = document.createElement('div');
      box.className = 'border-2 border-ink bg-signal p-8 fw-shadow';
      box.innerHTML = ICON_CHECK +
        '<h2 class="mt-5 text-2xl font-black tracking-[-0.02em]">Request received.</h2>' +
        '<p class="mt-3 max-w-md text-sm leading-relaxed text-ink/80">We will reply to ' + esc(email) + ' with the question set and the study scope before we start asking.</p>' +
        '<div class="mt-7 flex flex-wrap gap-3"><a class="' + BTN + ' bg-paper text-ink fw-shadow" href="../sample-report/">See a sample report</a><a class="' + BTN + ' bg-electric text-white fw-shadow" href="../method/">Read the method</a></div>';
      fixFileLinks(box);
      form.parentNode.replaceChild(box, form);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (field('trap').value) return;
      var v = {};
      FIELDS.forEach(function (n) { v[n] = field(n).value; });
      var errors = {};
      REQUIRED.forEach(function (n) { if (!v[n].trim()) errors[n] = 'Required'; });
      if (v.email.trim() && !EMAIL_RE.test(v.email.trim())) errors.email = 'Enter a valid email address';
      ['full_name', 'email', 'company', 'website', 'category'].forEach(function (n) { setError(n, errors[n]); });
      if (Object.keys(errors).length) return;

      setSending(true);
      setFormError('');
      fetch(STUDY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-App-Id': '6adf5536150bad5b6fba70b5', 'Base44-Functions-Version': 'prod' },
        body: JSON.stringify(v)
      }).then(function (res) {
        return res.json().catch(function () { return null; }).then(function (data) {
          if (data && data.ok) { showSent(v.email); return; }
          setSending(false);
          setFormError((data && data.error) || 'Something went wrong. Please try again.');
        });
      }).catch(function () {
        setSending(false);
        setFormError('We could not send your request. Please try again.');
      });
    });
  }

  /* ------------------------------------------------------- sign in */
  /* Same backend as https://agentsq.co/signin: POST /api/auth/login {identifier, password}.
     The session lives on agentsq.co and that endpoint sends no CORS headers, so sign-in completes
     when this site is served from agentsq.co; from any other host the browser blocks the call
     and the form shows an error instead of failing silently. */
  var AUTH_ORIGIN = 'https://agentsq.co';
  function initSignin() {
    var form = document.querySelector('[data-signin-form]');
    if (!form) return;
    var id = form.elements.identifier, pw = form.elements.password;
    var btn = form.querySelector('button[type="submit"]');
    var err = form.querySelector('[data-signin-error]');
    var busy = false;
    var onAuthHost = /(^|\.)agentsq\.co$/.test(window.location.hostname);
    var base = onAuthHost ? '' : AUTH_ORIGIN;

    function sync() { btn.disabled = busy || !id.value.trim() || !pw.value; }
    function showError(msg) { err.textContent = msg || ''; err.hidden = !msg; }
    function setBusy(on) { busy = on; btn.textContent = on ? 'Signing in…' : 'Continue'; sync(); }
    function destination(category) {
      var next = new URLSearchParams(window.location.search).get('next');
      // Only follow same-site paths ("/x", not "//host" or "https://host").
      if (next && next.charAt(0) === '/' && next.charAt(1) !== '/' && next.charAt(1) !== '\\') return base + next;
      return base + '/overview?category=' + encodeURIComponent(typeof category === 'string' ? category : 'cloudinary');
    }

    id.addEventListener('input', sync);
    pw.addEventListener('input', sync);
    sync();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (btn.disabled) return;
      showError('');
      setBusy(true);
      fetch(base + '/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: id.value, password: pw.value })
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok || (data && data.ok === false)) { setBusy(false); showError((data && data.error) || 'Something went wrong.'); return; }
          window.location.href = destination(data && data.category);
        });
      }).catch(function () {
        setBusy(false);
        showError('We could not reach the sign-in service. Please try again.');
      });
    });
  }

  /* Opened straight from disk (file://), folder links would show a directory listing; point them at index.html. */
  function fixFileLinks(scope) {
    if (window.location.protocol !== 'file:') return;
    Array.prototype.forEach.call((scope || document).querySelectorAll('a[href]'), function (a) {
      var href = a.getAttribute('href');
      if (/^[a-z]+:/i.test(href) || href.charAt(0) === '#') return;
      var m = href.match(/^([^#]*\/)(#.*)?$/);
      if (m) a.setAttribute('href', m[1] + 'index.html' + (m[2] || ''));
    });
  }

  function initYear() {
    var y = document.querySelector('[data-year]');
    if (y) y.textContent = new Date().getFullYear();
  }

  initHeader();
  initRadarSection();
  initAccordion();
  initStudyForm();
  initSignin();
  initYear();
  fixFileLinks();
})();
