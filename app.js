/* ===== HARD DEBUG CORE ===== */
(function(){
  // 1) Простейшая проверка, что файл загрузился и выполнился
  console.log('[APP] external app.js загружен, inline ok =', window.__INLINE_OK__ === true);

  // 2) Карта регионов (координаты — проценты от контейнера)
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

  const q = s => document.querySelector(s);
  const qa = s => Array.from(document.querySelectorAll(s));

  // 3) Прямые обработчики на нижние кнопки + визуальный alert
  const bindTab = (id, name) => {
    const el = document.getElementById(id);
    if(!el) return;
    el.addEventListener('click', (e)=>{
      e.preventDefault();
      alert('TAB CLICK: ' + name);
      qa('.tab').forEach(t=>t.classList.remove('active'));
      (q('#tab-' + name) || q('[data-tab-pane=\"' + name + '\"]'))?.classList.add('active');
    });
  };
  bindTab('tab-btn-shop','shop');
  bindTab('tab-btn-map','map');
  bindTab('tab-btn-profile','profile');

  // 4) Рендер зелёных хот-спотов и алерты при клике
  const wrap = q('#map-wrap');
  if(wrap && !wrap.dataset.hotspotsReady){
    REGIONS.forEach(r=>{
      const b = document.createElement('button');
      b.className = 'hotspot';
      b.style.left = r.x + '%';
      b.style.top  = r.y + '%';
      b.addEventListener('click', ()=> alert('REGION CLICK: ' + r.name));
      wrap.appendChild(b);
    });
    wrap.dataset.hotspotsReady = '1';
  }

  // 5) Пишем видимую метку в DOM, чтобы без консоли было понятно, что app.js работает
  const mark = document.createElement('div');
  mark.style.cssText = 'position:fixed;right:8px;top:36px;background:#00ff88;color:#111;padding:6px 10px;border-radius:8px;z-index:2147483646;font-weight:700';
  mark.textContent = 'app.js OK';
  document.body.appendChild(mark);
})();


//
// ===== PATCH: rebuild hotspots on load (no regex) =====
(function(){
  const wrap = document.querySelector('#map-wrap');
  if(!wrap) return;

  // Локальный список координат (из твоего макета с красными точками)
  const REG = [
    { id:'kiranomiya',     name:'Kiranomiya',     x:50.9, y:35.8 },
    { id:'noroburg',       name:'Noroburg',       x:77.6, y:37.8 },
    { id:'russet-skyline', name:'Russet Skyline', x:49.5, y:59.4 },
    { id:'solmara',        name:'Solmara',        x:80.4, y:63.0 },
    { id:'san-maris',      name:'San Maris',      x:21.8, y:63.0 },
    { id:'nordhaven',      name:'Nordhaven',      x:24.3, y:81.0 },
    { id:'valparyn',       name:'Valparyn',       x:69.5, y:83.0 },
    { id:'nihon',          name:'Nihon',          x:19.8, y:40.0 }
  ];

  function rebuild(){
    // удалить старые точки (если были)
    wrap.querySelectorAll('.hotspot').forEach(n => n.remove());
    // создать заново
    REG.forEach(r=>{
      const b = document.createElement('button');
      b.className = 'hotspot';
      b.style.left = r.x + '%';
      b.style.top  = r.y + '%';
      b.setAttribute('aria-label', r.name || r.id);
      // пока оставим алерт — для проверки клика; потом уберём
      b.addEventListener('click', ()=> alert('REGION CLICK: ' + (r.name || r.id)));
      wrap.appendChild(b);
    });
  }

  window.rebuildHotspots = rebuild; // на всякий случай — пригодится для ручной перерисовки
  rebuild();
})();
// ===== PATCH: robust hotspot listeners for Telegram WebApp =====
(function(){
  function wireHotspot(el, payload){
    if(!el || el.__wired) return; el.__wired = true;

    const fire = ()=>{
      // тут вместо alert можно вызвать открытие региона, пока оставим alert для наглядности
      alert('REGION CLICK: ' + (payload?.name || payload?.id || 'unknown'));
    };

    const stop = (e)=>{ try{ e.preventDefault(); e.stopImmediatePropagation(); e.stopPropagation(); }catch(_){} };

    // pointer events (современные)
    el.addEventListener('pointerdown', e=>{ stop(e); el.setPointerCapture?.(e.pointerId); }, true);
    el.addEventListener('pointerup',   e=>{ stop(e); fire(); }, true);
    el.addEventListener('click',       e=>{ stop(e); fire(); }, true);

    // fallback для старых webview
    el.addEventListener('touchstart',  e=>{ stop(e); }, {capture:true, passive:false});
    el.addEventListener('touchend',    e=>{ stop(e); fire(); }, {capture:true, passive:false});
    el.addEventListener('mousedown',   e=>{ stop(e); }, true);
    el.addEventListener('mouseup',     e=>{ stop(e); fire(); }, true);
  }

  function rewireAll(){
    document.querySelectorAll('.hotspot').forEach(h=>{
      // попытаемся достать полезную инфу из aria-label
      const name = h.getAttribute('aria-label') || '';
      wireHotspot(h, {name});
    });
  }

  // сразу и на будущие вставки
  rewireAll();
  const obs = new MutationObserver(()=>rewireAll());
  obs.observe(document.getElementById('map-wrap') || document.body, {childList:true, subtree:true});
})();
