/* ===== MENU DEBUG CORE (без карты) ===== */
(function(){
  const TS = Date.now();

  // регионы
  const REGIONS = [
    { id:'kiranomiya',     name:'Kiranomiya'     },
    { id:'noroburg',       name:'Noroburg'       },
    { id:'russet-skyline', name:'Russet Skyline' },
    { id:'san-maris',      name:'San Maris'      },
    { id:'solmara',        name:'Solmara'        },
    { id:'valparyn',       name:'Valparyn'       },
    { id:'nordhaven',      name:'Nordhaven'      },
    { id:'nihon',          name:'Nihon'          }
  ];

  const q = (s,r=document)=>r.querySelector(s);
  const qa = (s,r=document)=>Array.from(r.querySelectorAll(s));

  // генерим кнопки регионов
  const grid = q('#regions-grid');
  if(grid){
    grid.innerHTML = '';
    REGIONS.forEach((r,i)=>{
      const btn = document.createElement('button');
      btn.className = 'region-btn';
      btn.setAttribute('data-region', r.id);
      btn.innerHTML = r.name + '<small>Открыть</small>';
      bindRegionButton(btn, r);
      grid.appendChild(btn);
    });
  }

  // нижние табы (прямые слушатели)
  bindTab('tab-btn-shop','shop');
  bindTab('tab-btn-map','map');
  bindTab('tab-btn-profile','profile');

  // overlay
  const overlay = q('#region-overlay');
  overlay.querySelector('#btn-back')?.addEventListener('click', closeRegion);

  function bindTab(id, name){
    const el = document.getElementById(id);
    if(!el) return;
    el.addEventListener('click', (e)=>{
      e.preventDefault();
      closeRegion();
      qa('.tab').forEach(t=>t.classList.remove('active'));
      (q('#tab-'+name)||q([data-tab-pane=""]))?.classList.add('active');
    });
  }

  function bindRegionButton(el, region){
    const fire = ()=>{
      // наглядность: alert и реальный оверлей с фоном
      alert('OPEN REGION: ' + region.name);
      openRegion(region);
    };

    const stop = e=>{ try{ e.preventDefault(); e.stopImmediatePropagation(); e.stopPropagation(); }catch(_){ } };

    el.addEventListener('pointerdown', e=>{ stop(e); el.setPointerCapture?.(e.pointerId); }, true);
    el.addEventListener('pointerup',   e=>{ stop(e); fire(); }, true);
    el.addEventListener('click',       e=>{ stop(e); fire(); }, true);

    // фоллбэки
    el.addEventListener('touchstart',  e=>{ stop(e); }, {capture:true, passive:false});
    el.addEventListener('touchend',    e=>{ stop(e); fire(); }, {capture:true, passive:false});
    el.addEventListener('mousedown',   e=>{ stop(e); }, true);
    el.addEventListener('mouseup',     e=>{ stop(e); fire(); }, true);
  }

  function openRegion(r){
    const title = q('#region-title', overlay);
    const bg = q('.bg', overlay);
    if(title) title.textContent = r.name;
    if(bg) bg.style.backgroundImage = url("static/regions/.png?v=20251028_211629");
    overlay.classList.add('active');
  }

  function closeRegion(){
    overlay.classList.remove('active');
    const bg = q('.bg', overlay);
    if(bg) bg.style.backgroundImage = '';
  }

  // экспорт для отладки
  window.CityChainNFT = { openRegion, closeRegion };
})();
