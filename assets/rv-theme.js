
// ── Mobile overlay (Odd Muse style) ─────────────────────────────
(function(){
  const overlay  = document.querySelector('[data-menu-overlay]');
  const scrim    = document.querySelector('[data-menu-scrim]');
  const openBtns = document.querySelectorAll('[data-menu-toggle]');
  const closeBtns= document.querySelectorAll('[data-menu-close]');
  if(!overlay) return;

  function open(){
    overlay.classList.add('is-open');
    scrim.classList.add('is-visible');
    overlay.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    openBtns.forEach(b=>{ b.classList.add('is-open'); b.setAttribute('aria-expanded','true'); });
  }
  function close(){
    overlay.classList.remove('is-open');
    scrim.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    openBtns.forEach(b=>{ b.classList.remove('is-open'); b.setAttribute('aria-expanded','false'); });
  }

  openBtns.forEach(b=>b.addEventListener('click', open));
  closeBtns.forEach(b=>b.addEventListener('click', close));
  scrim.addEventListener('click', close);
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') close(); });
})();

// ── Global quick-add (cards on every page: home, collections, search) ──
if(!window.__rvQuickAdd){
  window.__rvQuickAdd = true;
  (function(){
    function closeAll(except){document.querySelectorAll('.rv-card__qa-panel.is-open').forEach(function(p){if(p!==except)p.classList.remove('is-open');});}
    document.addEventListener('click',function(e){
      var t=e.target.closest('[data-qa-toggle]');
      if(t){e.preventDefault();var p=t.parentElement.querySelector('[data-qa-panel]');if(p){closeAll(p);p.classList.toggle('is-open');}return;}
      var c=e.target.closest('[data-qa-close]');
      if(c){e.preventDefault();var pp=c.closest('[data-qa-panel]');if(pp)pp.classList.remove('is-open');return;}
      var a=e.target.closest('[data-qa-add]');
      if(a&&!a.disabled){e.preventDefault();var id=a.getAttribute('data-variant-id');if(!id)return;var orig=a.innerHTML;a.innerHTML='<span class="rv-card__qa-label">Adding…</span>';a.disabled=true;
        fetch('/cart/add.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id,quantity:1})}).then(function(r){
          if(r.ok){a.innerHTML='<span class="rv-card__qa-label">✓ Added</span>';fetch('/cart.js').then(function(c){return c.json();}).then(function(cart){var b=document.querySelector('[data-cart-count]');if(b)b.textContent=cart.item_count;document.dispatchEvent(new CustomEvent('rv:cart:updated',{detail:cart}));});setTimeout(function(){a.innerHTML=orig;a.disabled=false;var pa=a.closest('[data-qa-panel]');if(pa)pa.classList.remove('is-open');},1400);}
          else{a.innerHTML=orig;a.disabled=false;}
        }).catch(function(){a.innerHTML=orig;a.disabled=false;});return;}
      if(!e.target.closest('[data-qa-panel]'))closeAll(null);
    });
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAll(null);});
  })();
}


/* ── Rare Velvet Theme JS ────────────────────────────────────── */
(function(){
  // Sticky header
  var header=document.querySelector('.rv-header');
  var last=0;
  if(header){
    window.addEventListener('scroll',function(){
      var y=window.scrollY;
      header.classList.toggle('rv-header--scrolled',y>60);
      header.classList.toggle('rv-header--hidden',y>last+10&&y>140);
      last=y<0?0:y;
    },{passive:true});
  }
  // Mobile drawer
  var toggle=document.querySelector('[data-menu-toggle]');
  var drawer=document.querySelector('[data-menu-drawer]');
  var close=document.querySelector('[data-menu-close]');
  if(toggle&&drawer){
    toggle.addEventListener('click',function(){drawer.classList.toggle('is-open');document.body.style.overflow=drawer.classList.contains('is-open')?'hidden':'';});
  }
  if(close&&drawer){
    close.addEventListener('click',function(){drawer.classList.remove('is-open');document.body.style.overflow='';});
  }
  // Newsletter form
  document.addEventListener('submit',function(e){
    var form=e.target.closest('[data-newsletter-form]');
    if(!form)return;
    e.preventDefault();
    var input=form.querySelector('input[type=email]');
    var msg=form.querySelector('[data-form-msg]');
    if(!input||!input.value)return;
    if(msg)msg.textContent='Thank you! Check your inbox.';
    input.value='';
  });
})();
