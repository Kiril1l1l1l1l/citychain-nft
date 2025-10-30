/* ===== CityChainNFT — Regions Menu (robust) ===== */
(function(){
  var TS = Date.now();

  function qs(sel, root){ return (root||document).querySelector(sel); }
  function qsa(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }

  // Навигация табов: закрываем оверлей при переключении
  ['shop','map','profile'].forEach(function(name){
    var el = qs('#tab-btn-' + name);
    if(el){
      el.addEventListener('click', function(e){
        e.preventDefault();
        closeRegion();
        qsa('.tab').forEach(function(t){ t.classList.remove('active'); });
        var pane = qs('#tab-' + name) || qs('[data-tab-pane="' + name + '"]');
        if(pane) pane.classList.add('active');
      });
    }
  });

  // Список регионов и имена файлов фона (нижний регистр!)
  var REGIONS = [
    { id:'kiranomiya',     name:'Kiranomiya',     bg:'kiranomiya.png' },
    { id:'noroburg',       name:'Noroburg',       bg:'noroburg.png' },
    { id:'russet-skyline', name:'Russet Skyline', bg:'russet-skyline.png' },
    { id:'san-maris',      name:'San Maris',      bg:'san-maris.png' },
    { id:'solmara',        name:'Solmara',        bg:'solmara.png' },
    { id:'valparyn',       name:'Valparyn',       bg:'valparyn.png' },
    { id:'nordhaven',      name:'Nordhaven',      bg:'nordhaven.png' },
    { id:'nihon',          name:'Nihon',          bg:'nihon.png' }
  ];

  // Рендер сетки кнопок
  function renderMenu(){
    var grid = qs('#regions-grid');
    if(!grid) return;
    grid.innerHTML = '';
    REGIONS.forEach(function(r){
      var btn = document.createElement('button');
      btn.className = 'region-btn';
      btn.innerHTML = '<div class="name">'+r.name+'</div><small>Открыть</small>';
      btn.addEventListener('click', function(){ openRegion(r); });
      grid.appendChild(btn);
    });
  }

  // ===== Оверлей =====
  var overlay = qs('#region-overlay');

  function openRegion(r){
  const overlay = document.getElementById("region-overlay");
  const title   = overlay.querySelector("#region-title");
  const bgEl    = overlay.querySelector(".bg");
  const list    = overlay.querySelector("#region-list");

  title.textContent = r.name;

  // Абсолютный базовый путь под GitHub Pages
  const base = "https://kiril1l1l1l1l.github.io/citychain-nft/static/regions/";
  const bgMap = {
    "kiranomiya":     base + "FonKiranomiya.png",
    "noroburg":       base + "FonNorroburg.png",
    "russet-skyline": base + "FonRussetSkyline.png",
    "san-maris":      base + "FonSanMaris.png",
    "solmara":        base + "FonSolmara.png",
    "valparyn":       base + "FonValparin.png",
    "nordhaven":      base + "FonNordhavean.png",
    "nihon":          base + "FonNihon.png"
  };

  const url = bgMap[r.id] ? (bgMap[r.id] + "?v=" + Date.now()) : "";

  if (bgEl){
    bgEl.style.display = "block";
    bgEl.style.backgroundImage  = url ? "url('" + url + "')" : "none";
    bgEl.style.backgroundSize   = "cover";
    bgEl.style.backgroundPosition = "center";
  }

  list.innerHTML = "";
  (buildOffersStub(r) || []).forEach(function(o){
    list.appendChild(renderOffer(o));
  });

  overlay.classList.add("active");
  overlay.setAttribute("aria-hidden","false");
};
  var url = bgMap[r.id] ? (bgMap[r.id] + "?v=" + Date.now()) : "";

  // CSS-фон
  if(bgEl){
    bgEl.style.backgroundImage = url ? "url('" + url + "')" : "none";
  }
  // <img> fallback (на случай, если background не отрисуется)
  var img = document.getElementById("region-bg-img");
  if(!img){
    img = document.createElement("img");
    img.id = "region-bg-img";
    img.alt = "";
    img.className = "region-bg-img";
    bgEl && bgEl.appendChild(img);
  }
  img.src = url || "";
  img.style.display = url ? "block" : "none";

  // офферы (как были)
  list.innerHTML = "";
  (buildOffersStub(r) || []).forEach(function(o){ list.appendChild(renderOffer(o)); });

  overlay.classList.add("active");
  overlay.setAttribute("aria-hidden","false");
};

  var url = bgMap[r.id] ? (bgMap[r.id] + "?v=" + Date.now()) : "";
  if(bgEl){
    bgEl.style.display = "block";
    bgEl.style.backgroundImage = url ? "url('" + url + "')" : "none";
  }

  list.innerHTML = "";
  (buildOffersStub(r) || []).forEach(function(o){ list.appendChild(renderOffer(o)); });

  overlay.classList.add("active");
  overlay.setAttribute("aria-hidden","false");
});
    }
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden','false');
  }

  function closeRegion(){
    if(!overlay) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden','true');
    var bg = qs('.bg', overlay);
    if(bg) bg.style.backgroundImage = '';
  }

  var back = qs('#btn-back', overlay);
  if(back){ back.addEventListener('click', function(){ closeRegion(); }); }

  // 3 одинаковых оффера (заглушка)
  var REGION_FACTORS = {
    'kiranomiya':1.30, 'russet-skyline':1.25, 'noroburg':1.15, 'san-maris':1.10,
    'solmara':1.05, 'valparyn':1.00, 'nihon':1.00, 'nordhaven':0.95
  };
  function calcBase(regionId){
    var base = 100000;
    var mult = REGION_FACTORS[regionId] || 1.0;
    return Math.round(base * mult);
  }
  function formatPrice(n){ return '$ ' + n.toLocaleString('en-US'); }
  function buildOffersStub(region){
    var price = formatPrice(calcBase(region.id));
    var base = { regionId:region.id, type:'House', district:'A', area:120, priceText:price, status:'Available' };
    return [base, Object.assign({}, base), Object.assign({}, base)];
  }
  function renderOffer(o){
    var el = document.createElement('div');
    el.className = 'card';
    el.innerHTML =
      '<div>' +
        '<div class="title">'+o.type+'</div>' +
        '<div class="meta"><span>Класс: '+o.district+'</span><span>Площадь: '+o.area+' m²</span></div>' +
      '</div>' +
      '<div class="actions">' +
        '<div class="price">'+o.priceText+'</div>' +
        '<div class="status">'+o.status+'</div>' +
        '<button class="btn" disabled>Buy (скоро)</button>' +
      '</div>';
    return el;
  }

  // Старт с защитой
  try { renderMenu(); }
  catch(err){
    console.error('[CityChainNFT] renderMenu failed:', err);
  }

  // Экспорт (для отладки)
  window.CityChainNFT = { openRegion:openRegion, closeRegion:closeRegion, REGIONS:REGIONS };
})();







