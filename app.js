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
  const REGIONS=[
    {id:"kiranomiya",     name:"Kiranomiya",     bg:"static/regions/FonKiranomiya.png",      rect:[18,18,20,16]},
    {id:"nihon",          name:"Nihon",          bg:"static/regions/FonNihon.png",           rect:[50,22,20,16]},
    {id:"russet-skyline", name:"Russet Skyline", bg:"static/regions/FonRussetSkyline.png",   rect:[70,43,22,18]},
    {id:"noroburg",       name:"Noroburg",       bg:"static/regions/FonNorroburg.png",       rect:[34,39,24,18]},
    {id:"aurorburg",      name:"Aurorburg",      bg:"static/regions/FonNorroburg.png",       rect:[12,53,22,16]},   // временно тот же фон
    {id:"novokovo",       name:"Novokovo",       bg:"static/regions/FonRussetSkyline.png",   rect:[34,58,24,18]},   // временно
    {id:"san-maris",      name:"San Maris",      bg:"static/regions/FonSanMaris.png",        rect:[66,60,22,16]},
    {id:"solmara",        name:"Solmara",        bg:"static/regions/FonSolmara.png",         rect:[84,53,20,16]},
    {id:"emerald-canopy", name:"Emerald Canopy", bg:"static/regions/FonValparyn.png",        rect:[16,73,24,18]},   // временно
    {id:"saharra-rise",   name:"SaharraRise",    bg:"static/regions/FonSolmara.png",         rect:[52,76,24,18]},   // временно
    {id:"volcanis-forge", name:"Volcanis Forge", bg:"static/regions/FonValparyn.png",        rect:[84,76,24,18]},   // временно
    {id:"nordhaven",      name:"Nordhaven",      bg:"static/regions/FonNordhavean.png",      rect:[24,88,26,18]},
    {id:"valparyn",       name:"Valparyn",       bg:"static/regions/FonValparyn.png",        rect:[76,88,26,18]}
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
    {id:"kiranomiya", name:"Kiranomiya",     bg:"static/regions/FonKiranomiya.png",    rect:[50,18,22,16]},
    {id:"nihon",      name:"Nihon",          bg:"static/regions/FonNihon.png",         rect:[26,33,24,18]},
    {id:"noroburg",   name:"Noroburg",       bg:"static/regions/FonNorroburg.png",     rect:[72,33,24,18]},
    {id:"russet",     name:"Russet Skyline", bg:"static/regions/FonRussetSkyline.png", rect:[50,55,26,19]},
    {id:"sanmaris",   name:"San Maris",      bg:"static/regions/FonSanMaris.png",      rect:[21,57,22,16]},
    {id:"solmara",    name:"Solmara",        bg:"static/regions/FonSolmara.png",       rect:[82,57,22,16]},
    {id:"nordhaven",  name:"Nordhaven",      bg:"static/regions/FonNordhavean.png",    rect:[28,76,26,18]}, // ↑ приподняли
    {id:"valparyn",   name:"Valparyn",       bg:"static/regions/FonValparin.png",      rect:[71,76,26,18]}  // ↑ приподняли
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
