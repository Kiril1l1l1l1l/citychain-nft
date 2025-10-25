(() => {
  const tg = window.Telegram?.WebApp; try{ tg?.expand(); }catch(e){}
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  /* MARK:ROUTER START */
  const screens = { shop: $("#screen-shop"), map: $("#screen-map"), profile: $("#screen-profile") };
  function show(tab){
    Object.entries(screens).forEach(([k,el])=> el && el.classList.toggle("hidden", k!==tab));
    $$(".tabbar button").forEach(b=> b.setAttribute("aria-selected", b.dataset.tab===tab ? "true":"false"));
    document.body.setAttribute("data-tab", tab);
  }
  $$(".tabbar button").forEach(b => b.addEventListener("click", ()=> show(b.dataset.tab)));
  show("map");
  /* MARK:ROUTER END */

  /* MARK:USERDATA START */
  const name = (tg?.initDataUnsafe?.user ? [tg.initDataUnsafe.user.first_name, tg.initDataUnsafe.user.last_name].filter(Boolean).join(" ") : "") || "Пользователь";
  const el = document.getElementById("userName"); if (el) el.textContent = name;
  /* MARK:USERDATA END */

  /* MARK:BALANCE START */
  const KEY="ccnft_balance";
  const g=()=>+((localStorage.getItem(KEY)||"0")); const s=v=>{localStorage.setItem(KEY,String(v)); r();};
  function r(){ const v=document.getElementById("balanceValue"); if(v) v.textContent=g().toFixed(2); }
  r();
  document.getElementById("btnAddFunds")?.addEventListener("click", ()=>{
    const x = prompt("Сумма:", "100"); if(x===null) return;
    const n = parseFloat(String(x).replace(",", ".")); if(isNaN(n)) return alert("Неверное число");
    s(Math.max(0, g()+n));
  });
  /* MARK:BALANCE END */
})();
