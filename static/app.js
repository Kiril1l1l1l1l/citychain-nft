const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.setHeaderColor("secondary_bg_color");
}

// баланс в шапке (пока локально; позже подтянем из бота)
const balanceEl = document.getElementById("balance");

// табы
const buttons = Array.from(document.querySelectorAll(".tab-btn"));
const screens = {
  store: document.getElementById("screen-store"),
  map: document.getElementById("screen-map"),
  profile: document.getElementById("screen-profile"),
};

buttons.forEach(btn => btn.addEventListener("click", () => switchTab(btn.dataset.tab)));

function switchTab(tab) {
  buttons.forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  Object.entries(screens).forEach(([k, el]) => el.classList.toggle("active", k === tab));
  if (tg) {
    // BackButton тут не нужен — у нас нижняя навигация
    tg.BackButton.hide();
    tg.MainButton.hide();
  }
}

// по умолчанию открываем Карту
switchTab("map");

// доп: демо пополнение из профиля (можно удалить, когда подключим к бэку)
document.addEventListener("click", (e) => {
  const target = e.target;
  if (target.matches("#profile-add1000")) {
    const cur = parseInt(balanceEl.textContent||"0", 10);
    balanceEl.textContent = String(cur + 1000);
    tg?.HapticFeedback?.notificationOccurred("success");
  }
});
