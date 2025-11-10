console.warn("[CCNFT] app.js loaded:", new Date().toISOString());

(function(){
  const qs  = (s, r=document)=>r.querySelector(s);
  const qsa = (s, r=document)=>Array.from(r.querySelectorAll(s));

  // ===== стили для фона на overlay =====
  (function injectStyles(){
    if(document.getElementById("ccnft-bg-styles")) return;
    const s = document.createElement("style"); s.id="ccnft-bg-styles";
    s.textContent = [
      "#region-overlay{background:#000;min-height:100vh;}",
      "#region-overlay.ccnft-has-bg{",
      "  background-position:center!important;",
      "  background-repeat:no-repeat!important;",
      "  background-size:cover!important;",
      "}"
    ].join("");
    document.head.appendChild(s);
  })();

  // ===== регионы — имена РОВНО как в static/regions =====
  
  { id:'kiranomiya',     name:'Kiranomiya',     bg:'FonKiranomiya.png' },
  { id:'noroburg',       name:'Noroburg',       bg:'FonNorroburg.png' },
  { id:'russet-skyline', name:'Russet Skyline', bg:'FonRussetSkyline.png' },
  { id:'san-maris',      name:'San Maris',      bg:'FonSanMaris.png' },
  { id:'solmara',        name:'Solmara',        bg:'FonSolmara.png' },
  { id:'valparyn',       name:'Valparyn',       bg:'FonValparin.png' },
  { id:'nordhaven',      name:'Nordhaven',      bg:'FonNordhavean.png' },
  { id:'nihon',          name:'Nihon',          bg:'FonNihon.png' }

  window.REGIONS = REGIONS;

  // Абсолютная база (GH Pages)
  const BASE = "https://kiril1l1l1l1l.github.io/citychain-nft/static/regions/";

  // ===== меню =====
  function renderMenu(){
    const grid = qs("#regions-grid") || qs(".regions-grid");
    if(!grid) return;
    grid.innerHTML = "";
    REGIONS.forEach(r=>{
      const btn = document.createElement("button");
      btn.className = "region-btn";
      btn.setAttribute("data-region", r.id);
      btn.innerHTML = `<div class="name">${r.name}</div><small>Open</small>`;
      btn.addEventListener("click", ()=>openRegion(r));
      grid.appendChild(btn);
    });
  }

  // ===== офферы-заглушки =====
  const REGION_FACTORS = {
    "kiranomiya":1.30, "russet-skyline":1.25, "noroburg":1.15, "san-maris":1.10,
    "solmara":1.05, "valparyn":1.00, "nihon":1.00, "nordhaven":0.95
  };
  const fmt = n=>"$ " + n.toLocaleString("en-US");
  const basePrice = id=>Math.round(100000 * (REGION_FACTORS[id]||1));
  function buildOffersStub(region){
    const price = fmt(basePrice(region.id));
    const o = { type:"House", district:"A", area:120, priceText:price, status:"Available" };
    return [o, {...o}, {...o}];
  }
  function renderOffer(o){
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML =
      `<div>
         <div class="title">${o.type}</div>
         <div class="meta"><span>Класс: ${o.district}</span><span>Площадь: ${o.area} m²</span></div>
       </div>
       <div class="actions">
         <div class="price">${o.priceText}</div>
         <div class="status">${o.status}</div>
         <button class="btn" disabled>Buy (скоро)</button>
       </div>`;
    return el;
  }

  // ===== overlay =====
  function openRegion(r){
    const overlay = qs("#region-overlay");
    if(!overlay) return;

    const title = qs("#region-title, .region-title, h2", overlay);
    if(title) title.textContent = r.name;

    const url = BASE + r.bg + "?v=" + Date.now();
    overlay.style.background = `center / cover no-repeat url('${url}')`;
    overlay.classList.add("ccnft-has-bg","active");
    overlay.setAttribute("aria-hidden","false");
    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");
    console.log("[BG TRY overlay]", r.id, "->", url);

    const list = qs("#region-list, .region-list, .cards", overlay);
    if(list){
      list.innerHTML = "";
      buildOffersStub(r).forEach(o=>list.appendChild(renderOffer(o)));
    }
  }
  function closeRegion(){
    const overlay = qs("#region-overlay");
    if(!overlay) return;
    overlay.classList.remove("active","ccnft-has-bg");
    overlay.setAttribute("aria-hidden","true");
    overlay.style.background = "";
    document.documentElement.classList.remove("no-scroll");
    document.body.classList.remove("no-scroll");
  }
  window.openRegion = openRegion;
  window.closeRegion = closeRegion;

  // ===== tabs -> close overlay =====
  ["shop","map","profile"].forEach(name=>{
    const el = qs("#tab-btn-" + name);
    if(el){
      el.addEventListener("click", (e)=>{
        e.preventDefault();
        closeRegion();
        qsa(".tab").forEach(t=>t.classList.remove("active"));
        const pane = qs("#tab-" + name) || qs(`[data-tab-pane="${name}"]`);
        if(pane) pane.classList.add("active");
      });
    }
  });

  // ===== preload probe =====
  (function(){
    REGIONS.forEach(r=>{
      const img = new Image();
      const u = BASE + r.bg + "?v=" + Date.now();
      img.onload  = function(){ console.log("[BG OK]", r.id, u, this.naturalWidth+"x"+this.naturalHeight); };
      img.onerror = function(){ console.warn("[BG FAIL]", r.id, u); };
      img.src = u;
    });
  })();

  try{ renderMenu(); }catch(e){ console.error("renderMenu failed", e); }
})();

const ASSET_VERSION = new URLSearchParams(location.search).get('v') || String(Date.now());

