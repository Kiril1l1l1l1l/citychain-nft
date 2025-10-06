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
