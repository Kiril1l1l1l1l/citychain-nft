const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); tg.setHeaderColor("secondary_bg_color"); }

/* Tabs */
const tabs = Array.from(document.querySelectorAll(".tab-btn"));
const screens = {
  store: document.getElementById("screen-store"),
  map: document.getElementById("screen-map"),
  profile: document.getElementById("screen-profile"),
};
tabs.forEach(b => b.addEventListener("click", () => switchTab(b.dataset.tab)));
function switchTab(name){
  tabs.forEach(b => b.classList.toggle("active", b.dataset.tab===name));
  Object.entries(screens).forEach(([k,el]) => el.classList.toggle("active", k===name));
  tg?.BackButton?.hide(); tg?.MainButton?.hide();
}
switchTab("map");

/* Profile fill */
const SVG_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">
  <rect width="100%" height="100%" fill="#2a2f36"/>
  <circle cx="60" cy="48" r="22" fill="#3a424b"/>
  <rect x="20" y="82" width="80" height="26" rx="13" fill="#3a424b"/>
</svg>`);

function initProfile(){
  const avatarEl = document.getElementById("profileAvatar");
  const nameEl   = document.getElementById("profileName");
  const refInput = document.getElementById("referralLink");
  const copyBtn  = document.getElementById("copyReferral");
  const inviteBtn= document.getElementById("inviteBtn");
  const giftTop  = document.getElementById("giftTopup");
  const cryptoTop= document.getElementById("cryptoTopup");
  const withdraw = document.getElementById("withdrawBtn");

  const user = tg?.initDataUnsafe?.user;
  const botName = tg?.initDataUnsafe?.bot?.username || "City_Chain_NFT_Bot";

  if (user) {
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
    nameEl.textContent = user.username || fullName || "Пользователь";
    const src = user.photo_url || SVG_PLACEHOLDER;
    avatarEl.src = src;
    avatarEl.onerror = () => { avatarEl.src = SVG_PLACEHOLDER; };
    refInput.value = `https://t.me/${botName}?start=ref${user.id}`;
  } else {
    nameEl.textContent = "Гость";
    avatarEl.src = SVG_PLACEHOLDER;
    refInput.value = "";
  }

  copyBtn.addEventListener("click", () => {
    if (!refInput.value) { tg?.showAlert?.("Ссылка недоступна"); return; }
    navigator.clipboard.writeText(refInput.value);
    tg?.HapticFeedback?.notificationOccurred("success");
  });

  inviteBtn.addEventListener("click", () => {
    const url = encodeURIComponent(refInput.value || `https://t.me/${botName}`);
    const text = encodeURIComponent("Залетай в CityChainNFT!");
    tg?.openTelegramLink?.(`https://t.me/share/url?url=${url}&text=${text}`);
  });

  giftTop.addEventListener("click", () => tg?.sendData?.(JSON.stringify({action:"deposit", type:"gift"})));
  cryptoTop.addEventListener("click", () => tg?.sendData?.(JSON.stringify({action:"deposit", type:"token"})));
  withdraw.addEventListener("click", () => tg?.sendData?.(JSON.stringify({action:"withdraw"})));
}
initProfile();

/* demo: кнопка увеличить баланс если нужна
document.addEventListener("click",(e)=>{
  if(e.target.matches("#profile-add1000")){
    const b=document.getElementById("balance");
    b.textContent=String((parseInt(b.textContent||"0",10))+1000);
    tg?.HapticFeedback?.notificationOccurred("success");
  }
});
*/
