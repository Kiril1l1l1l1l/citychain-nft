const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.setHeaderColor("secondary_bg_color");
}

// Навигация между вкладками
const tabs = Array.from(document.querySelectorAll(".tab-btn"));
const screens = {
  store: document.getElementById("screen-store"),
  map: document.getElementById("screen-map"),
  profile: document.getElementById("screen-profile")
};
tabs.forEach(btn => btn.addEventListener("click", () => switchTab(btn.dataset.tab)));
function switchTab(name) {
  tabs.forEach(btn => btn.classList.toggle("active", btn.dataset.tab === name));
  Object.entries(screens).forEach(([key, el]) => {
    el.classList.toggle("active", key === name);
  });
  tg?.BackButton?.hide();
  tg?.MainButton?.hide();
}
switchTab("map");

// Заполнение профиля
function initProfile() {
  const avatarEl  = document.getElementById("profileAvatar");
  const nameEl    = document.getElementById("profileName");
  const refInput  = document.getElementById("referralLink");
  const copyBtn   = document.getElementById("copyReferral");
  const addFunds  = document.getElementById("addFunds");

  const user = tg?.initDataUnsafe?.user;
  if (user) {
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
    nameEl.textContent = user.username || fullName;
    if (user.photo_url) {
      avatarEl.src = user.photo_url;
    } else {
      avatarEl.src = "./static/avatar-placeholder.png";
    }
    const botName = tg?.initDataUnsafe?.bot?.username || "City_Chain_NFT_Bot";
    refInput.value = \`https://t.me/\${botName}?start=ref\${user.id}\`;
  } else {
    nameEl.textContent = "Гость";
    avatarEl.src = "./static/avatar-placeholder.png";
    refInput.value = "";
  }

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(refInput.value || "");
    tg?.HapticFeedback?.notificationOccurred("success");
  });

  addFunds.addEventListener("click", () => {
    try {
      tg.sendData(JSON.stringify({ action: "deposit" }));
    } catch (e) {
      console.error(e);
    }
  });
}

document.addEventListener("click", (e) => {
  if (e.target.matches("#profile-add1000")) {
    const balEl = document.getElementById("balance");
    const cur   = parseInt(balEl.textContent || "0", 10);
    balEl.textContent = String(cur + 1000);
    tg?.HapticFeedback?.notificationOccurred("success");
  }
});

initProfile();
