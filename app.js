/* ===== CityChainNFT — Regions Menu with per-region backgrounds ===== */
(function(){
  const TS = Date.now();

  // Вкладки
  bindTab('tab-btn-shop','shop');
  bindTab('tab-btn-map','map');
  bindTab('tab-btn-profile','profile');

  function bindTab(id, name){
    const el = document.getElementById(id);
    if(!el) return;
    el.addEventListener('click', (e)=>{
      e.preventDefault();
      closeRegion();
      document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
      (document.getElementById('tab-'+name) || document.querySelector('[data-tab-pane=\"'+name+'\"]'))?.classList.add('active');
    });
  }

  // Регион → файл фона (использую ТВОИ имена файлов из static/regions/)
  const REGIONS = [
    { id:'kiranomiya',     name:'Kiranomiya',     bg:'FonKiranomiya.png' },
    { id:'noroburg',       name:'Noroburg',       bg:'FonNorroburg.png' },
    { id:'russet-skyline', name:'Russet Skyline', bg:'FonRussetSkyline.png' },
    { id:'san-maris',      name:'San Maris',      bg:'FonSanMaris.png' },
    { id:'solmara',        name:'Solmara',        bg:'FonSolmara.png' },
    { id:'valparyn',       name:'Valparyn',       bg:'FonValparin.png' },
    { id:'nordhaven',      name:'Nordhaven',      bg:'FonNordhavean.png' },
    { id:'nihon',          name:'Nihon',          bg:'FonNihon.png' }
  ];
  // NB: «Norroburg», «Nordhavean», «Valparin» — намеренно оставлены как на твоём скрине, чтобы точно совпали файлы.

  // Рисуем меню
  const grid = document.getElementById('regions-grid');
  if(grid){
    grid.innerHTML = '';
    REGIONS.forEach(r=>{
      const btn = document.createElement('button');
      btn.className = 'region-btn';
      btn.innerHTML = <div class="region-name"></div><small>Открыть</small>;
      wireButton(btn, r);
      grid.appendChild(btn);
    });
  }

  // ===== Оверлей
  const overlay = document.getElementById('region-overlay');
  document.getElementById('btn-back')?.addEventListener('click', closeRegion);

  function openRegion(r){
    const title = overlay.querySelector('#region-title');
    const bg = overlay.querySelector('.bg');
    if(title) title.textContent = r.name;
    if(bg)    bg.style.backgroundImage = url("static/regions/?v=20251028_213505");
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden','false');
  }
  function closeRegion(){
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden','true');
    const bg = overlay.querySelector('.bg');
    if(bg) bg.style.backgroundImage = '';
  }
  window.CityChainNFT = { openRegion, closeRegion, REGIONS };

  // Устойчивые клики (tap/click/pointer) по кнопкам меню
  function wireButton(el, region){
    if(!el || el.__wired) return; el.__wired = true;
    const fire = ()=> openRegion(region);
    const stop = e=>{ try{ e.preventDefault(); e.stopImmediatePropagation(); e.stopPropagation(); }catch(_){ } };

    el.addEventListener('pointerdown', e=>{ stop(e); el.setPointerCapture?.(e.pointerId); }, true);
    el.addEventListener('pointerup',   e=>{ stop(e); fire(); }, true);
    el.addEventListener('click',       e=>{ stop(e); fire(); }, true);

    el.addEventListener('touchstart',  e=>{ stop(e); }, {capture:true, passive:false});
    el.addEventListener('touchend',    e=>{ stop(e); fire(); }, {capture:true, passive:false});
    el.addEventListener('mousedown',   e=>{ stop(e); }, true);
    el.addEventListener('mouseup',     e=>{ stop(e); fire(); }, true);
  }
})();
