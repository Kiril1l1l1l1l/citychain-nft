(() => {
  const tg = window.Telegram?.WebApp;
  try { tg?.expand(); tg?.enableClosingConfirmation?.(false); } catch(e){}

  const $  = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  /* MARK:ROUTER START */
const screens = { shop: $("#screen-shop"), map: $("#screen-map"), profile: $("#screen-profile") };
function show(tab){
  Object.entries(screens).forEach(([k,el])=> el?.classList.toggle("hidden", k!==tab));
  $(".tabbar button").forEach(b=> b.setAttribute("aria-selected", b.dataset.tab===tab ? "true":"false"));
  document.body.setAttribute("data-tab", tab);           // для CSS-правила pointer-events
}
$(".tabbar button").forEach(b => b.addEventListener("click", ()=> show(b.dataset.tab)));
show("profile"); // профиль по умолчанию
/* MARK:ROUTER END */

  /* MARK:USERDATA START */
const user = tg?.initDataUnsafe?.user || {};
const baseName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "Пользователь";
const id   = user.id ? String(user.id) : "—";

const NICK_KEY = "ccnft_nick";
function renderNick(){
  const saved = (localStorage.getItem(NICK_KEY) || "").trim();
  const finalName = (saved ? saved : baseName).slice(0, 20);
  $("#userName").textContent = finalName || "Пользователь";
}
$("#userId").textContent = `ID: ${id}`;
if (user.photo_url) $("#userAvatar").src = user.photo_url;
renderNick();

$("#btnEditNick")?.addEventListener("click", ()=>{
  const current = $("#userName").textContent || "";
  const input = prompt("Введите новый ник (до 20 символов):", current);
  if (input === null) return;
  const trimmed = input.trim().slice(0,20);
  if (!trimmed) { alert("Ник не может быть пустым"); return; }
  localStorage.setItem(NICK_KEY, trimmed);
  renderNick();
});
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
  if (btm) btm.textContent = s;
}
renderBalance();

// Удаляем целиком карточку, где была синяя «Пополнить»
document.querySelector("#btnTopUp")?.closest(".card")?.remove();

// Нижний «Вывод»
const withdrawHandler = ()=> alert("Вывод средств: подключим платёжку позже.");
$("#btnWithdrawBottom")?.addEventListener("click", withdrawHandler);
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







