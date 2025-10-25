(() => {
  const tg = window.Telegram?.WebApp;
  try { tg?.expand(); tg?.enableClosingConfirmation?.(false); } catch(e){}

  const $  = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  /* MARK:ROUTER START */
  const screens = { shop: $("#screen-shop"), map: $("#screen-map"), profile: $("#screen-profile") };
  function show(tab){
    Object.entries(screens).forEach(([k,el])=> el?.classList.toggle("hidden", k!==tab));
    $$(".tabbar button").forEach(b=> b.setAttribute("aria-selected", b.dataset.tab===tab ? "true":"false"));
  }
  $$(".tabbar button").forEach(b => b.addEventListener("click", ()=> show(b.dataset.tab)));
  show("profile");
  /* MARK:ROUTER END */

  /* MARK:USERDATA START */
  const user = tg?.initDataUnsafe?.user || {};
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ") || "Пользователь";
  const id   = user.id ? String(user.id) : "—";
  $("#userName").textContent = name;
  $("#userId").textContent   = `ID: ${id}`;
  if (user.photo_url) $("#userAvatar").src = user.photo_url;
  /* MARK:USERDATA END */

  /* MARK:BALANCE START */
const BALANCE_KEY = "ccnft_balance";
const getBalance = () => parseFloat(localStorage.getItem(BALANCE_KEY) || "0") || 0;
const setBalance = (v) => { localStorage.setItem(BALANCE_KEY, String(v)); renderBalance(); };

function renderBalance(){
  const val = getBalance();
  const s = val.toFixed(2);
  $("#balanceValue").textContent = s;
  const btm = $("#balanceValueBottom");
  if (btm) btm.textContent = s; // если низ когда-нибудь вернём
}
renderBalance();

// Кнопка "+"
$("#btnAddFunds")?.addEventListener("click", ()=>{
  const str = prompt("На сколько пополнить баланс? Введите число:", "100");
  if (str === null) return;
  const num = parseFloat(str.replace(",", "."));
  if (isNaN(num)) return alert("Неверное число");
  setBalance(Math.max(0, getBalance() + num));
});

// «Пополнить» вызывает то же действие
$("#btnTopUp")?.addEventListener("click", ()=> $("#btnAddFunds").click());
/* MARK:BALANCE END */

  /* MARK:REFERRAL START */
  const botUsername = "City_Chain_NFT_Bot";
  const refLink = `https://t.me/${botUsername}?start=${id || "ref"}`;
  $("#btnInvite")?.addEventListener("click", ()=> (tg?.openTelegramLink ? tg.openTelegramLink(refLink) : window.open(refLink, "_blank")));
  $("#btnCopyRef")?.addEventListener("click", async ()=> {
    try{ await navigator.clipboard.writeText(refLink); alert("Ссылка скопирована"); }
    catch{ alert("Не удалось скопировать"); }
  });
  $("#btnTerms")?.addEventListener("click", ()=> alert("Условия реферальной программы появятся позже."));
  /* MARK:REFERRAL END */

  /* MARK:INVENTORY START */
  const inventory = [];
  $("#invCount").textContent = inventory.length;
  $("#btnSellAll")?.addEventListener("click", ()=> alert("Продажа всех предметов: реализуем позже."));
  /* MARK:INVENTORY END */

  tg?.onEvent?.("themeChanged", ()=>{});
})();

