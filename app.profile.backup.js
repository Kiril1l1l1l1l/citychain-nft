(() => {
  const tg = window.Telegram?.WebApp;
  try{ tg?.expand(); tg?.enableClosingConfirmation?.(false); }catch(e){}

  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  const screens = {
    shop:    $('#screen-shop'),
    map:     $('#screen-map'),
    profile: $('#screen-profile'),
  };

  function show(tab){
    Object.entries(screens).forEach(([k,el])=> el?.classList.toggle('hidden', k!==tab));
    $$('.tabbar button').forEach(b=> b.setAttribute('aria-selected', b.dataset.tab===tab ? 'true':'false'));
  }

  $$('.tabbar button').forEach(b=> b.addEventListener('click', ()=> show(b.dataset.tab)));

  // default
  show('map');

  // защита карты
  const map = $('#map');
  if(map){ ['dragstart','contextmenu'].forEach(e=> map.addEventListener(e,ev=>ev.preventDefault())); }

  // тема
  function applyTheme(){ /* стили уже берутся из CSS-переменных Telegram */ }
  tg?.onEvent?.('themeChanged', applyTheme);
})();
