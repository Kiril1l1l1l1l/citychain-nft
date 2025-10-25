(() => {
  const tg = window.Telegram?.WebApp;
  try { tg?.expand(); tg?.enableClosingConfirmation?.(false); } catch(e){}

  const $  = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  // --- ВКЛАДКИ ---
  const screens = { shop: $("#screen-shop"), map: $("#screen-map"), profile: $("#screen-profile") };
  function show(tab){
    Object.entries(screens).forEach(([k,el])=> el?.classList.toggle("hidden", k!==tab));
    $$(".tabbar button").forEach(b=> b.setAttribute("aria-selected", b.dataset.tab===tab ? "true":"false"));
    // Подгон карты при возврате на неё — CSS сам тянет, логики не нужно
  }
  $$(".tabbar button").forEach(b => b.addEventListener("click", ()=> show(b.dataset.tab)));
  show("profile"); // чтобы сразу увидеть изменения профиля; поменяй на "map", если нужно

  // --- ДАННЫЕ ПОЛЬЗОВАТЕЛЯ ИЗ TELEGRAM ---
  const user = tg?.initDataUnsafe?.user || {};
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ") || "Пользователь";
  const id   = user.id ? String(user.id) : "—";
  $("#userName").textContent = name;
  $("#userId").textContent   = `ID: ${id}`;

  // Фото профиля: в WebApp не всегда приходит, поэтому оставляем плейсхолдер
  if (user.photo_url) {
    $("#userAvatar").src = user.photo_url;
  }

  // --- БАЛАНС (локально) ---
  const BALANCE_KEY = "ccnft_balance";
  const getBalance = () => parseFloat(localStorage.getItem(BALANCE_KEY) || "0") || 0;
  const setBalance = (v) => { localStorage.setItem(BALANCE_KEY, String(v)); renderBalance(); };

  function renderBalance(){
    const val = getBalance();
    const formatted = val.toFixed(2);
    $("#balanceValue").textContent = formatted;
    $("#balanceValueBottom").textContent = formatted;
  }
  renderBalance();

  // Кнопка "+"
  $("#btnAddFunds")?.addEventListener("click", ()=>{
    const str = prompt("На сколько пополнить баланс? Введите число:", "100");
    if (str === null) return;
    const num = parseFloat(str.replace(",", "."));
    if (isNaN(num)) { alert("Неверное число"); return; }
    setBalance(Math.max(0, getBalance() + num));
  });

  // Быстрые кнопки пополнить/вывод (заглушки)
  $("#btnTopUp")?.addEventListener("click", ()=> $("#btnAddFunds").click());
  const withdrawHandler = ()=> alert("Вывод средств: подключим платёжку позже.");
  $("#btnWithdrawTop")?.addEventListener("click", withdrawHandler);
  $("#btnWithdrawBottom")?.addEventListener("click", withdrawHandler);

  // --- РЕФЕРАЛКА ---
  const botUsername = "City_Chain_NFT_Bot"; // при необходимости поменяй
  const refLink = `https://t.me/${botUsername}?start=${id || "ref"}`;
  $("#btnInvite")?.addEventListener("click", ()=>{
    if (tg?.openTelegramLink) tg.openTelegramLink(refLink);
    else window.open(refLink, "_blank");
  });
  $("#btnCopyRef")?.addEventListener("click", async ()=>{
    try{
      await navigator.clipboard.writeText(refLink);
      alert("Ссылка скопирована");
    }catch(e){ alert("Не удалось скопировать"); }
  });
  $("#btnTerms")?.addEventListener("click", ()=> alert("Условия реферальной программы появятся позже."));

  // --- ИНВЕНТАРЬ (заглушка) ---
  const inventory = []; // сюда потом подставим реальные предметы
  $("#invCount").textContent = inventory.length;
  $("#btnSellAll")?.addEventListener("click", ()=> alert("Продажа всех предметов: реализуем позже."));

  // Тема Telegram (если меняется)
  tg?.onEvent?.("themeChanged", ()=>{/* CSS-переменные Telegram применяются автоматически */});
})();
