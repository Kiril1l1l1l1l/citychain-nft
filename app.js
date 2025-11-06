console.warn("[CCNFT] app.js loaded:", new Date().toISOString());

(function(){
  // ===== utils =====
  const qs  = (s, r=document)=>r.querySelector(s);
  const qsa = (s, r=document)=>Array.from(r.querySelectorAll(s));

  // ===== regions (имена РОВНО как в static/regions) =====
  const REGIONS = [
    { id:"kiranomiya",     name:"Kiranomiya",     bg:"FonKiranomiya.png" },
    { id:"noroburg",       name:"Noroburg",       bg:"FonNorroburg.png" },
    { id:"russet-skyline", name:"Russet Skyline", bg:"FonRussetSkyline.png" },
    { id:"san-maris",      name:"San Maris",      bg:"FonSanMaris.png" },
    { id:"solmara",        name:"Solmara",        bg:"FonSolmara.png" },
    { id:"valparyn",       name:"Valparyn",       bg:"FonValparin.png" },
    { id:"nordhaven",      name:"Nordhaven",      bg:"FonNordhavean.png" },
    { id:"nihon",          name:"Nihon",          bg:"FonNihon.png" }
  ];
  window.REGIONS = REGIONS;

  // ===== абсолютная база (GH Pages) — не ломает WebApp внутри t.me =====
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

    // title
    const title = qs("#region-title, .region-title, h2", overlay);
    if(title) title.textContent = r.name;

    // ensure bg layer
    let bg = overlay.querySelector(".bg");
    if(!bg){ bg = document.createElement("div"); bg.className = "bg"; overlay.prepend(bg); }

    // set background
    const url = BASE + r.bg + "?v=" + Date.now();
    bg.style.backgroundImage  = `url('${url}')`;
    bg.style.backgroundSize   = "cover";
    bg.style.backgroundPosition = "center";
    bg.style.backgroundRepeat = "no-repeat";
    console.log("[BG TRY]", r.id, "->", url);

    // offers list
    const list = qs("#region-list, .region-list, .cards", overlay);
    if(list){
      list.innerHTML = "";
      buildOffersStub(r).forEach(o=>list.appendChild(renderOffer(o)));
    }

    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden","false");
    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");
  }

  function closeRegion(){
    const overlay = qs("#region-overlay");
    if(!overlay) return;
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden","true");
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

  // start
  try{ renderMenu(); }catch(e){ console.error("renderMenu failed", e); }
})();
