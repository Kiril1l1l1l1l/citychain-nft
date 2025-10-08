(function(){
  try{ if(window.Telegram && Telegram.WebApp){ Telegram.WebApp.ready(); Telegram.WebApp.expand(); } }catch(e){}
  function setVh(){ var vh = window.innerHeight*0.01; document.documentElement.style.setProperty('--vh', vh+'px'); }
  setVh(); window.addEventListener('resize',setVh); window.addEventListener('orientationchange',setVh);
  document.documentElement.style.overflow='hidden'; document.body.style.overflow='hidden';
  var root=document.getElementById('app')||document.querySelector('.app')||document.body;
  if(root&&!root.classList.contains('app')) root.classList.add('app');
})();
try{
  if(window.Telegram?.WebApp?.requestFullscreen){
    Telegram.WebApp.requestFullscreen();
  } else {
    Telegram.WebApp?.expand?.();
  }
}catch(e){}
window.Telegram.WebApp.ready();
try {
  Telegram.WebApp.expand();           // стандартное расширение
  if (Telegram.WebApp.requestFullscreen) {
    Telegram.WebApp.requestFullscreen(); // новое API, если доступно
  }
} catch(e) { console.warn("Expand fail", e); }

document.body.style.margin = "0";
document.body.style.padding = "0";
document.body.style.backgroundColor = "#0d0d0d";
document.documentElement.style.overflowX = "hidden";
try {
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
    if (typeof Telegram.WebApp.requestFullscreen === "function") {
      Telegram.WebApp.requestFullscreen();
    }
  }
} catch(e) { console.warn("WebApp expand/fullscreen error:", e); }

// страховка по размеру
document.documentElement.style.overflowX = "hidden";
document.body.style.margin = "0"; document.body.style.padding = "0";
try{
  if(window.Telegram?.WebApp){
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
    if(typeof Telegram.WebApp.requestFullscreen==="function"){ Telegram.WebApp.requestFullscreen(); }
  }
}catch(e){ console.warn("TG expand/fullscreen:",e); }
document.documentElement.style.overflowX="hidden";
document.body.style.margin="0"; document.body.style.padding="0";
(function(){
  try{
    var root = document.getElementById("app") || document.querySelector(".app") || document.body;
    // ищем «главную» секцию, если есть
    var target =
      document.querySelector(".content") ||
      document.querySelector(".page") ||
      document.querySelector(".tab-content") ||
      document.querySelector(".screen.active") ||
      document.querySelector(".screen") ||
      document.querySelector(".surface") ||
      root;

    if (!target.classList.contains("phone-col")) target.classList.add("phone-col");
  }catch(e){ console.warn("phone-col attach fail", e); }
})();
(function(){
  try{
    var app = document.getElementById("app") || document.querySelector(".app") || document.body.firstElementChild;
    if (app && !document.getElementById("phone-frame")) {
      var wrap = document.createElement("div");
      wrap.id = "phone-frame";
      app.parentNode.insertBefore(wrap, app);
      wrap.appendChild(app);
    }
  }catch(e){ console.warn("wrap phone-frame fail", e); }
})();
(function(){
  try{
    var app = document.getElementById("app") || document.querySelector(".app") || document.body.firstElementChild;
    if (app && !document.getElementById("phone-frame")) {
      var wrap = document.createElement("div");
      wrap.id = "phone-frame";
      app.parentNode.insertBefore(wrap, app);
      wrap.appendChild(app);
    }
    function relayout(){
      var wrap = document.getElementById("phone-frame");
      if(!wrap) return;
      if (window.innerWidth >= 900){
        // по умолчанию центр по вертикали; чтобы прижать сверху — добавь класс .top-mode
        wrap.classList.remove("phone-col"); // старые попытки больше не мешают
      }
    }
    relayout();
    window.addEventListener("resize", relayout);
  }catch(e){ console.warn("phone-frame layout fail", e); }
})();
document.getElementById('phone-frame')?.classList.add('top-mode');
(function(){
  try{
    var pf = document.getElementById("phone-frame");
    if (pf && window.innerWidth >= 900) { pf.classList.add("top-mode"); }
    window.addEventListener("resize", function(){
      var pf = document.getElementById("phone-frame");
      if (!pf) return;
      if (window.innerWidth >= 900) pf.classList.add("top-mode");
      else pf.classList.remove("top-mode");
    });
  }catch(e){}
})();
(function(){
  try{
    var app = document.getElementById("app") || document.querySelector(".app") || document.body.firstElementChild;
    if (app && !document.getElementById("phone-frame")) {
      var wrap = document.createElement("div");
      wrap.id = "phone-frame";
      app.parentNode.insertBefore(wrap, app);
      wrap.appendChild(app);
    }
  }catch(e){ console.warn("wrap fail", e); }
})();
(function(){
  try{
    var app=document.getElementById("app")||document.querySelector(".app")||document.body.firstElementChild;
    if(app && !document.getElementById("phone-frame")){
      var wrap=document.createElement("div"); wrap.id="phone-frame";
      app.parentNode.insertBefore(wrap,app); wrap.appendChild(app);
    }
  }catch(e){}
})();
(function(){
  try{
    var app=document.getElementById("app")||document.querySelector(".app")||document.body.firstElementChild;
    if(app && !document.getElementById("phone-frame")){
      var wrap=document.createElement("div"); wrap.id="phone-frame";
      app.parentNode.insertBefore(wrap,app); wrap.appendChild(app);
    }
  }catch(e){}
})();
