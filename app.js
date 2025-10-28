/* --- CityChainNFT core --- */
(function(){
  const TS = Date.now(); // кэш-бастинг для изображений

  // Карта регионов (координаты — проценты от контейнера, кликабельный центр)
  const REGIONS = [
    { id:'kiranomiya',     name:'Kiranomiya',     x:67.6, y:62.2 },
    { id:'noroburg',       name:'Noroburg',       x:41.8, y:39.9 },   // выровнено
    { id:'russet-skyline', name:'Russet Skyline', x:57.9, y:28.6 },   // выровнено
    { id:'san-maris',      name:'San Maris',      x:21.3, y:66.4 },
    { id:'solmara',        name:'Solmara',        x:74.5, y:78.8 },
    { id:'valparyn',       name:'Valparyn',       x:33.7, y:71.2 },
    { id:'nordhaven',      name:'Nordhaven',      x:15.8, y:28.9 },
    { id:'nihon',          name:'Nihon',          x:82.4, y:34.2 }    // выровнено
  ];

  const q  = (s, r=document) => r.querySelector(s);
  const qa = (s, r=document) => Array.from(r.querySelectorAll(s));

  const mapWrap = q('#map-wrap');
  const mapImg  = q('#map-image');

  // Страхуем карту от «чёрного экрана»: убеждаемся, что контейнер занимает высоту
  if(mapWrap){ mapWrap.style.minHeight = 'calc(100vh - 100px)'; }

  // Оверлей региона
  const overlay = ensureOverlay(); closeRegion(); closeRegion();

  // Рендер невидимых хот-спотов (без title, только aria-label)
  if(mapWrap && !mapWrap.dataset.hotspotsReady){
    REGIONS.forEach(r=>{
      const b = document.createElement('button');
      b.className = 'hotspot';
      b.style.left = r.x + '%';
      b.style.top  = r.y + '%';
      b.setAttribute('aria-label', r.name);
      b.addEventListener('click', ()=> openRegion(r));
      mapWrap.appendChild(b);
    });
    mapWrap.dataset.hotspotsReady = '1';
  }

  // Делегированная навигация вкладок: ловим клики по любым кнопкам таббара
  document.addEventListener('click', (e)=>{
    const el = e.target.closest('[data-tab],[data-tab-target],.tabbtn');
    if(!el) return;
    const to = el.getAttribute('data-tab') || el.getAttribute('data-tab-target') || (el.id||'').replace(/^tab-btn-/,'');
    if(!to) return;
    e.preventDefault();
    showTab(to);
  });

  // Старт: если нет активной вкладки — включаем «Карта»
  if(!q('.tab.active')){ q('#tab-map')?.classList.add('active'); }

  // Кэш-бастинг для самой карты (если src без ?v=)
  if(mapImg && !/\?v=/.test(mapImg.src)){
    const base = mapImg.getAttribute('src') || 'static/map.png';
    mapImg.src = base + '?v=' + TS;
  }

    // Прямые обработчики на нижние кнопки (bulletproof)
  const btnShop = document.getElementById("tab-btn-shop");
  const btnMap = document.getElementById("tab-btn-map");
  const btnProfile = document.getElementById("tab-btn-profile");
  if(btnShop)   btnShop.addEventListener("click",   (e)=>{ e.preventDefault(); showTab("shop"); });
  if(btnMap)    btnMap.addEventListener("click",    (e)=>{ e.preventDefault(); showTab("map"); });
  if(btnProfile)btnProfile.addEventListener("click",(e)=>{ e.preventDefault(); showTab("profile"); });function showTab(name){
    closeRegion(); // при смене вкладки — закрываем регион
    qa('.tab').forEach(t=>t.classList.remove('active'));
    const target = q(#tab-) || q([data-tab-pane=""]);
    if(target) target.classList.add('active');
  }

  function ensureOverlay(){
    let el = q('#region-overlay');
    if(el) return el;
    el = document.createElement('div');
    el.id = 'region-overlay';
    el.className = 'region-overlay';
    el.innerHTML = 
      <div class="bg"></div>
      <div class="panel">
        <div class="header">
          <div class="title" id="region-title"></div>
          <div class="controls">
            <button class="btn ghost" id="btn-filters">Фильтры</button>
            <button class="btn ghost" id="btn-sort">Сортировка</button>
            <button class="btn" id="btn-back">Назад</button>
          </div>
        </div>
        <div class="list" id="region-list">
          <div class="card">Скоро предложения этого региона…</div>
        </div>
      </div>;
    document.body.appendChild(el);
    el.querySelector('#btn-back').addEventListener('click', closeRegion);
    return el;
  }

  function openRegion(r){
    const title = q('#region-title', overlay);
    const bg = q('.bg', overlay);
    if(title) title.textContent = r.name;
    if(bg) bg.style.backgroundImage = url("static/regions/.png?v=20251028193734");
    overlay.classList.add('active');
  }

  function closeRegion(){
    overlay.classList.remove('active');
    const bg = q('.bg', overlay);
    if(bg) bg.style.backgroundImage = '';
  }

  // Экспорт для отладки
  window.CityChainNFT = { REGIONS, openRegion, closeRegion, showTab };
})();



