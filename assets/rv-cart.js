
/* ── Rare Velvet Cart JS ─────────────────────────────────────── */
(function(){
  // Update cart count
  async function refreshCount(){
    try{
      var r=await fetch('/cart.js');
      var c=await r.json();
      document.querySelectorAll('[data-cart-count]').forEach(function(el){el.textContent=c.item_count;});
    }catch(e){}
  }

  // Card quick-add is handled globally in rv-theme.js ([data-qa-add]). Keep cart-count
  // in sync when any add fires so the header bubble updates everywhere.
  document.addEventListener('rv:cart:updated', function(e){
    var c = e.detail;
    if(c && typeof c.item_count !== 'undefined'){
      document.querySelectorAll('[data-cart-count]').forEach(function(el){ el.textContent = c.item_count; });
    } else {
      refreshCount();
    }
  });

  // Product page variant selection
  var variantData=document.querySelector('[data-product-json]');
  if(variantData){
    var variants=JSON.parse(variantData.textContent);
    var options={};
    // Init selected options from first available variant
    var currentVariant=variants.find(function(v){return v.available;})||variants[0];

    document.addEventListener('click',function(e){
      var btn=e.target.closest('[data-option-btn]');
      if(!btn)return;
      var optIdx=btn.dataset.optionIndex;
      var val=btn.dataset.value;
      // Update UI
      document.querySelectorAll('[data-option-btn][data-option-index="'+optIdx+'"]').forEach(function(b){b.classList.remove('is-selected');});
      btn.classList.add('is-selected');
      // Find matching variant
      var selected={};
      document.querySelectorAll('[data-option-btn].is-selected').forEach(function(b){selected[b.dataset.optionIndex]=b.dataset.value;});
      var match=variants.find(function(v){
        return Object.keys(selected).every(function(i){return v.options[parseInt(i)-1]===selected[i];});
      });
      if(match){
        // Update variant ID input
        var inp=document.getElementById('rv-variant-input');
        if(inp)inp.value=match.id;
        // Update price
        var priceEl=document.querySelector('[data-product-price]');
        if(priceEl)priceEl.textContent=formatMoney(match.price);
        var compareEl=document.querySelector('[data-product-compare-price]');
        if(compareEl){
          if(match.compare_at_price>match.price){compareEl.textContent=formatMoney(match.compare_at_price);compareEl.style.display='';}
          else{compareEl.style.display='none';}
        }
        // Update ATC
        var atc=document.querySelector('[data-atc-btn]');
        if(atc){atc.disabled=!match.available;atc.textContent=match.available?atc.dataset.labelAvail:atc.dataset.labelSold;}
        // Back-in-stock toggle + variant id
        var bis=document.querySelector('[data-bis-wrap]');
        if(bis){
          bis.style.display=match.available?'none':'';
          var nm=bis.querySelector('[data-notify-me]');
          if(nm)nm.setAttribute('data-variant-id',match.id);
        }
        // Update sticky ATC
        var satc=document.querySelector('[data-sticky-atc-btn]');
        if(satc){satc.disabled=!match.available;satc.dataset.variantId=match.id;}
        currentVariant=match;
      }
    });
  }
  function formatMoney(cents){return (cents/100).toLocaleString('en-US',{style:'currency',currency:'USD'});}

  // Sticky ATC visibility
  var pdpAtcRow=document.querySelector('[data-atc-row]');
  var stickyAtc=document.querySelector('.rv-sticky-atc');
  if(pdpAtcRow&&stickyAtc){
    var obs=new IntersectionObserver(function(entries){stickyAtc.classList.toggle('is-visible',!entries[0].isIntersecting);},{threshold:0});
    obs.observe(pdpAtcRow);
  }

  // Quantity buttons on PDP
  document.addEventListener('click',function(e){
    var inc=e.target.closest('[data-qty-inc]');
    var dec=e.target.closest('[data-qty-dec]');
    var inp=null;
    if(inc){inp=document.querySelector('[data-qty-input]');if(inp)inp.value=Math.max(1,parseInt(inp.value||1)+1);}
    if(dec){inp=document.querySelector('[data-qty-input]');if(inp)inp.value=Math.max(1,parseInt(inp.value||1)-1);}
  });

  // AJAX add-to-cart for the main PDP form so the cart drawer opens (instead of a
  // full reload to /cart). Uses FormData, so the variant id, quantity, selected
  // selling_plan and any line-item properties are all forwarded intact.
  var pdpForm=document.getElementById('rv-product-form');
  if(pdpForm){
    pdpForm.addEventListener('submit',function(e){
      e.preventDefault();
      var btn=pdpForm.querySelector('[data-atc-btn]');
      var orig=btn?btn.innerHTML:'';
      if(btn){btn.disabled=true;btn.textContent='Adding…';}
      fetch('/cart/add.js',{method:'POST',headers:{'Accept':'application/json'},body:new FormData(pdpForm)})
        .then(function(r){ if(!r.ok) throw new Error('add failed'); return r.json(); })
        .then(function(){ return fetch('/cart.js').then(function(c){return c.json();}); })
        .then(function(cart){
          document.querySelectorAll('[data-cart-count]').forEach(function(el){el.textContent=cart.item_count;});
          document.dispatchEvent(new CustomEvent('rv:cart:updated',{detail:cart}));
          if(btn){btn.innerHTML=orig;btn.disabled=false;}
        })
        .catch(function(){ pdpForm.submit(); }); // fall back to native submit on error
    });
  }
})();
