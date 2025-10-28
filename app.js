/* ===== CityChainNFT core ===== */
(function(){
  const TS = Date.now();

  // Координаты центров (по твоим красным точкам, %, от контейнера)
  const REGIONS = [
    { id:'kiranomiya',     name:'Kiranomiya',     x:50.9, y:35.8 },
    { id:'noroburg',       name:'Noroburg',       x:77.6, y:37.8 },
    { id:'russet-skyline', name:'Russet Skyline', x:49.5, y:59.4 },
    { id:'san-maris',      name:'San Maris',      x:21.8, y:63.0 },
    { id:'solmara',        name:'Solmara',        x:80.4, y:63.0 },
    { id:'valparyn',       name:'Valparyn',       x:69.5, y:83.0 },
    { id:'nordhaven',      name:'Nordhaven',      x:24.3, y:81.0 },
    { id:'nihon',          name:'Nihon',          x:19.8, y:40.0 }
  ];

  const q  = (s,r=document)=>r.querySelector(s);
  const qa = (s,r=document)=>Array.from(r.querySelectorAll(s));

  const mapWrap = q('#map-wrap');
  const overlay = q('#region-overlay');

  // Вешаем вкладки (и закрываем оверлей при переключении)
  bindTab('tab-btn-shop','shop');
  bindTab('tab-btn-map','map');
  bindTab('tab-btn-profile','profile');

  function bindTab(id, name){
    const el = document.getElementById(id);
    if(!el) return;
    el.addEventListener('click', (e)=>{
      e.preventDefault();
      closeRegion();
      qa('.tab').forEach(t=>t.classList.remove('active'));
      (q('#tab-'+name) || q([data-tab-pane=""]))?.classList.add('active');
    });
  }

  // Рисуем хот-споты (пересоздаём на всякий случай)
  if(mapWrap){
    mapWrap.querySelectorAll('.hotspot').forEach(n=>n.remove());
    REGIONS.forEach(r=>{
      const b = document.createElement('button');
      b.className = 'hotspot';
      b.style.left = r.x + '%';
      b.style.top  = r.y + '%';
      b.setAttribute('aria-label', r.name);
      wireHotspot(b, r);
      mapWrap.appendChild(b);
    });
  }

  // Кнопка Назад в оверлее
  q('#btn-back', overlay)?.addEventListener('click', closeRegion);

  // ===== Поведение оверлея =====
  function openRegion(r){
    const title = q('#region-title', overlay);
    const bg = q('.bg', overlay);
    if(title) title.textContent = r.name;
    if(bg) bg.style.backgroundImage = url("static/regions/.png?v=20251028212810");
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden','false');
  }
  function closeRegion(){
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden','true');
    const bg = q('.bg', overlay);
    if(bg) bg.style.backgroundImage = '';
  }
  window.CityChainNFT = { openRegion, closeRegion, REGIONS };

  // Устойчивое навешивание на хот-споты (pointer/touch/click с перехватом)
  function wireHotspot(el, region){
    if(!el || el.__wired) return; el.__wired = true;
    const fire = ()=> openRegion(region);
    const stop = e=>{ try{ e.preventDefault(); e.stopImmediatePropagation(); e.stopPropagation(); }catch(_){ } };

    el.addEventListener('pointerdown', e=>{ stop(e); el.setPointerCapture?.(e.pointerId); }, true);
    el.addEventListener('pointerup',   e=>{ stop(e); fire(); }, true);
    el.addEventListener('click',       e=>{ stop(e); fire(); }, true);

    // фоллбэки для некоторых webview
    el.addEventListener('touchstart',  e=>{ stop(e); }, {capture:true, passive:false});
    el.addEventListener('touchend',    e=>{ stop(e); fire(); }, {capture:true, passive:false});
    el.addEventListener('mousedown',   e=>{ stop(e); }, true);
    el.addEventListener('mouseup',     e=>{ stop(e); fire(); }, true);
  }

  // На ESC закрываем оверлей
  window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeRegion(); });
})();
