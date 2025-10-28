/* --- CityChainNFT patch: REGIONS, hotspots, overlay/nav behavior --- */

(function(){
  const REGIONS = [
    { id:"kiranomiya",     name:"Kiranomiya",     x:67.6, y:62.2 },
    { id:"noroburg",       name:"Noroburg",       x:41.8, y:39.9 },   // поправлено
    { id:"russet-skyline", name:"Russet Skyline", x:57.9, y:28.6 },   // поправлено
    { id:"san-maris",      name:"San Maris",      x:21.3, y:66.4 },
    { id:"solmara",        name:"Solmara",        x:74.5, y:78.8 },
    { id:"valparyn",       name:"Valparyn",       x:33.7, y:71.2 },
    { id:"nordhaven",      name:"Nordhaven",      x:15.8, y:28.9 },
    { id:"nihon",          name:"Nihon",          x:82.4, y:34.2 }    // поправлено
  ];

  const q = sel => document.querySelector(sel);
  const qa = sel => Array.from(document.querySelectorAll(sel));

  const mapWrap = q("#map-wrap");
  const mapImg  = q("#map-image");
  const overlay = ensureOverlay();
  const tabs = {
    shop: q('[data-tab-target="shop"]') || q("#tab-shop"),
    map: q('[data-tab-target="map"]') || q("#tab-map"),
    profile: q('[data-tab-target="profile"]') || q("#tab-profile")
  };

  // Кэш-бастинг картинок (map + region backgrounds)
  if (mapImg && !mapImg.src.includes("?v=")){
    mapImg.src = (mapImg.getAttribute("src") || "static/map.png") + "?v=20251028190401";
  }

  // Рендер невидимых хот-спотов
  if(mapWrap && !mapWrap.dataset.hotspotsReady){
    REGIONS.forEach(r=>{
      const b = document.createElement("button");
      b.className = "hotspot";
      b.style.left = r.x + "%";
      b.style.top  = r.y + "%";
      b.setAttribute("aria-label", r.name); // без title => без браузерных тултипов
      b.addEventListener("click", ()=> openRegion(r));
      mapWrap.appendChild(b);
    });
    mapWrap.dataset.hotspotsReady = "1";
  }

  // Навигация: при переходе на другие вкладки — закрываем регион-оверлей.
  qa("[data-tab], .bottom-tab button, .nav-tab").forEach(el=>{
    el.addEventListener("click", (ev)=>{
      const to = el.getAttribute("data-tab") || el.dataset.tabTarget || el.id?.replace("tab-btn-","");
      if(to){ showTab(to); }
    });
  });

  function showTab(name){
    closeRegion();
    qa(".tab").forEach(t=>t.classList.remove("active"));
    const target = q(`#tab-${name}`) || q(`[data-tab-pane="${name}"]`);
    if(target) target.classList.add("active");
    // Возврат на "Карта" => видна только карта и хот-споты
    if(name==="map"){
      // ничего не показываем кроме карты; overlay уже закрыт
    }
  }

  function ensureOverlay(){
    let el = q("#region-overlay");
    if(el) return el;
    el = document.createElement("div");
    el.id = "region-overlay";
    el.className = "region-overlay";
    el.innerHTML = `
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
          <!-- заглушки предложений -->
          <div class="card">Скоро предложения этого региона…</div>
        </div>
      </div>`;
    document.body.appendChild(el);
    el.querySelector("#btn-back").addEventListener("click", closeRegion);
    return el;
  }

  function openRegion(r){
    const title = overlay.querySelector("#region-title");
    const bg = overlay.querySelector(".bg");
    if(title) title.textContent = r.name;
    if(bg) bg.style.backgroundImage = `url("static/regions/${r.id}.png?v=20251028190401")`;
    overlay.classList.add("active");
  }

  function closeRegion(){
    overlay.classList.remove("active");
  }

  // Экспорт для отладки (не обязательно)
  window.CityChainNFT = { REGIONS, openRegion, closeRegion, showTab };

})();