function regionBgUrl(bgFile) {
  return `static/regions/${bgFile}?v=${ASSET_VERSION}`;
}

function loadRegionBg(region) {
  const overlay = document.querySelector('.region-overlay');
  if (!overlay) return;
  const bgEl = overlay.querySelector('.bg');
  if (!bgEl) return;

  const url = regionBgUrl(region.bg);
  const testImg = new Image();
  testImg.onload = () => {
    bgEl.style.backgroundImage = `url("${url}")`;
    console.log('[BG OK]', region.id, url);
  };
  testImg.onerror = () => {
    console.warn('[BG FAIL]', region.id, url);
    bgEl.style.background = 'linear-gradient(180deg,#0b0b0b,#1a1a1a)';
  };
  testImg.src = url;
}

function openRegionOverlay(regionId){
  const region = REGIONS.find(r => r.id === regionId);
  // ... существующий код ...
  loadRegionBg(region); // вызов подгрузки фона
}
if (!window.ASSET_VERSION) {
  window.ASSET_VERSION = new URLSearchParams(location.search).get("v") || String(Date.now());
}
function regionBgUrl(bgFile) {
  return `static/regions/${bgFile}?v=${window.ASSET_VERSION}`;
}
function loadRegionBg(region) {
  const overlay = document.querySelector(".region-overlay");
  if (!overlay) return;
  const bgEl = overlay.querySelector(".bg");
  if (!bgEl) return;

  const url = regionBgUrl(region.bg);
  const testImg = new Image();
  testImg.onload = () => {
    bgEl.style.backgroundImage = `url("${url}")`;
    console.log("[BG OK]", region.id, url);
  };
  testImg.onerror = () => {
    console.warn("[BG FAIL]", region.id, url);
    bgEl.style.background = "linear-gradient(180deg,#0b0b0b,#1a1a1a)";
  };
  testImg.src = url;
}

// Вставь вызов loadRegionBg(region) в свою функцию открытия оверлея, если ещё не вставлен.
// === hard patch: ensure overlay background always loads ===
(function(){
  // 1) REGIONS fallback (если где-то не задан)
  if (!window.REGIONS) {
    window.REGIONS = [
      { id:"kiranomiya",     name:"Kiranomiya",     bg:"FonKiranomiya.png" },
      { id:"noroburg",       name:"Noroburg",       bg:"FonNorroburg.png" },
      { id:"russet-skyline", name:"Russet Skyline", bg:"FonRussetSkyline.png" },
      { id:"san-maris",      name:"San Maris",      bg:"FonSanMaris.png" },
      { id:"solmara",        name:"Solmara",        bg:"FonSolmara.png" },
      { id:"valparyn",       name:"Valparyn",       bg:"FonValparin.png" },
      { id:"nordhaven",      name:"Nordhaven",      bg:"FonNordhavean.png" },
      { id:"nihon",          name:"Nihon",          bg:"FonNihon.png" }
    ];
    console.warn("[REGIONS fallback injected]");
  }

  // 2) версия ассетов для ?v=
  if (!window.ASSET_VERSION) {
    window.ASSET_VERSION = new URLSearchParams(location.search).get("v") || String(Date.now());
  }
  function regionBgUrl(bgFile){ return `static/regions/${bgFile}?v=${window.ASSET_VERSION}`; }

  // 3) гарантируем, что .region-overlay и .bg есть
  function ensureOverlayBg(){
    const overlay = document.querySelector(".region-overlay");
    if (!overlay) { console.warn("[BG] no .region-overlay found yet"); return null; }
    let bg = overlay.querySelector(".bg");
    if (!bg) {
      bg = document.createElement("div");
      bg.className = "bg";
      overlay.prepend(bg);
      console.log("[BG] .bg element created");
    }
    return bg;
  }

  // 4) загрузчик (с логами)
  function loadRegionBg(region){
    const overlay = document.querySelector(".region-overlay");
    const bgEl = ensureOverlayBg();
    if (!overlay || !bgEl) return;

    const url = regionBgUrl(region.bg);
    const testImg = new Image();
    testImg.onload  = () => { bgEl.style.backgroundImage = `url("${url}")`; console.log("[BG OK]", region.id, url); };
    testImg.onerror = () => { console.warn("[BG FAIL]", region.id, url); bgEl.style.background = "linear-gradient(180deg,#0b0b0b,#1a1a1a)"; };
    testImg.src = url;
  }
  window.loadRegionBg = window.loadRegionBg || loadRegionBg;

  // 5) мягкий перехват openRegionOverlay, если он есть
  const orig = window.openRegionOverlay;
  window.openRegionOverlay = function(regionId){
    if (typeof orig === "function") { orig.apply(this, arguments); }
    const region = (window.REGIONS || []).find(r => r.id === regionId);
    if (region) { // подождём рендер оверлея и подставим фон
      setTimeout(() => { ensureOverlayBg(); loadRegionBg(region); }, 0);
    } else {
      console.warn("[BG] region not found by id:", regionId);
    }
  };

  // 6) страховка: если клики по тайлам без вызова openRegionOverlay
  document.addEventListener("click", (e)=>{
    const tile = e.target.closest("[data-region-id]");
    if (!tile) return;
    const rid = tile.getAttribute("data-region-id");
    const region = (window.REGIONS || []).find(r => r.id === rid);
    if (region) setTimeout(()=>{ ensureOverlayBg(); loadRegionBg(region); }, 0);
  }, true);
})();
window.__forceOneBg = true;
if (window.__forceOneBg) {
  const ONE = "FonRussetSkyline.png";
  (window.REGIONS||[]).forEach(r => r.bg = ONE);
  console.warn("[BG] forced single background for all regions:", ONE);
}
