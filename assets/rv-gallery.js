
/* ── Rare Velvet Gallery: thumbnails + hover zoom + mobile tap zoom ── */
(function(){
  // Thumbnail switching
  document.addEventListener('click',function(e){
    var thumb=e.target.closest('[data-thumb]');
    if(!thumb)return;
    var gallery=thumb.closest('[data-gallery]');
    var mainImg=gallery&&gallery.querySelector('[data-main-img]');
    var src=thumb.dataset.src;
    if(!mainImg||!src)return;
    mainImg.src=src;
    gallery.querySelectorAll('[data-thumb]').forEach(function(t){t.classList.remove('is-active');});
    thumb.classList.add('is-active');
    // Update zoom panel
    var panel=gallery.querySelector('#rv-zoom-panel');
    if(panel){
      panel.style.backgroundImage='url("'+src+'")';
      var mw=mainImg.naturalWidth||mainImg.width;
      var mh=mainImg.naturalHeight||mainImg.height;
      var r=mainImg.getBoundingClientRect();
      panel.style.backgroundSize=(r.width*2.4)+'px '+(r.height*2.4)+'px';
    }
  });

  // Desktop hover zoom
  var galRoots=document.querySelectorAll('[data-gallery]');
  galRoots.forEach(function(gallery){
    var mainWrap=gallery.querySelector('[data-zoom-wrap]');
    var mainImg=gallery.querySelector('[data-main-img]');
    if(!mainWrap||!mainImg)return;

    // Create lens + panel
    var lens=document.createElement('div');lens.id='rv-zoom-lens';
    var panel=document.createElement('div');panel.id='rv-zoom-panel';
    mainWrap.appendChild(lens);
    gallery.appendChild(panel);

    var Z=2.4;
    var updatePanel=function(){
      var src=mainImg.src;
      if(!src)return;
      var r=mainWrap.getBoundingClientRect();
      panel.style.backgroundImage='url("'+src+'")';
      panel.style.backgroundSize=(r.width*Z)+'px '+(r.height*Z)+'px';
      lens.style.width=(panel.offsetWidth/Z)+'px';
      lens.style.height=(panel.offsetHeight/Z)+'px';
    };

    mainWrap.addEventListener('mouseenter',function(){
      if(window.innerWidth<1200)return;
      updatePanel();
      panel.style.display='block';lens.style.display='block';
    });
    mainWrap.addEventListener('mousemove',function(e){
      if(window.innerWidth<1200)return;
      var r=mainWrap.getBoundingClientRect();
      var x=e.clientX-r.left,y=e.clientY-r.top;
      x=Math.max(0,Math.min(x,r.width));y=Math.max(0,Math.min(y,r.height));
      var lw=lens.offsetWidth,lh=lens.offsetHeight;
      var lx=Math.max(0,Math.min(x-lw/2,r.width-lw));
      var ly=Math.max(0,Math.min(y-lh/2,r.height-lh));
      lens.style.left=lx+'px';lens.style.top=ly+'px';
      panel.style.backgroundPosition='-'+(lx*Z)+'px -'+(ly*Z)+'px';
    });
    mainWrap.addEventListener('mouseleave',function(){
      panel.style.display='none';lens.style.display='none';
    });

    // Mobile tap-to-zoom fullscreen
    var ov=document.createElement('div');
    ov.style.cssText='position:fixed;inset:0;z-index:200;background:#2B2A27;display:none;align-items:center;justify-content:center;overflow:hidden;touch-action:none;';
    var ovImg=document.createElement('img');
    ovImg.style.cssText='max-width:100%;max-height:100%;transform-origin:center center;transition:transform .28s cubic-bezier(.2,.7,.2,1);user-select:none;-webkit-user-drag:none;';
    var ovClose=document.createElement('button');
    ovClose.innerHTML='✕';
    ovClose.style.cssText='position:absolute;top:20px;right:20px;width:40px;height:40px;border-radius:999px;background:rgba(251,249,244,.9);color:#2B2A27;display:flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer;border:none;z-index:2;';
    ov.appendChild(ovImg);ov.appendChild(ovClose);
    document.body.appendChild(ov);

    var zoomed=false,panX=0,panY=0,dragging=false,sx=0,sy=0,moved=false;
    mainWrap.addEventListener('click',function(){
      if(window.innerWidth>=1200)return;
      ovImg.src=mainImg.src;
      zoomed=false;panX=panY=0;ovImg.style.transform='';
      ov.style.display='flex';
    });
    ovClose.addEventListener('click',function(){ov.style.display='none';});
    var applyTf=function(){ovImg.style.transform=zoomed?'translate('+panX+'px,'+panY+'px) scale(2.4)':'';};
    var clamp=function(){
      var r=ovImg.getBoundingClientRect(),or=ov.getBoundingClientRect();
      var mx=Math.max(0,(r.width-or.width)/2+24),my=Math.max(0,(r.height-or.height)/2+24);
      panX=Math.max(-mx,Math.min(mx,panX));panY=Math.max(-my,Math.min(my,panY));
    };
    ovImg.addEventListener('touchstart',function(e){dragging=true;moved=false;var t=e.touches[0];sx=t.clientX-panX;sy=t.clientY-panY;},{passive:true});
    ov.addEventListener('touchmove',function(e){if(!dragging)return;moved=true;var t=e.touches[0];panX=t.clientX-sx;panY=t.clientY-sy;clamp();ovImg.style.transition='none';applyTf();},{passive:true});
    ov.addEventListener('touchend',function(){dragging=false;ovImg.style.transition='transform .28s cubic-bezier(.2,.7,.2,1)';});
    ovImg.addEventListener('click',function(e){
      if(moved){moved=false;return;}
      if(!zoomed){var r=ov.getBoundingClientRect();panX=(r.width/2-(e.clientX-r.left))*(2.4-1)/2.4;panY=(r.height/2-(e.clientY-r.top))*(2.4-1)/2.4;zoomed=true;clamp();}
      else{zoomed=false;panX=panY=0;}
      ovImg.style.transition='transform .28s cubic-bezier(.2,.7,.2,1)';applyTf();
    });
  });
})();
