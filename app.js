/* ===== CityChainNFT — Regions Menu (with per-region background & 3 offers) ===== */
(function(){
  const TS = Date.now();

  // Навигация табов: при переключении закрываем оверлей
  ['shop','map','profile'].forEach(name=>{
    const el = document.querySelector('#tab-btn-' + name);
    if(el){
      el.addEventListener('click', (e)=>{
        e.preventDefault();
        closeRegion();
        document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
        (document.getElementById('tab-'+name) || document.querySelector('[data-tab-pane=\"'+name+'\"]'))
          ?.classList.add('active');
      });
    }
  });

  // Список регионов (id → файл фона в нижнем регистре)
  const REGIONS = [
    { id:'kiranomiya',     name:'Kiranomiya',     bg:'kiranomiya.png' },
    { id:'noroburg',       name:'Noroburg',       bg:'noroburg.png' },
    { id:'russet-skyline', name:'Russet Skyline', bg:'russet-skyline.png' },
    { id:'san-maris',      name:'San Maris',      bg:'san-maris.png' },
    { id:'solmara',        name:'Solmara',        bg:'solmara.png' },
    { id:'valparyn',       name:'Valparyn',       bg:'valparyn.png' },
    { id:'nordhaven',      name:'Nordhaven',      bg:'nordhaven.png' },
    { id:'nihon',          name:'Nihon',          bg:'nihon.png' }
  ];

  // Рендер меню: крупные, но аккуратные кнопки (адаптивная сетка)
  const grid = document.getElementById('regions-grid');
  if(grid){
    grid.innerHTML = '';
    REGIONS.forEach((r)=>{
      const btn = document.createElement('button');
      btn.className = 'region-btn';
      btn.innerHTML = <div class=\"name\"></div><small>Открыть</small>;
      btn.addEventListener('click', ()=> openRegion(r));
      grid.appendChild(btn);
    });
  }

  // ===== Оверлей региона =====
  const overlay = document.getElementById('region-overlay');
  document.getElementById('btn-back')?.addEventListener('click', closeRegion);

  function openRegion(r){
    overlay.querySelector('#region-title').textContent = r.name;
    overlay.querySelector('.bg').style.backgroundImage = url(\"static/regions/?v=20251028_220608\");
    // 3 одинаковых предложения (заглушки)
    const list = overlay.querySelector('#region-list');
    list.innerHTML = '';
    const offers = buildOffersStub(r);
    offers.forEach(o=> list.appendChild(renderOffer(o)));
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden','false');
  }

  function closeRegion(){
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden','true');
    const bg = overlay.querySelector('.bg');
    if(bg) bg.style.backgroundImage = '';
  }

  // Три одинаковых карточки (заглушка)
  function buildOffersStub(region){
    const price = formatPrice(calcBase(region.id));
    const base = {
      regionId: region.id,
      type: 'House',
      district: 'A',
      area: 120,
      priceText: price,
      status: 'Available'
    };
    return [base, {...base}, {...base}];
  }

  function renderOffer(o){
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = 
      <div>
        <div class=\"title\"></div>
        <div class=\"meta\">
          <span>Класс: </span>
          <span>Площадь:  m²</span>
        </div>
      </div>
      <div class=\"actions\">
        <div class=\"price\"></div>
        <div class=\"status\"></div>
        <button class=\"btn\" disabled>Buy (скоро)</button>
      </div>
    ;
    return el;
  }

  // Простейшая оценка цены (заглушка) — факторы региона
  const REGION_FACTORS = {
    'kiranomiya':1.30, 'russet-skyline':1.25, 'noroburg':1.15, 'san-maris':1.10,
    'solmara':1.05, 'valparyn':1.00, 'nihon':1.00, 'nordhaven':0.95
  };
  function calcBase(regionId){
    const base = 100_000; // базовая цена для заглушки
    const mult = REGION_FACTORS[regionId] ?? 1.0;
    return Math.round(base * mult);
  }
  function formatPrice(n){ return '$ ' + n.toLocaleString('en-US'); }

  // Экспорт (для отладки)
  window.CityChainNFT = { REGIONS, openRegion, closeRegion };
})();
