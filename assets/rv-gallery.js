/* ── Rare Velvet Gallery ──────────────────────────────────────────────
   Bruna/Missoma-style PDP imagery:
   • Desktop: hover the image to magnify in place; it pans under the cursor.
   • Any device: click an image to open a full-screen lightbox.
   • Lightbox: click/tap to toggle 2.4× zoom (pans under cursor / drag on touch),
     arrows or swipe to move between images, Esc / ✕ / backdrop to close.
   Targets the stacked gallery markup: [data-gallery] .rv-zoom-frame > img
--------------------------------------------------------------------- */
(function () {
  // Upscale a Shopify CDN url for the lightbox (swap any width=NNN to a big one).
  function hiRes(src) {
    if (!src) return src;
    if (/[?&]width=\d+/.test(src)) return src.replace(/([?&])width=\d+/, '$1width=2048');
    return src + (src.indexOf('?') > -1 ? '&' : '?') + 'width=2048';
  }
  function canHover() {
    return window.matchMedia('(hover:hover) and (pointer:fine)').matches && window.innerWidth >= 1024;
  }

  document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
    var frames = [].slice.call(gallery.querySelectorAll('.rv-zoom-frame'));
    if (!frames.length) return;

    var sources = []; // ordered list of <img> for the lightbox
    frames.forEach(function (frame) {
      var img = frame.querySelector('img');
      if (!img) return;
      var index = sources.length;
      sources.push(img);

      /* ---------- Desktop in-place hover zoom (cursor pan) ---------- */
      var Z = 2.1;
      frame.addEventListener('mouseenter', function () {
        if (!canHover()) return;
        img.style.transition = 'transform .18s ease-out';
        img.style.transform = 'scale(' + Z + ')';
        setTimeout(function () { img.style.transition = 'transform .05s linear'; }, 180);
      });
      frame.addEventListener('mousemove', function (e) {
        if (!canHover()) return;
        var r = frame.getBoundingClientRect();
        var x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * 100;
        var y = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)) * 100;
        img.style.transformOrigin = x + '% ' + y + '%';
      });
      frame.addEventListener('mouseleave', function () {
        img.style.transition = 'transform .3s cubic-bezier(.2,.7,.2,1)';
        img.style.transform = '';
        img.style.transformOrigin = 'center center';
      });

      /* ---------- Click → open lightbox ---------- */
      frame.style.cursor = 'zoom-in';
      frame.addEventListener('click', function () { openLightbox(index); });
    });

    if (!sources.length) return;

    /* ===================== Lightbox ===================== */
    var ov = document.createElement('div');
    ov.className = 'rv-lb';
    ov.setAttribute('aria-hidden', 'true');
    ov.innerHTML =
      '<button class="rv-lb__close" aria-label="Close">✕</button>' +
      '<button class="rv-lb__nav rv-lb__nav--prev" aria-label="Previous">‹</button>' +
      '<button class="rv-lb__nav rv-lb__nav--next" aria-label="Next">›</button>' +
      '<div class="rv-lb__stage"><img class="rv-lb__img" alt=""></div>' +
      '<div class="rv-lb__count"></div>';
    document.body.appendChild(ov);

    var lbImg = ov.querySelector('.rv-lb__img');
    var lbCount = ov.querySelector('.rv-lb__count');
    var cur = 0, zoomed = false, panX = 0, panY = 0;
    var dragging = false, startX = 0, startY = 0, moved = false, swipeX = 0;

    function show(i) {
      cur = (i + sources.length) % sources.length;
      resetZoom();
      lbImg.src = hiRes(sources[cur].src);
      lbImg.alt = sources[cur].alt || '';
      lbCount.textContent = (cur + 1) + ' / ' + sources.length;
      ov.querySelectorAll('.rv-lb__nav').forEach(function (b) {
        b.style.display = sources.length > 1 ? '' : 'none';
      });
    }
    function openLightbox(i) {
      show(i);
      ov.classList.add('is-open');
      ov.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      ov.classList.remove('is-open');
      ov.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    function resetZoom() {
      zoomed = false; panX = panY = 0;
      lbImg.style.transition = 'transform .28s cubic-bezier(.2,.7,.2,1)';
      lbImg.style.transform = '';
      lbImg.classList.remove('is-zoomed');
    }
    function applyZoom() {
      lbImg.style.transform = zoomed ? 'translate(' + panX + 'px,' + panY + 'px) scale(2.4)' : '';
      lbImg.classList.toggle('is-zoomed', zoomed);
    }
    function clampPan() {
      var s = ov.getBoundingClientRect();
      var w = lbImg.clientWidth * 2.4, h = lbImg.clientHeight * 2.4;
      var mx = Math.max(0, (w - s.width) / 2), my = Math.max(0, (h - s.height) / 2);
      panX = Math.max(-mx, Math.min(mx, panX));
      panY = Math.max(-my, Math.min(my, panY));
    }

    ov.querySelector('.rv-lb__close').addEventListener('click', close);
    ov.querySelector('.rv-lb__nav--prev').addEventListener('click', function (e) { e.stopPropagation(); show(cur - 1); });
    ov.querySelector('.rv-lb__nav--next').addEventListener('click', function (e) { e.stopPropagation(); show(cur + 1); });
    ov.addEventListener('click', function (e) {
      if (e.target === ov || e.target.classList.contains('rv-lb__stage')) close();
    });

    // Click image: desktop toggles zoom at the cursor.
    lbImg.addEventListener('click', function (e) {
      e.stopPropagation();
      if (moved) { moved = false; return; }
      if (!zoomed) {
        var r = lbImg.getBoundingClientRect();
        panX = (r.left + r.width / 2 - e.clientX) * (2.4 - 1) / 2.4;
        panY = (r.top + r.height / 2 - e.clientY) * (2.4 - 1) / 2.4;
        zoomed = true; clampPan();
      } else { zoomed = false; panX = panY = 0; }
      lbImg.style.transition = 'transform .28s cubic-bezier(.2,.7,.2,1)';
      applyZoom();
    });

    // Touch: drag to pan when zoomed; horizontal swipe to change when not.
    lbImg.addEventListener('touchstart', function (e) {
      dragging = true; moved = false;
      var t = e.touches[0];
      startX = t.clientX - panX; startY = t.clientY - panY; swipeX = t.clientX;
    }, { passive: true });
    ov.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      var t = e.touches[0];
      if (Math.abs(t.clientX - swipeX) > 6) moved = true;
      if (zoomed) {
        panX = t.clientX - startX; panY = t.clientY - startY; clampPan();
        lbImg.style.transition = 'none'; applyZoom();
      }
    }, { passive: true });
    ov.addEventListener('touchend', function (e) {
      dragging = false;
      if (!zoomed && moved) {
        var dx = (e.changedTouches[0].clientX - swipeX);
        if (Math.abs(dx) > 50) { show(cur + (dx < 0 ? 1 : -1)); moved = false; }
      }
      lbImg.style.transition = 'transform .28s cubic-bezier(.2,.7,.2,1)';
    });

    document.addEventListener('keydown', function (e) {
      if (!ov.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') show(cur + 1);
      else if (e.key === 'ArrowLeft') show(cur - 1);
    });
  });
})();
