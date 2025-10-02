const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.setHeaderColor("secondary_bg_color");
  // реакция на смену темы из Telegram
  tg.onEvent?.("themeChanged", () => applyTheme());
}
applyTheme();

function applyTheme(){
  // Telegram сам прокидывает CSS-переменные --tg-theme-*
  // Мы просто перерисовываем интерфейс, если надо (например, тени/иконки)
  document.documentElement.style.setProperty("--use-dark", "1");
}

/* ---------- Tabs ---------- */
const tabs = Array.from(document.querySelectorAll(".tab-btn"));
const screens = {
  store: document.getElementById("screen-store"),
  map: document.getElementById("screen-map"),
  profile: document.getElementById("screen-profile"),
};
tabs.forEach(b => b.addEventListener("click", () => switchTab(b.dataset.tab)));
function switchTab(name){
  tabs.forEach(b => b.classList.toggle("active", b.dataset.tab===name));
  Object.entries(screens).forEach(([k,el]) => el.classList.toggle("active", k===name));
  tg?.BackButton?.hide(); tg?.MainButton?.hide();
}
switchTab("map");

/* ---------- Balance demo ---------- */
const balanceEl = document.getElementById("balance");
document.addEventListener("click", (e)=>{
  if (e.target.matches("#profile-add1000")) {
    const cur = parseInt(balanceEl.textContent||"0",10);
    balanceEl.textContent = String(cur + 1000);
    tg?.HapticFeedback?.notificationOccurred("success");
  }
});

/* ---------- Map zoom/pan ---------- */
const mapWrap = document.querySelector(".map-wrap");
const mapImg  = document.getElementById("mapImg");
let scale = 1, minScale=1, maxScale=3;
let pos = {x:0,y:0}, start={x:0,y:0}, isPan=false;

function applyTransform(){ mapImg.style.transform = `translate(${pos.x}px,${pos.y}px) scale(${scale})`; }
mapWrap.addEventListener("wheel",(e)=>{
  e.preventDefault();
  const delta = e.deltaY < 0 ? .1 : -.1;
  const old = scale;
  scale = Math.min(maxScale, Math.max(minScale, +(scale + delta).toFixed(2)));
  if (scale!==old) applyTransform();
},{passive:false});

mapWrap.addEventListener("dblclick",()=>{ scale = Math.min(maxScale, +(scale+.5).toFixed(2)); applyTransform(); });

mapWrap.addEventListener("mousedown",(e)=>{ isPan=true; start={x:e.clientX-pos.x,y:e.clientY-pos.y}; });
window.addEventListener("mousemove",(e)=>{ if(!isPan)return; pos={x:e.clientX-start.x,y:e.clientY-start.y}; applyTransform(); });
window.addEventListener("mouseup",()=>{ isPan=false; });

mapWrap.addEventListener("touchstart",(e)=>{ if(e.touches.length===1){ isPan=true; const t=e.touches[0]; start={x:t.clientX-pos.x,y:t.clientY-pos.y}; }},{passive:true});
mapWrap.addEventListener("touchmove",(e)=>{ if(!isPan||e.touches.length!==1)return; const t=e.touches[0]; pos={x:t.clientX-start.x,y:t.clientY-start.y}; applyTransform(); },{passive:true});
mapWrap.addEventListener("touchend",()=>{ isPan=false; });

document.getElementById("zoomIn").addEventListener("click", ()=>{ scale=Math.min(maxScale, +(scale+.2).toFixed(2)); applyTransform(); });
document.getElementById("zoomOut").addEventListener("click",()=>{ scale=Math.max(minScale, +(scale-.2).toFixed(2)); applyTransform(); });

/* ---------- Menu (⋯) placeholder ---------- */
document.getElementById("moreBtn").addEventListener("click", ()=>{
  tg?.HapticFeedback?.impactOccurred("light");
});
