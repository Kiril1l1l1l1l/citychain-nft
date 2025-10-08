const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); tg.setHeaderColor("secondary_bg_color"); tg.onEvent?.("themeChanged",()=>{}); }

/* ---------- Tabs ---------- */
const tabs = Array.from(document.querySelectorAll(".tab-btn"));
const screens = { store: q("#screen-store"), map: q("#screen-map"), profile: q("#screen-profile") };
tabs.forEach(b => b.addEventListener("click", () => switchTab(b.dataset.tab)));
function switchTab(name){ tabs.forEach(b=>b.classList.toggle("active",b.dataset.tab===name)); Object.entries(screens).forEach(([k,el])=>el.classList.toggle("active",k===name)); tg?.BackButton?.hide(); tg?.MainButton?.hide(); }
switchTab("map");

/* ---------- Balance demo ---------- */
const balanceEl = q("#balance");
document.addEventListener("click",(e)=>{ if(e.target.matches("#profile-add1000")){ const cur=parseInt(balanceEl.textContent||"0",10); balanceEl.textContent=String(cur+1000); tg?.HapticFeedback?.notificationOccurred("success"); }});

/* ---------- Map zoom/pan ---------- */
const mapWrap = q(".map-wrap");
const mapImg  = q("#mapImg");
let scale=1, minScale=1, maxScale=3;
let pos={x:0,y:0}, start={x:0,y:0}, isPan=false;

function applyTransform(){ mapImg.style.transform=`translate(${pos.x}px,${pos.y}px) scale(${scale})`; }
function resetTransform(){ scale=1; pos={x:0,y:0}; applyTransform(); }
resetTransform();

/* Вписывание не требует панорамирования по умолчанию, но оставим зум и перетаскивание для удобства */
mapWrap.addEventListener("wheel",(e)=>{ e.preventDefault(); const delta=e.deltaY<0?.1:-.1; const old=scale; scale=Math.min(maxScale,Math.max(minScale,+(scale+delta).toFixed(2))); if(scale!==old) applyTransform(); },{passive:false});
mapWrap.addEventListener("dblclick",()=>{ scale=Math.min(maxScale,+(scale+.5).toFixed(2)); applyTransform(); });

mapWrap.addEventListener("mousedown",(e)=>{ isPan=true; start={x:e.clientX-pos.x,y:e.clientY-pos.y}; });
window.addEventListener("mousemove",(e)=>{ if(!isPan) return; pos={x:e.clientX-start.x,y:e.clientY-start.y}; applyTransform(); });
window.addEventListener("mouseup",()=>{ isPan=false; });

mapWrap.addEventListener("touchstart",(e)=>{ if(e.touches.length===1){ isPan=true; const t=e.touches[0]; start={x:t.clientX-pos.x,y:t.clientY-pos.y}; }},{passive:true});
mapWrap.addEventListener("touchmove",(e)=>{ if(!isPan||e.touches.length!==1) return; const t=e.touches[0]; pos={x:t.clientX-start.x,y:t.clientY-start.y}; applyTransform(); },{passive:true});
mapWrap.addEventListener("touchend",()=>{ isPan=false; });

q("#zoomIn").addEventListener("click",()=>{ scale=Math.min(maxScale,+(scale+.2).toFixed(2)); applyTransform(); });
q("#zoomOut").addEventListener("click",()=>{ scale=Math.max(minScale,+(scale-.2).toFixed(2)); applyTransform(); });

/* helpers */
function q(s){ return document.querySelector(s); }

(function(){
  try{
    var isTG = !!(window.Telegram && Telegram.WebApp);
    if (isTG) {
      document.documentElement.classList.add("in-tg");
      Telegram.WebApp.ready();
      Telegram.WebApp.expand();
    }
  }catch(e){ console.warn("tg init warn", e); }
})();
