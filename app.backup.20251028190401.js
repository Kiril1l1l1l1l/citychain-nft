(() => {
  const tg = window.Telegram?.WebApp; try{ tg?.expand(); }catch(e){}
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  /* MARK:ROUTER START */
  const screens = { shop: $("#screen-shop"), map: $("#screen-map"), profile: $("#screen-profile") };
  function show(tab){
    Object.entries(screens).forEach(([k,el])=> el && el.classList.toggle("hidden", k!==tab));
    $$(".tabbar button").forEach(b=> b.setAttribute("aria-selected", b.dataset.tab===tab ? "true":"false"));
    document.body.setAttribute("data-tab", tab);
  }
  $$(".tabbar button").forEach(b => b.addEventListener("click", ()=> show(b.dataset.tab)));
  show("map");
  /* MARK:ROUTER END */

  /* MARK:USERDATA START */
  const name = (tg?.initDataUnsafe?.user ? [tg.initDataUnsafe.user.first_name, tg.initDataUnsafe.user.last_name].filter(Boolean).join(" ") : "") || "Пользователь";
  const el = document.getElementById("userName"); if (el) el.textContent = name;
  /* MARK:USERDATA END */

  /* MARK:BALANCE START */
  const KEY="ccnft_balance";
  const g=()=>+((localStorage.getItem(KEY)||"0")); const s=v=>{localStorage.setItem(KEY,String(v)); r();};
  function r(){ const v=document.getElementById("balanceValue"); if(v) v.textContent=g().toFixed(2); }
  r();
  document.getElementById("btnAddFunds")?.addEventListener("click", ()=>{
    const x = prompt("Сумма:", "100"); if(x===null) return;
    const n = parseFloat(String(x).replace(",", ".")); if(isNaN(n)) return alert("Неверное число");
    s(Math.max(0, g()+n));
  });
  /* MARK:BALANCE END */
})();
(()=>{
  const $=s=>document.querySelector(s);

  // регионы (rect: x%, y%, w%, h% по центру)
  const REGIONS = [
  { id:"kiranomiya",     name:"Kiranomiya",     bg:"static/regions/kiranomiya.png",     rect:[50,23,20,16] },
  { id:"nihon",          name:"Nihon",          bg:"static/regions/nihon.png",          rect:[23,40,20,15] },
  { id:"noroburg",       name:"Noroburg",       bg:"static/regions/noroburg.png",       rect:[77,36,20,15] },
  { id:"russet-skyline", name:"Russet Skyline", bg:"static/regions/russet-skyline.png", rect:[50,55,25,17] },
  { id:"san-maris",      name:"San Maris",      bg:"static/regions/san-maris.png",      rect:[20,59,20,14] },
  { id:"solmara",        name:"Solmara",        bg:"static/regions/solmara.png",        rect:[80,59,20,14] },
  { id:"nordhaven",      name:"Nordhaven",      bg:"static/regions/nordhaven.png",      rect:[27,77,24,15] },
  { id:"valparyn",       name:"Valparyn",       bg:"static/regions/valparyn.png",       rect:[73,77,24,15] }
];

  // хот-слой поверх карты (только когда открыта вкладка Карта)
  const wrap=document.getElementById("map-wrap");
  if(wrap){
    const layer=document.createElement("div");
    layer.className="map-hotlayer"; wrap.style.position="relative"; wrap.appendChild(layer);
    REGIONS.forEach(r=>{
      const el=document.createElement("button");
      el.className="map-hotspot";
      el.style.left=(r.rect[0]-r.rect[2]/2)+"%";
      el.style.top=(r.rect[1]-r.rect[3]/2)+"%";
      el.style.width=r.rect[2]+"%";
      el.style.height=r.rect[3]+"%";
      el.title=r.name;
      el.addEventListener("click",()=>openRegion(r));
      layer.appendChild(el);
    });
  }

  function openRegion(r){
    $("#regionBg").style.backgroundImage=`url('${r.bg}')`;
    $("#regionTitle").textContent=r.name;
    const box=$("#offersList");
    box.innerHTML=[
      {title:"Квартира с видом",type:"apartment",area:56,price:120000},
      {title:"Дом у набережной",type:"house",area:120,price:350000},
      {title:"Студия",type:"apartment",area:34,price:80000}
    ].map(o=>`
      <div class="offer-card">
        <div class="offer-thumb"></div>
        <div><div class="offer-title">${o.title}</div><div class="offer-meta">${o.type}, ${o.area} м²</div></div>
        <div><b>${o.price.toLocaleString()}</b></div>
      </div>`).join("");
    // показать экран региона поверх
    document.getElementById("screen-region")?.classList.remove("hidden");
    document.body.setAttribute("data-tab","region");
  }
  document.getElementById("btnRegionBack")?.addEventListener("click",()=>{
    document.getElementById("screen-region")?.classList.add("hidden");
    document.body.setAttribute("data-tab","map");
  });
})();
;(()=>{

  const $ = s => document.querySelector(s);

  // один остров = одна кликабельная область
  // rect: [centerX%, centerY%, width%, height%]
  const REGIONS = [
  { id:"kiranomiya",     name:"Kiranomiya",     bg:"static/regions/kiranomiya.png",     rect:[50,23,20,16] },
  { id:"nihon",          name:"Nihon",          bg:"static/regions/nihon.png",          rect:[23,40,20,15] },
  { id:"noroburg",       name:"Noroburg",       bg:"static/regions/noroburg.png",       rect:[77,36,20,15] },
  { id:"russet-skyline", name:"Russet Skyline", bg:"static/regions/russet-skyline.png", rect:[50,55,25,17] },
  { id:"san-maris",      name:"San Maris",      bg:"static/regions/san-maris.png",      rect:[20,59,20,14] },
  { id:"solmara",        name:"Solmara",        bg:"static/regions/solmara.png",        rect:[80,59,20,14] },
  { id:"nordhaven",      name:"Nordhaven",      bg:"static/regions/nordhaven.png",      rect:[27,77,24,15] },
  { id:"valparyn",       name:"Valparyn",       bg:"static/regions/valparyn.png",       rect:[73,77,24,15] }
];

  // Слой хот-спотов только если есть карта
  const wrap = document.getElementById("map-wrap");
  if (wrap && !wrap.querySelector(".map-hotlayer")) {
    const layer = document.createElement("div");
    layer.className = "map-hotlayer";
    wrap.style.position = "relative";
    wrap.appendChild(layer);

    REGIONS.forEach(r=>{
      const b = document.createElement("button");
      b.className = "map-hotspot";
      const [cx,cy,w,h] = r.rect;
      b.style.left   = (cx - w/2) + "%";
      b.style.top    = (cy - h/2) + "%";
      b.style.width  = w + "%";
      b.style.height = h + "%";
      b.title = r.name;
      b.addEventListener("click", ()=> openRegionModal(r));
      layer.appendChild(b);
    });
  }

  // Модалка региона
  const modal  = $("#regionModal");
  const hero   = $("#regionHero");
  const title  = $("#regionTitle");

  function openRegionModal(region){
    try{
      hero.style.backgroundImage = `url('${region.bg}')`;
      title.textContent = region.name;
      modal?.classList.add("open");
      modal?.setAttribute("aria-hidden","false");
    }catch(e){ console.error(e); }
  }
  function closeRegionModal(){
    modal?.classList.remove("open");
    modal?.setAttribute("aria-hidden","true");
  }
  $("#regionBackdrop")?.addEventListener("click", closeRegionModal);
  $("#regionClose")?.addEventListener("click", closeRegionModal);

  // При переключении нижних табов модалка просто закрывается (ничего не ломаем)
  document.addEventListener("click", (ev)=>{
    const el = ev.target && ev.target.closest("button,a,div,span");
    if(!el) return;
    const txt = (el.innerText || el.textContent || "").trim().toLowerCase();
    if(txt === "карта" || txt === "магазин" || txt === "профиль") closeRegionModal();
  }, true);

})();
/* === CC PATCH START === */
(function(){
  const $ = s => document.querySelector(s);

  // 2.1 Регионы с фонами из static/regions/*.png
  // Если в коде есть старый REGIONS — не мешает; здесь берём приоритет
  window.CC_REGIONS = [
    { id:"kiranomiya",     name:"Kiranomiya",     bg:"static/regions/kiranomiya.png",     rect:[50,23,20,18] },
    { id:"nihon",          name:"Nihon",          bg:"static/regions/nihon.png",          rect:[23,40,22,18] },
    { id:"noroburg",       name:"Noroburg",       bg:"static/regions/noroburg.png",       rect:[77,38,22,18] },
    { id:"russet-skyline", name:"Russet Skyline", bg:"static/regions/russet-skyline.png", rect:[50,55,26,20] },
    { id:"san-maris",      name:"San Maris",      bg:"static/regions/san-maris.png",      rect:[18,58,20,16] },
    { id:"solmara",        name:"Solmara",        bg:"static/regions/solmara.png",        rect:[83,58,20,16] },
    { id:"nordhaven",      name:"Nordhaven",      bg:"static/regions/nordhaven.png",      rect:[26,76,26,18] },
    { id:"valparyn",       name:"Valparyn",       bg:"static/regions/valparyn.png",       rect:[73,76,26,18] }
  ];

  // 2.2 Универсальные ссылки на модалку и её фон (兼容 двух версий разметки)
  const modal = $('#screen-region') || $('#region-modal');
  const bgEl  = $('#regionBg') || $('#region-bg') || $('.region-bg');
  const hotLayer = document.querySelector('#map-wrap .map-hotlayer');

  function openRegionModal(r){
    try{
      if(bgEl){ bgEl.style.backgroundImage = "url('" + r.bg + "')"; }
      if(modal){ modal.classList.remove('hidden'); modal.classList.add('open'); }
      document.body.setAttribute('data-tab','map'); // остаёмся в "Карта"
    }catch(e){ console.error('openRegionModal', e); }
  }
  function closeRegionModal(){
    try{
      if(modal){ modal.classList.add('hidden'); modal.classList.remove('open'); }
    }catch(e){ console.error('closeRegionModal', e); }
  }
  // экспорт в window, чтобы старые обработчики могли вызывать
  window.openRegionModal = openRegionModal;
  window.closeRegionModal = closeRegionModal;

  // 2.3 Авто-закрытие модалки и хот-слоя при смене таба (любой роутер)
  function syncByTab(){
    const isMap = document.body.getAttribute('data-tab') === 'map';
    if(!isMap) closeRegionModal();
    const layer = document.querySelector('#map-wrap .map-hotlayer');
    if(layer) layer.style.display = isMap ? 'block' : 'none';
    const mapImg = document.getElementById('map');
    if(mapImg) mapImg.style.pointerEvents = isMap ? 'none' : 'none'; // карта клики не ловит
  }
  new MutationObserver(syncByTab).observe(document.body, {attributes:true, attributeFilter:['data-tab']});
  document.addEventListener('DOMContentLoaded', syncByTab);
  syncByTab();

  // 2.4 Если есть кнопка "Назад" в модалке — закрываем
  const backBtn = $('#btnRegionBack');
  if(backBtn) backBtn.addEventListener('click', closeRegionModal);

  // 2.5 Переназначим клики хот-спотов на наш openRegionModal (если слой уже смонтирован)
  try{
    (document.querySelectorAll('#map-wrap .map-hotspot') || []).forEach((b, i)=>{
      b.onclick = (ev)=>{
        ev.preventDefault();
        const list = window.CC_REGIONS || [];
        const r = list[i] || list.find(x=>x); // по индексу
        if(r) openRegionModal(r);
      };
    });
  }catch(e){ console.error('bind hotspots', e); }
})();
 /* === CC PATCH END === */
