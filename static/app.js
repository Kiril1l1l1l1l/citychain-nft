(function(){
  try{ if(window.Telegram && Telegram.WebApp){ Telegram.WebApp.ready(); Telegram.WebApp.expand(); } }catch(e){}
  function setVh(){ var vh = window.innerHeight*0.01; document.documentElement.style.setProperty('--vh', vh+'px'); }
  setVh(); window.addEventListener('resize',setVh); window.addEventListener('orientationchange',setVh);
  document.documentElement.style.overflow='hidden'; document.body.style.overflow='hidden';
  var root=document.getElementById('app')||document.querySelector('.app')||document.body;
  if(root&&!root.classList.contains('app')) root.classList.add('app');
})();
