const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); tg.setHeaderColor("secondary_bg_color"); }

/* tabs */
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

/* demo balance */
const balanceEl = document.getElementById("balance");
document.addEventListener("click",(e)=>{
  if(e.target.matches("#profile-add1000")){
    const cur = parseInt(balanceEl.textContent||"0",10);
    balanceEl.textContent = String(cur + 1000);
    tg?.HapticFeedback?.notificationOccurred("success");
  }
});