/* === CC PATCH (tabs + hotspots + region bg) === */
(function(){
  const $ = s=>document.querySelector(s);

  // 1) Регионы: ставим якоря "чуть ниже названия" (центр X/Y, ширина/высота в %)
  const REG_CENTERS = [
    { id:"kiranomiya",     name:"Kiranomiya",     bg:"static/regions/kiranomiya.png",     rect:[50,19,18,10] },
    { id:"nihon",          name:"Nihon",          bg:"static/regions/nihon.png",          rect:[23,31,18,10] },
    { id:"noroburg",       name:"Noroburg",       bg:"static/regions/noroburg.png",       rect:[78,31,18,10] },
    { id:"russet-skyline", name:"Russet Skyline", bg:"static/regions/russet-skyline.png", rect:[50,46,22,12] },
    { id:"san-maris",      name:"San Maris",      bg:"static/regions/san-maris.png",      rect:[18,52,18,10] },
    { id:"solmara",        name:"Solmara",        bg:"static/regions/solmara.png",        rect:[83,52,18,10] },
    { id:"nordhaven",      name:"Nordhaven",      bg:"static/regions/nordhaven.png",      rect:[26,69,24,12] },
    { id:"valparyn",       name:"Valparyn",       bg:"static/regions/valparyn.png",       rect:[73,69,24,12] }
  ];
  // отдаём приоритет этим координатам
  window.CC_REGIONS = REG_CENTERS;

  // 2) Модалка региона и фон (совместимо с разной версткой)
  const modal = $('#screen-region') || $('#region-modal');
  const bgEl  = $('#regionBg') || $('#region-bg') || $('.region-bg');

  function openRegionModal(r){
    if(bgEl) bgEl.style.backgroundImage = "url('"+r.bg+"')";
    if(modal){ modal.classList.remove('hidden'); modal.classList.add('open'); }
    document.body.setAttribute('data-tab','map'); // остаёмся в "Карта"
  }
  function closeRegionModal(){
    if(modal){ modal.classList.add('hidden'); modal.classList.remove('open'); }
  }
  window.openRegionModal = openRegionModal;
  window.closeRegionModal = closeRegionModal;

  // 3) Хот-слой — кнопки невидимые, без tooltip’ов
  function mountHotspots(){
    const wrap = document.getElementById('map-wrap');
    if(!wrap) return;
    wrap.querySelector('.map-hotlayer')?.remove();
    const layer = document.createElement('div');
    layer.className = 'map-hotlayer';
    wrap.appendChild(layer);

    const list = window.CC_REGIONS || [];
    list.forEach((r, i)=>{
      const b = document.createElement('button');
      b.className = 'map-hotspot';
      // без браузерного tooltip’а:
      b.removeAttribute('title');
      b.setAttribute('aria-label', r.name);

      const [cx,cy,w,h] = r.rect;
      b.style.left   = (cx - w/2) + '%';
      b.style.top    = (cy - h/2) + '%';
      b.style.width  = w + '%';
      b.style.height = h + '%';

      b.addEventListener('click', (ev)=>{ ev.preventDefault(); openRegionModal(r); });
      layer.appendChild(b);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', mountHotspots);
  else mountHotspots();

  // 4) Смена вкладок: всегда закрываем модалку; хот-слой виден только на "Карта"
  function syncByTab(){
    const isMap = document.body.getAttribute('data-tab') === 'map';
    if(!isMap) closeRegionModal();
    const layer = document.querySelector('#map-wrap .map-hotlayer');
    if(layer) layer.style.display = isMap ? 'block':'none';
  }
  new MutationObserver(syncByTab).observe(document.body,{attributes:true,attributeFilter:['data-tab']});
  document.addEventListener('DOMContentLoaded', syncByTab);
  syncByTab();

  // 5) Перехват кликов по таббару: закрыть модалку и переключить таб
  function setTab(tab){
    document.body.setAttribute('data-tab', tab);
  }
  document.addEventListener('click', (e)=>{
    const t = e.target.closest('button, a, div, span');
    if(!t) return;

    // универсальные селекторы/эвристики под твой нижний таббар
    const text = (t.textContent||'').trim().toLowerCase();
    if(text === 'магазин'){ closeRegionModal(); setTab('shop'); }
    if(text === 'карта'){   closeRegionModal(); setTab('map');  }
    if(text === 'профиль'){ closeRegionModal(); setTab('profile'); }
  });

  // 6) Кнопка "Назад" в модалке
  const back = document.getElementById('btnRegionBack');
  if(back) back.addEventListener('click', closeRegionModal);
})();


// CC-HOTSPOTS-BEGIN
(function(){
  const $ = s => document.querySelector(s);

  // (пере)монтаж хот-зон
  function mountHotspots(){
    const wrap = document.getElementById("map-wrap");
    if(!wrap) return;
    wrap.querySelector(".map-hotlayer")?.remove();
    const layer = document.createElement("div");
    layer.className = "map-hotlayer";
    wrap.appendChild(layer);

    (typeof REGIONS!=="undefined" ? REGIONS : []).forEach(r=>{
      const b = document.createElement("button");
      b.className = "map-hotspot";
      const [cx,cy,w,h] = r.rect;
      b.style.left   = (cx - w/2) + "%";
      b.style.top    = (cy - h/2) + "%";
      b.style.width  = w + "%";
      b.style.height = h + "%";
      // без title, чтобы не было белого tooltip
      b.addEventListener("click", ()=> openRegionModal(r));
      layer.appendChild(b);
    });
  }

  // открытие экрана региона
  window.openRegionModal = function(r){
    const scr = $("#screen-region");
    if(!scr) return;
    $("#regionTitle").textContent = r.name;
    const bg = $("#regionBg");
    if(bg){
      const v = Date.now();
      bg.style.backgroundImage = "url('" + r.bg + "?v=" + v + "')";
    }
    scr.classList.remove("hidden");
    // остаёмся в табе "Карта", но перекрываем её этим экраном
    document.body.setAttribute("data-tab","map");
  };

  // закрыть по «Назад»
  document.getElementById("btnRegionBack")?.addEventListener("click", ()=>{
    document.getElementById("screen-region")?.classList.add("hidden");
  });

  // Авто-закрытие меню региона при смене вкладки
  const scr = document.getElementById("screen-region");
  const mo  = new MutationObserver(()=>{
    if (document.body.getAttribute("data-tab") !== "map") {
      scr?.classList.add("hidden");
    }
  });
  mo.observe(document.body,{attributes:true,attributeFilter:["data-tab"]});

  // первый монтаж
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountHotspots);
  } else {
    mountHotspots();
  }
})();
// CC-HOTSPOTS-END


(function(){
  const $ = s => document.querySelector(s);

  function mountHotspots(){
    const wrap = document.getElementById("map-wrap");
    if(!wrap) return;
    wrap.querySelector(".map-hotlayer")?.remove();
    const layer = document.createElement("div");
    layer.className = "map-hotlayer";
    wrap.appendChild(layer);
    (typeof REGIONS!=="undefined"?REGIONS:[]).forEach(r=>{
      const b=document.createElement("button");
      b.className="map-hotspot";
      const [cx,cy,w,h]=r.rect;
      b.style.left=(cx-w/2)+"%";
      b.style.top=(cy-h/2)+"%";
      b.style.width=w+"%";
      b.style.height=h+"%";
      b.addEventListener("click",()=>openRegionModal(r));
      layer.appendChild(b);
    });
  }

  window.openRegionModal=function(r){
    const scr=$("#screen-region");
    if(!scr)return;
    $("#regionTitle").textContent=r.name;
    const bg=$("#regionBg");
    if(bg)bg.style.backgroundImage="url('"+r.bg+"?v="+Date.now()+"')";
    scr.classList.remove("hidden");
    document.body.setAttribute("data-tab","map");
  };

  document.getElementById("btnRegionBack")?.addEventListener("click",()=>{
    document.getElementById("screen-region")?.classList.add("hidden");
  });

  new MutationObserver(()=>{
    if(document.body.getAttribute("data-tab")!=="map")
      document.getElementById("screen-region")?.classList.add("hidden");
  }).observe(document.body,{attributes:true,attributeFilter:["data-tab"]});

  if(document.readyState==="loading")
    document.addEventListener("DOMContentLoaded",mountHotspots);
  else mountHotspots();
})();
(function(){
  function closeRegion(){ document.getElementById("screen-region")?.classList.add("hidden"); }

  // если в разметке есть кнопки таббара, привяжемся к ним
  const tabMap     = document.querySelector('[data-tab="map"], #tab-map');
  const tabProfile = document.querySelector('[data-tab="profile"], #tab-profile');
  const tabShop    = document.querySelector('[data-tab="shop"], #tab-shop, [data-tab="store"]');

  [tabMap,tabProfile,tabShop].forEach(btn=>{
    btn && btn.addEventListener('click',()=>{
      closeRegion();
      // принудительно выставим нужную вкладку
      const t = btn.getAttribute('data-tab') || btn.id?.replace('tab-','');
      if(t) document.body.setAttribute('data-tab', t==='store'?'shop':t);
    });
  });

  // подстраховка: любое внешнее изменение вкладки — тоже закрываем
  new MutationObserver(()=>{
    if(document.body.getAttribute('data-tab')!=="map"){
      closeRegion();
    }
  }).observe(document.body,{attributes:true,attributeFilter:["data-tab"]});
})();
(function(){
  // закрывать экран региона при любой смене вкладки
  function closeRegion(){
    document.getElementById("screen-region")?.classList.add("hidden");
  }
  const hook = btn=>{
    if(!btn) return;
    btn.addEventListener("click", ()=>{
      closeRegion();
      const t = btn.getAttribute("data-tab") || btn.id?.replace("tab-","");
      if(t) document.body.setAttribute("data-tab", t);
    });
  };
  hook(document.querySelector('[data-tab="map"], #tab-map'));
  hook(document.querySelector('[data-tab="profile"], #tab-profile'));
  hook(document.querySelector('[data-tab="shop"], #tab-shop, [data-tab="store"]'));
  new MutationObserver(()=>{ if(document.body.getAttribute("data-tab")!=="map") closeRegion(); })
    .observe(document.body,{attributes:true,attributeFilter:["data-tab"]});
})();
(function(){
  // закрывать экран региона при любой смене вкладки
  function closeRegion(){
    document.getElementById("screen-region")?.classList.add("hidden");
  }
  const hook = btn=>{
    if(!btn) return;
    btn.addEventListener("click", ()=>{
      closeRegion();
      const t = btn.getAttribute("data-tab") || btn.id?.replace("tab-","");
      if(t) document.body.setAttribute("data-tab", t);
    });
  };
  hook(document.querySelector('[data-tab="map"], #tab-map'));
  hook(document.querySelector('[data-tab="profile"], #tab-profile'));
  hook(document.querySelector('[data-tab="shop"], #tab-shop, [data-tab="store"]'));
  new MutationObserver(()=>{ if(document.body.getAttribute("data-tab")!=="map") closeRegion(); })
    .observe(document.body,{attributes:true,attributeFilter:["data-tab"]});
})();
(function(){
  function closeRegion(){ document.getElementById("screen-region")?.classList.add("hidden"); }

  // если в разметке есть кнопки таббара, привяжемся к ним
  const tabMap     = document.querySelector('[data-tab="map"], #tab-map');
  const tabProfile = document.querySelector('[data-tab="profile"], #tab-profile');
  const tabShop    = document.querySelector('[data-tab="shop"], #tab-shop, [data-tab="store"]');

  [tabMap,tabProfile,tabShop].forEach(btn=>{
    btn && btn.addEventListener('click',()=>{
      closeRegion();
      // принудительно выставим нужную вкладку
      const t = btn.getAttribute('data-tab') || btn.id?.replace('tab-','');
      if(t) document.body.setAttribute('data-tab', t==='store'?'shop':t);
    });
  });

  // подстраховка: любое внешнее изменение вкладки — тоже закрываем
  new MutationObserver(()=>{
    if(document.body.getAttribute('data-tab')!=="map"){
      closeRegion();
    }
  }).observe(document.body,{attributes:true,attributeFilter:["data-tab"]});
})();
