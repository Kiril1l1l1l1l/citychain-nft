console.warn("[CCNFT] app.js loaded:", new Date().toISOString());

(function(){
  // ===== utils =====
  function qs(sel, root){ return (root||document).querySelector(sel); }
  function qsa(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }

  // ===== regions (имена РОВНО как в папке static/regions) =====
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

  // ===== base path auto (локалка / GH Pages) =====
  function bgBase(){
    var hasRepo = location.pathname.indexOf("/citychain-nft/") !== -1;
    return (hasRepo ? "/citychain-nft/" : "static/".slice(0,0)) + "static/regions/";
    // пояснение: локалка -> "static/regions/"; GH Pages -> "/citychain-nft/static/regions/"
  }

  // ===== render menu =====
  function renderMenu(){
    var grid = qs("#regions-grid") || qs(".regions-grid");
    if(!grid) return;
    grid.innerHTML = "";
    REGIONS.forEach(function(r){
      var btn = document.createElement("button");
      btn.className = "region-btn";
      btn.setAttribute("data-region", r.id);
      btn.innerHTML = '<div class="name">'+r.name+'</div><small>Open</small>';
      btn.addEventListener("click", function(){ openRegion(r); });
      grid.appendChild(btn);
    });
  }

  // ===== overlay =====
  function openRegion(r){
    var overlay = qs("#region-overlay");
    if(!overlay) return;

    var bg = overlay.querySelector(".bg");
    if(!bg){ bg = document.createElement("div"); bg.className = "bg"; overlay.prepend(bg); }

    var url = bgBase() + r.bg + "?v=" + Date.now();
    bg.style.backgroundImage = "url('" + url + "')";
    bg.style.backgroundSize = "cover";
    bg.style.backgroundPosition = "center";
    bg.style.backgroundRepeat = "no-repeat";

    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden","false");
    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");

    console.log("[BG TRY]", r.id, "->", url);
  }

  function closeRegion(){
    var overlay = qs("#region-overlay");
    if(!overlay) return;
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden","true");
    document.documentElement.classList.remove("no-scroll");
    document.body.classList.remove("no-scroll");
  }

  // ===== tabs (закрытие оверлея при переключении) =====
  ["shop","map","profile"].forEach(function(name){
    var el = qs("#tab-btn-" + name);
    if(el){
      el.addEventListener("click", function(e){
        e.preventDefault();
        closeRegion();
        qsa(".tab").forEach(function(t){ t.classList.remove("active"); });
        var pane = qs("#tab-" + name) || qs('[data-tab-pane="'+name+'"]');
        if(pane) pane.classList.add("active");
      });
    }
  });

  // ===== preload probe (лог в консоль) =====
  (function(){
    var base = bgBase();
    REGIONS.forEach(function(r){
      var img = new Image();
      img.onload  = function(){ console.log("[BG OK]", r.id, base + r.bg, this.naturalWidth+"x"+this.naturalHeight); };
      img.onerror = function(){ console.warn("[BG FAIL]", r.id, base + r.bg); };
      img.src = base + r.bg + "?v=" + Date.now();
    });
  })();

  // ===== start =====
  try { renderMenu(); } catch(e){ console.error("renderMenu failed", e); }

  // export for debug
  window.CityChainNFT = { openRegion: openRegion, closeRegion: closeRegion, REGIONS: REGIONS };
})();
