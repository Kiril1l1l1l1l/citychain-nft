(() => {
  const tg = window.Telegram?.WebApp; try{ tg?.expand(); }catch(e){}
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  /* MARK:ROUTER START */
  const screens = {
    shop: $("#screen-shop"),
    map: $("#screen-map"),
    profile: $("#screen-profile")
  };
  function show(tab){
    Object.entries(screens).forEach(([k,el])=>{
      if (el) el.classList.toggle("hidden", k !== tab);
    });
    $$(".tabbar button").forEach(b=>{
      b.setAttribute("aria-selected", b.dataset.tab===tab ? "true":"false");
    });
    document.body.setAttribute("data-tab", tab);
  }
  $$(".tabbar button").forEach(b => b.addEventListener("click", ()=> show(b.dataset.tab)));
  show("map");
  /* MARK:ROUTER END */

  /* MARK:USERDATA START */
  const user = tg?.initDataUnsafe?.user || {};
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ") || "Пользователь";
  const nameEl = document.getElementById("userName"); if (nameEl) nameEl.textContent = name;
  /* MARK:USERDATA END */

  /* MARK:BALANCE START */
  const BALANCE_KEY = "ccnft_balance";
  const getBalance = () => parseFloat(localStorage.getItem(BALANCE_KEY) || "0") || 0;
  const setBalance = v => { localStorage.setItem(BALANCE_KEY, String(v)); renderBalance(); };
  function renderBalance(){ const el = document.getElementById("balanceValue"); if (el) el.textContent = getBalance().toFixed(2); }
  renderBalance();
  document.getElementById("btnAddFunds")?.addEventListener("click", ()=>{
    const s = prompt("Сумма пополнения:", "100"); if (s===null) return;
    const n = parseFloat(String(s).replace(",", ".")); if (isNaN(n)) return alert("Неверное число");
    setBalance(Math.max(0, getBalance()+n));
  });
  /* MARK:BALANCE END */
})();
