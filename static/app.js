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

/* Р’РїРёСЃС‹РІР°РЅРёРµ РЅРµ С‚СЂРµР±СѓРµС‚ РїР°РЅРѕСЂР°РјРёСЂРѕРІР°РЅРёСЏ РїРѕ СѓРјРѕР»С‡Р°РЅРёСЋ, РЅРѕ РѕСЃС‚Р°РІРёРј Р·СѓРј Рё РїРµСЂРµС‚Р°СЃРєРёРІР°РЅРёРµ РґР»СЏ СѓРґРѕР±СЃС‚РІР° */
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
document.addEventListener("DOMContentLoaded", function(){
  try{
    document.querySelectorAll("img").forEach(i => i.setAttribute("draggable","false"));
  }catch(e){}

  try{
    // РјСЏРіРєР°СЏ С‡РёСЃС‚РєР°: Р·Р°РјРµРЅРёРј СЏРІРЅС‹Рµ  РІ РєРѕСЂРѕС‚РєРёС… С‚РµРєСЃС‚РѕРІС‹С… СѓР·Р»Р°С…
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    let n; const re = / \s*/g;
    while(n = walker.nextNode()){
      if(n.nodeValue && re.test(n.nodeValue) && n.nodeValue.length <= 64){
        n.nodeValue = n.nodeValue.replace(re, "");
      }
    }
  }catch(e){ console.warn("cleanup  :", e); }
});
(function(){
  try{
    var isTG = !!(window.Telegram && Telegram.WebApp);
    if(isTG){
      document.documentElement.classList.add("in-tg");
      Telegram.WebApp.ready(); Telegram.WebApp.expand();
    }
  }catch(e){}
  // РЎРґРµР»Р°С‚СЊ РІСЃРµ РёР·РѕР±СЂР°Р¶РµРЅРёСЏ РЅРµРґСЂР°РіРіРёР±РµР»СЊРЅС‹РјРё
  document.addEventListener("DOMContentLoaded", function(){
    try{ document.querySelectorAll("img").forEach(i => i.setAttribute("draggable","false")); }catch(e){}
    // РЈРґР°Р»РёС‚СЊ РІРёР·СѓР°Р»СЊРЅС‹Рµ ``  `` РІ С‚РµРєСЃС‚РѕРІС‹С… СѓР·Р»Р°С… (РёРЅРѕРіРґР° РїСЂРѕСЃР°С‡РёРІР°СЋС‚СЃСЏ РёР· СЃР±РѕСЂРєРё)
    try{
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
      let n; const re = / \s*/g;
      while(n = w.nextNode()){
        if(n.nodeValue && re.test(n.nodeValue)){
          n.nodeValue = n.nodeValue.replace(re, "");
        }
      }
    }catch(e){}
  });
})();

document.addEventListener("DOMContentLoaded", function () {
  try {
    // РџРѕРґРїРёСЃС‹РІР°РµРј РЅРёР¶РЅРёРµ РєРЅРѕРїРєРё РІРєР»Р°РґРѕРє, РµСЃР»Рё РѕРЅРё РµСЃС‚СЊ
    const navButtons = document.querySelectorAll(".tg-tabbar button, nav.tg-tabbar button, .tabs-bar button");
    if (navButtons.length >= 3) {
      navButtons[0].textContent = "РњР°РіР°Р·РёРЅ";
      navButtons[1].textContent = "РљР°СЂС‚Р°";
      navButtons[2].textContent = "РџСЂРѕС„РёР»СЊ";
    }
    // РЈРґР°Р»СЏРµРј РІСЃРµ РїРѕРІС‚РѕСЂСЏСЋС‰РёРµСЃСЏ Р·РЅР°РєРё РІРѕРїСЂРѕСЃР° Рё СЃР»РѕРІРѕ В«РґРµРЅСЊРіРёВ» РІ РёРЅС‚РµСЂС„РµР№СЃРµ
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      n.nodeValue = n.nodeValue.replace(/\?{2,}/g, "").replace(/РґРµРЅСЊРіРё/gi, "");
    }
  } catch (e) {
    console.warn("UI cleanup error:", e);
  }
});

<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", function () {
  try {
    // РџРѕРґРїРёСЃС‹РІР°РµРј РЅРёР¶РЅРёРµ РєРЅРѕРїРєРё РІРєР»Р°РґРѕРє, РµСЃР»Рё РѕРЅРё РµСЃС‚СЊ
    const navButtons = document.querySelectorAll(".tg-tabbar button, nav.tg-tabbar button, .tabs-bar button");
    if (navButtons.length >= 3) {
      navButtons[0].textContent = "РњР°РіР°Р·РёРЅ";
      navButtons[1].textContent = "РљР°СЂС‚Р°";
      navButtons[2].textContent = "РџСЂРѕС„РёР»СЊ";
    }
    // РЈРґР°Р»СЏРµРј РІСЃРµ РїРѕРІС‚РѕСЂСЏСЋС‰РёРµСЃСЏ Р·РЅР°РєРё РІРѕРїСЂРѕСЃР° Рё СЃР»РѕРІРѕ В«РґРµРЅСЊРіРёВ» РІ РёРЅС‚РµСЂС„РµР№СЃРµ
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      n.nodeValue = n.nodeValue.replace(/\?{2,}/g, "").replace(/РґРµРЅСЊРіРё/gi, "");
    }
  } catch (e) {
    console.warn("UI cleanup error:", e);
  }
});

//
// === UI cleanup/labels block ===
document.addEventListener('DOMContentLoaded', () => {
  try {
    // РїРѕРґРїРёСЃРё РЅРёР¶РЅРёС… РєРЅРѕРїРѕРє
    const navButtons = document.querySelectorAll('.tg-tabbar .tab-btn, nav.tg-tabbar button');
    if (navButtons.length >= 3) {
      (navButtons[0].querySelector('.lb')||navButtons[0]).textContent = 'РњР°РіР°Р·РёРЅ';
      (navButtons[1].querySelector('.lb')||navButtons[1]).textContent = 'РљР°СЂС‚Р°';
      (navButtons[2].querySelector('.lb')||navButtons[2]).textContent = 'РџСЂРѕС„РёР»СЊ';
    }
    // С‡РёСЃС‚РєР° В«В» Рё СЃР»РѕРІР° В«РґРµРЅСЊРіРёВ»
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n; while(n = w.nextNode()){
      n.nodeValue = n.nodeValue.replace(/\?{2,}/g,'').replace(/РґРµРЅСЊРіРё/gi,'');
    }
  } catch(e){ console.warn('ui polish warn', e); }
});


/* touch tuning */
try{document.querySelectorAll('.map-wrap,.map-container,#map').forEach(e=>e.style.touchAction='pan-y');}catch(e){}
=======
>>>>>>> 914d6e406c882eea813739a0647a022f9c5b77c8

