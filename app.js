/* ===== HARD DEBUG CORE ===== */
(function(){
  // 1) Простейшая проверка, что файл загрузился и выполнился
  console.log('[APP] external app.js загружен, inline ok =', window.__INLINE_OK__ === true);

  // 2) Карта регионов (координаты — проценты от контейнера)
  const REGIONS = [
    { id:'kiranomiya',     name:'Kiranomiya',     x:67.6, y:62.2 },
    { id:'noroburg',       name:'Noroburg',       x:41.8, y:39.9 },
    { id:'russet-skyline', name:'Russet Skyline', x:57.9, y:28.6 },
    { id:'san-maris',      name:'San Maris',      x:21.3, y:66.4 },
    { id:'solmara',        name:'Solmara',        x:74.5, y:78.8 },
    { id:'valparyn',       name:'Valparyn',       x:33.7, y:71.2 },
    { id:'nordhaven',      name:'Nordhaven',      x:15.8, y:28.9 },
    { id:'nihon',          name:'Nihon',          x:82.4, y:34.2 }
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
