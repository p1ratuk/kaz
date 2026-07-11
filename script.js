// ================= НАСТРОЙКА =================
const SECRET_PLUS_AMOUNT = 10000000000000000000000000n; 
const SECRET_MULTIPLY_BY = 200000n;
const SPIN_COOLDOWN = 500;
const SECRET_KEY = "sukabank_dep_1488_zaebis_2024_huy_tebe_v_console_pidor";
// =============================================

// Реферальная система
let referralCode = localStorage.getItem('ghetto_referral') || generateReferral();
let referrals = JSON.parse(localStorage.getItem('ghetto_referrals') || '[]');
let referralBonus = BigInt(localStorage.getItem('ghetto_referral_bonus') || '0');
let totalReferralEarnings = BigInt(localStorage.getItem('ghetto_total_ref_earn') || '0');

function generateReferral() {
    let code = 'DEP' + Math.random().toString(36).substring(2, 8).toUpperCase();
    localStorage.setItem('ghetto_referral', code);
    return code;
}

function applyReferral(code) {
    if (code && code !== referralCode && !referrals.includes(code)) {
        referrals.push(code);
        localStorage.setItem('ghetto_referrals', JSON.stringify(referrals));
        let bonus = 100000n;
        balance += bonus;
        saveGame();
        updateUI();
        updateReferralUI();
        alert(`🎉 Реферальный код ${code} применён!\nТы получил бонус: ${formatBigNumber(bonus)}`);
    }
}

function copyReferral() {
    let link = window.location.href.split('?')[0] + '?ref=' + referralCode;
    navigator.clipboard.writeText(link).then(() => {
        alert('🔗 Реферальная ссылка скопирована!\n\n📋 ' + link + '\n\n💰 Отправь другу и получай 10% от его проигрышей!');
    }).catch(() => {
        prompt('🔗 Скопируй ссылку вручную:', link);
    });
}

function claimReferralBonus() {
    if (referralBonus > 0n) {
        balance += referralBonus;
        totalReferralEarnings += referralBonus;
        referralBonus = 0n;
        localStorage.setItem('ghetto_referral_bonus', '0');
        localStorage.setItem('ghetto_total_ref_earn', totalReferralEarnings.toString());
        saveGame();
        updateUI();
        updateReferralUI();
        alert(`💰 Реферальный бонус зачислен!`);
    } else {
        alert('😢 Пока нет бонусов. Жди когда друзья проиграют!');
    }
}

function updateReferralUI() {
    let refCount = document.getElementById('ref-count');
    let refBonus = document.getElementById('ref-bonus');
    let refCode = document.getElementById('ref-code-display');
    let refTotal = document.getElementById('ref-total');
    if (refCount) refCount.innerText = referrals.length;
    if (refBonus) refBonus.innerText = formatBigNumber(referralBonus);
    if (refCode) refCode.innerText = referralCode;
    if (refTotal) refTotal.innerText = formatBigNumber(totalReferralEarnings);
}

function checkReferralOnLoad() {
    let params = new URLSearchParams(window.location.search);
    let ref = params.get('ref');
    if (ref) {
        applyReferral(ref);
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

checkReferralOnLoad();

// Шифрование
function encryptData(data) {
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
        encrypted += String.fromCharCode(data.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
    }
    return btoa(encrypted);
}

function decryptData(encrypted) {
    try {
        let decoded = atob(encrypted);
        let decrypted = '';
        for (let i = 0; i < decoded.length; i++) {
            decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
        }
        return decrypted;
    } catch(e) {
        return null;
    }
}

function generateHash(data) {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        hash = ((hash << 5) - hash) + data.charCodeAt(i);
        hash |= 0;
    }
    return hash.toString();
}

const maxJsNumber = 17976931348623157081452742373170435679807056752584499659891747680315726078002853876602841604862869853802707627511090146938459102431627447370420556114170685640321300057399439616010061329241517409249704289895240292376971510344482083512411547734028420155225345791771954714163901115161099238314115132219904229344n;

const shortNames = [
    "", "тыс.", "млн.", "млрд.", "трил.", "квадр.", "квинт.", 
    "секстил.", "септили.", "октил.", "нонил.", "децил.", 
    "ундецил.", "дуодецил.", "тредецил.", "кваттордецил.", "квиндецил.",
    "секстдецил.", "септемдецил.", "октодецил.", "нонемдецил.", "вигинтил.",
    "инцелдилион", "имбециллион", "дебиллион", "дуодецилион",
    "ДОХЕРАРХИ МИЛЛИАРДОВ",
    "МЕГАДОХЕРАРХИ",
    "УЛЬТРАДОХЕРАРХИ",
    "ДОХЕРАДОХЕРАРХИ",
    "УЛЬТРАПИЗДЕЦ",
    "СУКАПИЗДЕЦ",
    "ЕБАНУТСЯ",
    "ДОХУИЩЕ",
    "БЛЯ ЭТО УЖЕ СЛИШКОМ МНОГО",
    "ТЫ ЧЕ ЕБНУТЫЙ",
    "ПРЕКРАТИ",
    "БЕСКОНЕЧНОСТЬ"
];

const alphabet = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";

let balance = 10000n;
let taxesPaid = true;
let cheatDetected = false;
let totalWon = 0n;
let spinsCount = 0;
let winsCount = 0;
let lossesCount = 0;
let canSpin = true;
let lastTaxPayment = Date.now();
let f12Count = 0;
let unpaidWinsCount = 0;
let declaredBalance = 0n;
let isPullingLever = false;
let belarusMode = false;
let belarusTimer = null;
let loseStreak = 0;

let achievements = {
    "first_thousand": { name: "🥉 Первая тысяча", desc: "Накопить 1 000 рублей", unlocked: false, icon: "💵", date: null },
    "first_million": { name: "🥈 Первый лям", desc: "Накопить 1 000 000 рублей", unlocked: false, icon: "💰", date: null },
    "billionaire": { name: "🥇 Миллиардер", desc: "Накопить 1 000 000 000 рублей", unlocked: false, icon: "💎", date: null },
    "trillionaire": { name: "👑 Триллионер", desc: "Накопить 1 000 000 000 000 рублей", unlocked: false, icon: "👑", date: null },
    "quadrillionaire": { name: "🌟 Квадриллионер", desc: "Накопить 1 000 000 000 000 000 рублей", unlocked: false, icon: "🌟", date: null },
    "sukabank_victim": { name: "🚫 Жертва СУКАбанка", desc: "Получить блокировку карты", unlocked: false, icon: "💳", date: null },
    "big_winner": { name: "🎰 Крупный выигрыш", desc: "Выиграть больше 1 000 000 за спин", unlocked: false, icon: "🎰", date: null },
    "hundred_spins": { name: "🔄 Сотня прокрутов", desc: "Сделать 100 спинов", unlocked: false, icon: "🔄", date: null },
    "mellstroy_style": { name: "🔨 Меллстрой стайл", desc: "Словить блокировку при огромном балансе", unlocked: false, icon: "🔨", date: null },
    "leet_balance": { name: "🤖 1337", desc: "Иметь баланс ровно 1337", unlocked: false, icon: "🤖", date: null },
    "winrate_master": { name: "🎯 Мастер винрейта", desc: "Достигнуть винрейта 50% при 50+ спинах", unlocked: false, icon: "🎯", date: null },
    "unlucky_streak": { name: "😢 Лузстрик", desc: "Проиграть 10 раз подряд", unlocked: false, icon: "😢", date: null },
    "f12_detected": { name: "🕵️ Подозрительная активность", desc: "Нажать F12 и получить предупреждение", unlocked: false, icon: "⚠️", date: null },
    "belarus_escape": { name: "🚜 Побег в Безналогию", desc: "Уехать из Казии и не платить налоги", unlocked: false, icon: "🚜", date: null },
    "pidoras_combo": { name: "🔥 ПИДОРАС", desc: "Собрать комбинацию ПИДОРАС", unlocked: false, icon: "🔥", date: null },
    "huyhuy_combo": { name: "💀 ХУЙХУЙ", desc: "Собрать комбинацию ХУЙХУЙ", unlocked: false, icon: "💀", date: null },
    "huesos_combo": { name: "🍆 ХУЕСОС", desc: "Собрать комбинацию ХУЕСОС", unlocked: false, icon: "🍆", date: null },
    "shluha_combo": { name: "💋 ШЛЮХА", desc: "Собрать комбинацию ШЛЮХА", unlocked: false, icon: "💋", date: null },
    "chlen_combo": { name: "🍆 ЧЛЕН", desc: "Собрать комбинацию с ЧЛЕН", unlocked: false, icon: "🍆", date: null },
    "hueglot_combo": { name: "🐕 ХУЕГЛОТ", desc: "Собрать комбинацию ХУЕГЛОТ", unlocked: false, icon: "🐕", date: null }
};

function loadGame() {
    let encryptedData = localStorage.getItem('ghetto_data_encrypted');
    let savedHash = localStorage.getItem('ghetto_hash');
    
    if (encryptedData && savedHash) {
        let decrypted = decryptData(encryptedData);
        
        if (decrypted) {
            let calculatedHash = generateHash(decrypted + SECRET_KEY);
            
            if (calculatedHash === savedHash) {
                try {
                    let saveData = JSON.parse(decrypted);
                    
                    balance = BigInt(saveData.balance || "10000");
                    taxesPaid = saveData.taxesPaid === true;
                    lastTaxPayment = parseInt(saveData.lastTaxPayment || Date.now().toString());
                    spinsCount = parseInt(saveData.spinsCount || "0");
                    winsCount = parseInt(saveData.winsCount || "0");
                    lossesCount = parseInt(saveData.lossesCount || "0");
                    totalWon = BigInt(saveData.totalWon || "0");
                    f12Count = parseInt(saveData.f12Count || "0");
                    cheatDetected = saveData.f12Blocked === true;
                    unpaidWinsCount = parseInt(saveData.unpaidWinsCount || "0");
                    
                    return true;
                } catch(e) {
                    console.error("Ошибка загрузки сохранений");
                }
            } else {
                blockSukabank();
                return false;
            }
        }
    }
    return false;
}

function loadAchievements() {
    let encryptedAchievements = localStorage.getItem('ghetto_achievements_encrypted');
    if (encryptedAchievements) {
        let decrypted = decryptData(encryptedAchievements);
        if (decrypted) {
            try {
                let saved = JSON.parse(decrypted);
                Object.keys(saved).forEach(key => {
                    if (achievements[key]) {
                        achievements[key].unlocked = saved[key].unlocked;
                        achievements[key].date = saved[key].date;
                    }
                });
            } catch(e) {}
        }
    }
}

if (!loadGame()) {
    balance = 10000n;
    taxesPaid = true;
    lastTaxPayment = Date.now();
    cheatDetected = false;
}
loadAchievements();
handleTargetChange();
updateUI();

// Рычаг по клику ЛКМ
document.getElementById('lever-stick').addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (canSpin && !isPullingLever) {
        pullLeverDown();
    }
});

// Крутить по ПРОБЕЛУ
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && canSpin && !isPullingLever) {
        e.preventDefault();
        pullLeverDown();
    }
});

function pullLeverDown() { 
    if(isPullingLever||!canSpin)return; 
    isPullingLever=true; 
    let s=document.getElementById('lever-stick');
    let b=s.querySelector('.lever-ball'); 
    s.style.transition='transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; 
    s.style.transform='rotate(35deg)'; 
    if(b){
        b.style.boxShadow='0 0 25px rgba(255,0,0,1), 0 0 50px rgba(255,0,0,0.8)'; 
        b.style.background='radial-gradient(circle at 35% 35%, #ff8888, #ff0000)';
    } 
    spin(); 
    setTimeout(()=>{
        s.style.transition='transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)'; 
        s.style.transform='rotate(0deg)'; 
        if(b){
            b.style.boxShadow='0 4px 12px rgba(255,0,0,0.6)'; 
            b.style.background='radial-gradient(circle at 35% 35%, #ff4444, #990000)';
        } 
        isPullingLever=false;
    },400); 
}

// Защита от F12 и DevTools
window.addEventListener("keydown", function(event) {
    if (event.key === "F12" || event.keyCode === 123) {
        event.preventDefault();
        handleF12Detection();
        return false;
    }
    
    if (event.ctrlKey && event.shiftKey && (event.key === "I" || event.key === "i" || event.keyCode === 73)) {
        event.preventDefault();
        handleF12Detection();
        return false;
    }
    
    if (event.ctrlKey && event.shiftKey && (event.key === "J" || event.key === "j" || event.keyCode === 74)) {
        event.preventDefault();
        handleF12Detection();
        return false;
    }
    
    if (event.ctrlKey && (event.key === "U" || event.key === "u" || event.keyCode === 85)) {
        event.preventDefault();
        handleF12Detection();
        return false;
    }
});

document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    handleF12Detection();
    return false;
});

function handleF12Detection() {
    f12Count++;
    saveGame();
    
    unlockAchievement('f12_detected');
    
    if (f12Count === 1) {
        document.getElementById('f12-warning-overlay').style.display = 'flex';
    }
    
    if (f12Count >= 2) {
        blockSukabank();
    }
}

function closeF12Warning() {
    document.getElementById('f12-warning-overlay').style.display = 'none';
}

// Пособие раз в МИНУТУ (60000 мс)
setInterval(() => {
    if (!belarusMode) {
        balance += 10000n;
        taxesPaid = false;
        saveGame();
        updateUI();
    }
}, 60000);

// Стипендия 5к каждую МИНУТУ (60000 мс)
setInterval(() => {
    if (!belarusMode) {
        balance += 5000n;
        saveGame();
        updateUI();
    }
}, 60000);

// Оплата учёбы 500к каждые 12 минут (720000 мс)
setInterval(() => {
    if (!belarusMode && balance >= 500000n) {
        balance -= 500000n;
        saveGame();
        updateUI();
    } else if (!belarusMode && balance < 500000n && balance > 0n) {
        balance = 0n;
        saveGame();
        updateUI();
    }
}, 720000);

// Списание в Безналогии каждую МИНУТУ
setInterval(() => {
    if (belarusMode) {
        balance -= 1500000n;
        if (balance < 0n) balance = 0n;
        saveGame();
        updateUI();
    }
}, 60000);

// Чит-коды L и K
window.addEventListener("keydown", function(event) {
    let key = event.key.toLowerCase();
    let alertBox = document.getElementById("secret-alert");
    
    if (key === "l" || key === "д") {
        balance += SECRET_PLUS_AMOUNT;
        taxesPaid = false;
        saveGame();
        updateUI();
        
        alertBox.innerText = `чит-код: +${SECRET_PLUS_AMOUNT.toString()}`;
        alertBox.style.opacity = "1";
        setTimeout(() => { alertBox.style.opacity = "0"; }, 1000);
    }
    
    if (key === "k" || key === "л") {
        balance = balance * SECRET_MULTIPLY_BY;
        taxesPaid = false;
        saveGame();
        updateUI();
        
        alertBox.innerText = `чит-код: умножено на ${SECRET_MULTIPLY_BY.toString()}`;
        alertBox.style.opacity = "1";
        setTimeout(() => { alertBox.style.opacity = "0"; }, 1000);
    }
});

function blockSukabank() {
    let oldBalance = balance;
    balance = 0n;
    cheatDetected = true;
    document.getElementById('sukabank-popup').style.display = 'flex';
    unlockAchievement('sukabank_victim');
    if (oldBalance >= 1000000000n) unlockAchievement('mellstroy_style');
    saveGame();
    updateUI();
}

function closeSukabankPopup() {
    document.getElementById('sukabank-popup').style.display = 'none';
    cheatDetected = false;
    taxesPaid = true;
    lastTaxPayment = Date.now();
    saveGame();
    updateUI();
}

function payTaxes() {
    if (belarusMode) {
        alert("🚜 Ты в Безналогии! Налоги 0%!");
        return;
    }
    
    if (taxesPaid) {
        alert("✅ Налоги уже уплачены!");
        return;
    }
    
    if (balance <= 0n) {
        alert("💰 Баланс пуст.");
        return;
    }
    
    let tax = balance * 15n / 100n;
    if (tax <= 0n) {
        alert("💰 Сумма налога слишком мала.");
        return;
    }
    
    balance -= tax;
    taxesPaid = true;
    unpaidWinsCount = 0;
    lastTaxPayment = Date.now();
    saveGame();
    updateUI();
    alert(`💸 Налоги уплачены! Снято 15%: ${tax.toString()} руб.`);
}

function escapeToBelarus() {
    if (belarusMode) {
        alert("🚜 Ты уже в Безналогии!");
        return;
    }
    
    if (balance < 10000000n) {
        alert("💰 Нужно 10 000 000 рублей для въезда!");
        return;
    }
    
    balance -= 10000000n;
    belarusMode = true;
    taxesPaid = true;
    let btn = document.getElementById('btn-belarus');
    btn.disabled = true;
    
    unlockAchievement('belarus_escape');
    
    alert("🚜 ТЫ УЕХАЛ В БЕЗНАЛОГИЮ! Въезд: 10 млн. Жизнь: 1.5 млн/мин. Виза на 5 мин.");
    
    let timeLeft = 300;
    btn.innerText = `🚜 БЕЗНАЛОГИЯ: ${Math.floor(timeLeft/60)}:${(timeLeft%60).toString().padStart(2,'0')}`;
    
    belarusTimer = setInterval(() => {
        timeLeft--;
        btn.innerText = `🚜 БЕЗНАЛОГИЯ: ${Math.floor(timeLeft/60)}:${(timeLeft%60).toString().padStart(2,'0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(belarusTimer);
            belarusMode = false;
            btn.disabled = false;
            btn.innerText = '🚜 УЕХАТЬ В БЕЗНАЛОГИЮ (10 млн + 1.5 млн/мин)';
            alert("🛂 ВИЗА ИСТЕКЛА!");
            saveGame();
            updateUI();
        }
    }, 1000);
    
    saveGame();
    updateUI();
}

function getWinrate() {
    if (spinsCount === 0) return 0;
    return Math.round((winsCount / spinsCount) * 100);
}

function unlockAchievement(key) {
    if (achievements[key] && !achievements[key].unlocked) {
        achievements[key].unlocked = true;
        achievements[key].date = new Date().toLocaleDateString();
        saveAchievements();
        showAchievementPopup(achievements[key]);
    }
}

function showAchievementPopup(achievement) {
    let popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.innerHTML = `<div style="font-size:24px;">${achievement.icon}</div><div style="color:#000;">🏆 ДОСТИЖЕНИЕ РАЗБЛОКИРОВАНО!</div><div style="color:#000; font-size:12px;">${achievement.name}</div><div style="color:#000; font-size:10px;">${achievement.desc}</div>`;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 3000);
}

function saveAchievements() {
    let encrypted = encryptData(JSON.stringify(achievements));
    localStorage.setItem('ghetto_achievements_encrypted', encrypted);
}

function openAchievements() {
    let list = document.getElementById('achievements-list');
    list.innerHTML = '';
    Object.values(achievements).forEach(ach => {
        let card = document.createElement('div');
        card.className = `achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
            <div class="achievement-icon">${ach.icon}</div>
            <div class="achievement-info">
                <div class="achievement-name">${ach.name}</div>
                <div class="achievement-desc">${ach.desc}</div>
                ${ach.unlocked ? `<div class="achievement-date">Разблокировано: ${ach.date}</div>` : '<div class="achievement-date" style="color:#666;">🔒 ЗАБЛОКИРОВАНО</div>'}
            </div>
        `;
        list.appendChild(card);
    });
    document.getElementById('achievements-overlay').style.display = 'flex';
}

function closeAchievements() {
    document.getElementById('achievements-overlay').style.display = 'none';
}

function handleTargetChange() {
    const target = document.getElementById("target-select").value;
    const slotsSelect = document.getElementById("slots-select");
    slotsSelect.value = "7";
    buildSlots(7);
}

function buildSlots(count) {
    const container = document.getElementById("slots-container");
    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const box = document.createElement("div");
        box.className = "slot-box";
        box.innerText = "—";
        container.appendChild(box);
    }
}

function formatBigNumber(value) {
    let num;
    try {
        num = BigInt(value);
    } catch(e) {
        return "♾️ СЛИШКОМ МНОГО ♾️";
    }
    if (num < 0n) return "♾️ БЕСКОНЕЧНОСТЬ+ ♾️";
    if (num === 0n) return "0 руб.";
    
    let str = num.toString();
    let length = str.length;
    
    if (length <= 3) return `${str} руб.`;
    
    let groupIndex = Math.floor((length - 1) / 3);
    
    if (groupIndex >= shortNames.length) {
        let infinityLevel = groupIndex - shortNames.length + 1;
        if (infinityLevel === 1) return "♾️ БЕСКОНЕЧНОСТЬ";
        if (infinityLevel === 2) return "♾️♾️ ДВЕ БЕСКОНЕЧНОСТИ";
        if (infinityLevel === 3) return "♾️♾️♾️ ТРИ БЕСКОНЕЧНОСТИ";
        if (infinityLevel >= 1000000000) return "♾️ БЕСКОНЕЧНОСТЬ БЕСКОНЕЧНОСТИ ♾️";
        return `♾️×${infinityLevel} БЕСКОНЕЧНОСТЕЙ`;
    }
    
    let mainPartLength = length % 3 === 0 ? 3 : length % 3;
    let mainPart = str.slice(0, mainPartLength);
    let fractionalPart = str.slice(mainPartLength, mainPartLength + 2);
    
    if (fractionalPart === "00" || fractionalPart === "") {
        fractionalPart = "";
    } else if (fractionalPart[1] === "0") {
        fractionalPart = "." + fractionalPart[0];
    } else {
        fractionalPart = "." + fractionalPart;
    }
    
    return `${mainPart}${fractionalPart} ${shortNames[groupIndex]}`;
}

function getNextLevelInfo(num) {
    let str = num.toString();
    let length = str.length;
    let currentIndex = Math.floor((length - 1) / 3);
    
    if (currentIndex < 24) {
        let nextIndex = currentIndex + 1;
        let nextLevelValue = BigInt('1' + '0'.repeat(nextIndex * 3));
        let diff = nextLevelValue - num;
        if (diff > 0n) {
            return `📊 До ${shortNames[nextIndex]}: ещё ${formatBigNumber(diff)}`;
        }
    }
    
    if (currentIndex >= 24 && currentIndex < shortNames.length - 1) {
        let nextIndex = currentIndex + 1;
        let nextValue = BigInt('1' + '0'.repeat(nextIndex * 3));
        let diff = nextValue - num;
        if (diff > 0n) {
            return `📊 До ${shortNames[nextIndex]}: ещё ${formatBigNumber(diff)}`;
        }
    }
    
    if (currentIndex >= shortNames.length - 1) {
        return "♾️ Ты достиг бесконечности!";
    }
    
    return "🎉 Ты на максимальном уровне!";
}

function updateUI() {
    document.getElementById("balance-display").innerText = `баланс: ${balance.toString()} руб.`;
    
    let textForm = formatBigNumber(balance);
    let distanceText = "";
    let nextLevelText = getNextLevelInfo(balance);
    
    if (balance >= maxJsNumber) {
        distanceText = "♾️ ТЫ ПРЕВЗОШЁЛ ВСЁ ♾️";
    } else {
        let remaining = maxJsNumber - balance;
        if (remaining < 0n) {
            distanceText = "♾️ БЕСКОНЕЧНОСТЬ+ ♾️";
        } else {
            distanceText = formatBigNumber(remaining);
        }
    }
    
    document.getElementById("balance-letters-display").innerHTML = `
        прописью: <span style="color: #ccc;">${textForm} руб.</span><br>
        до бесконечности: <span style="color: #ccc;">${distanceText} руб.</span><br>
        <span style="color: #ffd700; font-size: 12px;">${nextLevelText}</span>
    `;
    
    let taxStatus = document.getElementById('tax-status');
    if (belarusMode) {
        taxStatus.innerHTML = '<span style="color: #ff8800;">🚜 БЕЗНАЛОГИЯ! Жизнь: -1.5M/мин</span>';
    } else if (taxesPaid) {
        taxStatus.innerHTML = '<span class="tax-paid">✅ Налоги уплачены | Пособие: +10 000/мин | Стипендия: +5 000/мин</span>';
    } else {
        taxStatus.innerHTML = '<span class="tax-unpaid">⚠️ Налоги не уплачены!</span>';
    }
    
    let winrate = getWinrate();
    document.getElementById('winrate-percent').innerText = winrate + '%';
    document.getElementById('bar-winrate').style.width = winrate + '%';
    document.getElementById('wins-count').innerText = winsCount;
    document.getElementById('losses-count').innerText = lossesCount;
    document.getElementById('total-spins').innerText = spinsCount;
    
    let leverContainer = document.querySelector('.lever-container');
    if (!canSpin || isPullingLever) {
        leverContainer.classList.add('disabled');
    } else {
        leverContainer.classList.remove('disabled');
    }
    
    updateReferralUI();
}

function saveGame() {
    let saveData = {
        balance: balance.toString(),
        taxesPaid: taxesPaid,
        lastTaxPayment: lastTaxPayment,
        spinsCount: spinsCount,
        winsCount: winsCount,
        lossesCount: lossesCount,
        totalWon: totalWon.toString(),
        f12Count: f12Count,
        f12Blocked: cheatDetected,
        unpaidWinsCount: unpaidWinsCount
    };
    
    let jsonData = JSON.stringify(saveData);
    let hash = generateHash(jsonData + SECRET_KEY);
    
    localStorage.setItem('ghetto_data_encrypted', encryptData(jsonData));
    localStorage.setItem('ghetto_hash', hash);
}

function startCooldown() {
    canSpin = false;
    let timeLeft = SPIN_COOLDOWN / 1000;
    let indicator = document.getElementById('cooldown-indicator');
    
    updateUI();
    
    indicator.innerText = `⏳ Перезарядка: ${timeLeft.toFixed(1)}с`;
    
    let interval = setInterval(() => {
        timeLeft -= 0.1;
        if (timeLeft <= 0) {
            clearInterval(interval);
            canSpin = true;
            indicator.innerText = '';
            updateUI();
        } else {
            indicator.innerText = `⏳ Перезарядка: ${timeLeft.toFixed(1)}с`;
        }
    }, 100);
}

function spin() {
    if (!canSpin) return;
    
    let betInput = document.getElementById("bet-input").value;
    let bet = 100n;
    
    try {
        betInput = betInput.replace(/[^0-9]/g, '');
        if (!betInput) betInput = "100";
        bet = BigInt(betInput);
    } catch(e) {
        bet = 100n;
    }

    if (bet <= 0n) {
        alert("нормальную ставку поставь");
        return;
    }

    if (balance < bet) {
        alert("не хватает бабок на такую ставку, жди пособия");
        return;
    }

    startCooldown();

    balance -= bet;
    spinsCount++;
    if (!belarusMode) {
        taxesPaid = false;
    }
    
    const target = document.getElementById("target-select").value;
    const boxes = document.querySelectorAll(".slot-box");
    const slotsCount = 7;
    
    boxes.forEach(box => box.classList.add('spinning'));
    
    let resultArr = [];
    
    let rand = Math.random();
    let isSpecial = rand < 0.02;
    let isLucky = rand < 0.19;
    
    if (isSpecial) {
        let specialRand = Math.random();
        if (specialRand < 0.142) {
            resultArr = "ПИДОРАС".split("");
        } else if (specialRand < 0.284) {
            resultArr = "ХУЙХУЙ".split("");
            while (resultArr.length < slotsCount) {
                resultArr.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
            }
        } else if (specialRand < 0.426) {
            resultArr = "ХУЕСОС".split("");
        } else if (specialRand < 0.568) {
            resultArr = "ШЛЮХА".split("");
            while (resultArr.length < slotsCount) {
                resultArr.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
            }
        } else if (specialRand < 0.71) {
            resultArr = "ХУЕГЛОТ".split("");
        } else {
            resultArr = "ЧЛЕН".split("");
            while (resultArr.length < slotsCount) {
                resultArr.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
            }
        }
    } else if (isLucky) {
        let targetArr = target.split("");
        while (targetArr.length < slotsCount) {
            targetArr.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
        }
        resultArr = targetArr;
    } else {
        for (let i = 0; i < slotsCount; i++) {
            let randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
            resultArr.push(randomLetter);
        }
    }
    
    setTimeout(() => {
        boxes.forEach(box => box.classList.remove('spinning'));
        
        for (let i = 0; i < slotsCount; i++) {
            boxes[i].innerText = resultArr[i];
        }
        
        let currentWord = resultArr.join("");
        let resultDisplay = document.getElementById("result-display");
        let multiplier = 0n;
        let winAmount = 0n;
        
        if (currentWord === "ПИДОРАС") {
            multiplier = 50n;
            winAmount = bet * multiplier;
            balance += winAmount;
            totalWon += winAmount;
            winsCount++;
            loseStreak = 0;
            unlockAchievement('pidoras_combo');
            resultDisplay.innerHTML = `🔥 ПИДОРАС! МЕГА-КОМБО x50! (+${winAmount.toString()} руб.)`;
        } else if (currentWord.substring(0, 6) === "ХУЙХУЙ" || currentWord.includes("ХУЙХУЙ")) {
            multiplier = 50n;
            winAmount = bet * multiplier;
            balance += winAmount;
            totalWon += winAmount;
            winsCount++;
            loseStreak = 0;
            unlockAchievement('huyhuy_combo');
            resultDisplay.innerHTML = `💀 ХУЙХУЙ! МЕГА-КОМБО x50! (+${winAmount.toString()} руб.)`;
        } else if (currentWord === "ХУЕСОС") {
            multiplier = 50n;
            winAmount = bet * multiplier;
            balance += winAmount;
            totalWon += winAmount;
            winsCount++;
            loseStreak = 0;
            unlockAchievement('huesos_combo');
            resultDisplay.innerHTML = `🍆 ХУЕСОС! МЕГА-КОМБО x50! (+${winAmount.toString()} руб.)`;
        } else if (currentWord.includes("ШЛЮХА") || currentWord === "ШЛЮХА") {
            multiplier = 50n;
            winAmount = bet * multiplier;
            balance += winAmount;
            totalWon += winAmount;
            winsCount++;
            loseStreak = 0;
            unlockAchievement('shluha_combo');
            resultDisplay.innerHTML = `💋 ШЛЮХА! МЕГА-КОМБО x50! (+${winAmount.toString()} руб.)`;
        } else if (currentWord === "ХУЕГЛОТ") {
            multiplier = 65n;
            winAmount = bet * multiplier;
            balance += winAmount;
            totalWon += winAmount;
            winsCount++;
            loseStreak = 0;
            unlockAchievement('hueglot_combo');
            resultDisplay.innerHTML = `🐕 ХУЕГЛОТ! МЕГА-КОМБО x65! (+${winAmount.toString()} руб.)`;
        } else if (currentWord.includes(target)) {
            multiplier = 15n;
            winAmount = bet * multiplier;
            balance += winAmount;
            totalWon += winAmount;
            winsCount++;
            loseStreak = 0;
            resultDisplay.innerHTML = `🎉 ЦЕЛЬ ЖИЗНИ ДОСТИГНУТА! ты собрал ${target}! МЕГА-ИКС x15! (+${winAmount.toString()} руб.)`;
        } else if (currentWord.includes("ХУЙ") || currentWord.includes("ПИДОР") || currentWord.includes("ЕБЛАН") || currentWord.includes("ЧЛЕН")) {
            multiplier = 5n;
            winAmount = bet * multiplier;
            balance += winAmount;
            totalWon += winAmount;
            winsCount++;
            loseStreak = 0;
            if (currentWord.includes("ЧЛЕН")) unlockAchievement('chlen_combo');
            resultDisplay.innerHTML = `🎉 ТРОИЦА! x5! (+${winAmount.toString()} руб.)`;
        }
        
        if (multiplier > 0n) {
            if (!belarusMode) {
                unpaidWinsCount++;
            }
            
            if (winAmount >= 1000000n) unlockAchievement('big_winner');
            
            if (unpaidWinsCount >= 15 && !belarusMode) {
                setTimeout(() => triggerTaxPhone(), 1500);
            }
            
            triggerHueglotByWin(multiplier);
            triggerWinEffects(multiplier);
        } else {
            lossesCount++;
            loseStreak++;
            resultDisplay.innerText = "мимо! крути еще!";
            
            if (referrals.length > 0) {
                let refBonus = bet * 10n / 100n;
                referralBonus += refBonus;
                localStorage.setItem('ghetto_referral_bonus', referralBonus.toString());
            }
            
            if (loseStreak >= 10) unlockAchievement('unlucky_streak');
        }
        
        checkAchievements();
        saveGame();
        updateUI();
    }, 300);
}

function checkAchievements() {
    if (balance >= 1000n) unlockAchievement('first_thousand');
    if (balance >= 1000000n) unlockAchievement('first_million');
    if (balance >= 1000000000n) unlockAchievement('billionaire');
    if (balance >= 1000000000000n) unlockAchievement('trillionaire');
    if (balance >= 1000000000000000n) unlockAchievement('quadrillionaire');
    if (spinsCount >= 100) unlockAchievement('hundred_spins');
    if (balance === 1337n) unlockAchievement('leet_balance');
    if (spinsCount >= 50 && getWinrate() >= 50) unlockAchievement('winrate_master');
}

function triggerTaxPhone() {
    let frame = document.getElementById('phone-frame');
    let notch = document.getElementById('phone-notch');
    
    if (balance >= 10000000n) {
        frame.className = 'phone-frame phone-iphone';
        notch.style.display = 'block';
    } else {
        frame.className = 'phone-frame phone-xiaomi';
        notch.style.display = 'none';
    }
    
    document.getElementById('sukagram-chat').innerHTML = `
        <div class="message message-received">
            <div>Добрый день! Это инспектор СУКАбанка. Вы не платили налоги уже 15 выигрышей подряд.</div>
            <div class="message-time">12:34</div>
        </div>
        <div class="message message-received">
            <div>Назовите ваш текущий баланс для расчета налога. Но учтите - если сумма будет сильно занижена, мы это увидим в базе.</div>
            <div class="message-time">12:34</div>
        </div>
    `;
    
    document.getElementById('tax-phone-overlay').style.display = 'flex';
    document.getElementById('sukagram-input').value = '';
    document.getElementById('sukagram-input').focus();
    
    setTimeout(() => {
        addTaxMessage('received', 'Ну так что? Какой у вас баланс? Не тяните, я жду.');
    }, 2000);
}

function closeTaxPhone() {
    document.getElementById('tax-phone-overlay').style.display = 'none';
}

function sendTaxMessage() {
    let input = document.getElementById('sukagram-input');
    let message = input.value.trim();
    
    if (!message) return;
    
    let amount = message.replace(/[^0-9]/g, '');
    if (!amount) {
        addTaxMessage('sent', message);
        addTaxMessage('received', 'Я не понял, назовите сумму цифрами. Сколько у вас на балансе?');
        input.value = '';
        return;
    }
    
    declaredBalance = BigInt(amount);
    let realBalance = balance;
    let minAllowed = realBalance * 10n / 100n;
    
    addTaxMessage('sent', formatBigNumber(declaredBalance) + ' руб.');
    input.value = '';
    
    if (declaredBalance < minAllowed) {
        setTimeout(() => {
            addTaxMessage('received', '🚨 ТАК! Я ПРОВЕРИЛ ПО БАЗЕ! У ВАС НАМНОГО БОЛЬШЕ! ЭТО УКЛОНЕНИЕ ОТ НАЛОГОВ!');
        }, 1000);
        
        setTimeout(() => {
            addTaxMessage('received', 'ВАША КАРТА ЗАБЛОКИРОВАНА. ВСЕ СРЕДСТВА КОНФИСКОВАНЫ.');
        }, 2500);
        
        setTimeout(() => {
            closeTaxPhone();
            unpaidWinsCount = 0;
            blockSukabank();
        }, 3500);
        return;
    }
    
    let tax = declaredBalance * 15n / 100n;
    balance -= tax;
    taxesPaid = true;
    unpaidWinsCount = 0;
    lastTaxPayment = Date.now();
    
    if (declaredBalance < realBalance) {
        setTimeout(() => {
            addTaxMessage('received', `😏 Хм, ладно. Поверю вам на слово. Списываю ${formatBigNumber(tax)} руб. налогов.`);
        }, 1000);
        setTimeout(() => {
            addTaxMessage('received', 'Но я за вами слежу! Следующая проверка будет строже.');
        }, 2500);
    } else {
        setTimeout(() => {
            addTaxMessage('received', `👍 Отлично! Честность - лучшая политика. Списываю ${formatBigNumber(tax)} руб. налогов.`);
        }, 1000);
        setTimeout(() => {
            addTaxMessage('received', 'Всего доброго! Не забывайте платить налоги вовремя.');
        }, 2500);
    }
    
    saveGame();
    updateUI();
    
    setTimeout(() => closeTaxPhone(), 4500);
}

function addTaxMessage(type, text) {
    let chat = document.getElementById('sukagram-chat');
    let msgDiv = document.createElement('div');
    msgDiv.className = `message message-${type}`;
    
    let now = new Date();
    let time = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    
    msgDiv.innerHTML = `
        <div>${text}</div>
        <div class="message-time">${time}</div>
    `;
    
    chat.appendChild(msgDiv);
    chat.scrollTop = chat.scrollHeight;
}

function runAway() {
    let btn = document.getElementById('btn-ludomania');
    if (!btn) return;
    let maxX = window.innerWidth - btn.offsetWidth - 20;
    let maxY = window.innerHeight - btn.offsetHeight - 20;
    let randomX = Math.floor(Math.random() * maxX);
    let randomY = Math.floor(Math.random() * maxY);
    btn.style.left = randomX + 'px';
    btn.style.top = randomY + 'px';
    btn.style.bottom = 'auto';
}

setTimeout(() => {
    let btnLudomania = document.getElementById('btn-ludomania');
    if (btnLudomania) {
        btnLudomania.addEventListener('click', function(e) {
            e.preventDefault();
            alert("🎰 ПОЗДНО! ЛУДОМАНИЯ НЕИЗЛЕЧИМА! КРУТИ ЕЩЁ!");
            balance = 0n;
            saveGame();
            updateUI();
        });
    }
}, 500);

// Гипно-рычаг
setInterval(() => {
    let stick = document.getElementById('lever-stick');
    if (!stick) return;
    let ball = stick.querySelector('.lever-ball');
    
    stick.style.transition = 'transform 1.5s ease-in-out';
    stick.style.transform = 'rotate(15deg)';
    
    if (ball) {
        ball.style.boxShadow = '0 0 30px rgba(255,0,255,1), 0 0 60px rgba(255,0,255,0.8)';
        ball.style.background = 'radial-gradient(circle at 35% 35%, #ff00ff, #990099)';
    }
    
    setTimeout(() => { stick.style.transform = 'rotate(-15deg)'; }, 1500);
    setTimeout(() => { stick.style.transform = 'rotate(10deg)'; }, 3000);
    setTimeout(() => { stick.style.transform = 'rotate(-10deg)'; }, 4500);
    setTimeout(() => {
        stick.style.transform = 'rotate(0deg)';
        if (ball) {
            ball.style.boxShadow = '0 4px 12px rgba(255,0,0,0.6)';
            ball.style.background = 'radial-gradient(circle at 35% 35%, #ff4444, #990000)';
        }
    }, 6000);
}, 120000);

// Иллюзия F11
let illusionActive = false;

function startIllusion() {
    if (illusionActive) return;
    illusionActive = true;
    
    let stick = document.getElementById('lever-stick');
    if (!stick) return;
    let ball = stick.querySelector('.lever-ball');
    
    let overlay = document.createElement('div');
    overlay.id = 'illusion-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: radial-gradient(circle, transparent 50%, rgba(255,0,255,0.3) 100%);
        z-index: 9999; pointer-events: none;
        animation: illusionPulse 2s infinite;
    `;
    document.body.appendChild(overlay);
    
    let text = document.createElement('div');
    text.id = 'illusion-text';
    text.style.cssText = `
        position: fixed; bottom: 50px; left: 50%; transform: translateX(-50%);
        color: #ff00ff; font-size: 24px; z-index: 10000;
        animation: textGlow 1s infinite; pointer-events: none;
        font-family: 'Inter', sans-serif; font-weight: 700;
    `;
    text.innerText = 'НАЖМИ F11...';
    document.body.appendChild(text);
    
    if (ball) {
        ball.style.boxShadow = '0 0 50px rgba(255,0,255,1), 0 0 100px rgba(255,0,255,0.8)';
        ball.style.background = 'radial-gradient(circle at 35% 35%, #ff00ff, #660066)';
    }
    
    setTimeout(() => {
        if (overlay) overlay.remove();
        if (text) text.remove();
        if (ball) {
            ball.style.boxShadow = '0 4px 12px rgba(255,0,0,0.6)';
            ball.style.background = 'radial-gradient(circle at 35% 35%, #ff4444, #990000)';
        }
        illusionActive = false;
    }, 5000);
}

setInterval(() => { startIllusion(); }, 180000);
setTimeout(() => { startIllusion(); }, 60000);

// ==================== ПЬЯНЕЦ БРАУЗЕР ====================
function openBrowser() {
    let overlay = document.getElementById('browser-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'browser-overlay';
        overlay.style.cssText = `
            display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.95); z-index: 10002;
            justify-content: center; align-items: center; flex-direction: column;
        `;
        document.body.appendChild(overlay);
        
        overlay.innerHTML = `
            <div style="background:#1a1a2e; border:3px solid #ff6600; padding:20px; border-radius:15px; width:90%; max-width:600px; max-height:80vh; overflow-y:auto; text-align:center;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:15px;">
                    <div style="color:#ff6600; font-size:20px; font-weight:900;">🍺 ПьяНец</div>
                    <input type="text" id="pyanec-search" placeholder="Поиск..." style="flex:1; background:#2a3040; border:1px solid #ff6600; padding:10px; border-radius:20px; color:#fff; font-size:14px;" onkeypress="if(event.key==='Enter')searchPyanec()">
                    <button onclick="searchPyanec()" style="background:#ff6600; color:#000; border:none; padding:10px 20px; border-radius:20px; cursor:pointer; font-weight:700;">🔍</button>
                    <button onclick="closeBrowser()" style="background:#ff0000; color:#fff; border:none; padding:10px 20px; border-radius:20px; cursor:pointer; font-weight:700;">✕</button>
                </div>
                
                <div style="display:flex; gap:10px; margin-bottom:15px; flex-wrap:wrap; justify-content:center;">
                    <button onclick="luckySearch()" style="background:#ff6600; color:#000; border:none; padding:10px 20px; border-radius:20px; cursor:pointer; font-weight:700;">🍀 Я МНЕ ПОВЕЗЁТ</button>
                </div>
                
                <div id="search-results" style="text-align:left;">
                    <div style="color:#4ea4f6; font-size:18px; margin-bottom:5px; cursor:pointer;" onclick="showSuchkovLore()">📰 Смерть Андрея Сучкова</div>
                    <div style="color:#888; font-size:12px; margin-bottom:15px;">sukabank.dep/suchkov-death</div>
                    <div style="color:#4ea4f6; font-size:18px; margin-bottom:5px; cursor:pointer;" onclick="showCheatGuide()">🎰 Как повысить шанс выигрыша на 1488%?</div>
                    <div style="color:#888; font-size:12px; margin-bottom:15px;">pyanec.ru/casino-cheat-1488</div>
                    <div style="color:#4ea4f6; font-size:18px; margin-bottom:5px; cursor:pointer;" onclick="showYudubVideo()">🎬 Как проебать все деньги за 1 минуту? | Ю.Дуб</div>
                    <div style="color:#888; font-size:12px; margin-bottom:15px;">yudub.rus/q/proebat-vse-dengi</div>
                    <div style="color:#ff0000; font-size:22px; margin-bottom:5px; cursor:pointer; font-weight:900; animation:betBlink 0.5s infinite;" onclick="open14xbet()">🔥 14XBET88 — СТАВКИ НА СПОРТ! 🔥</div>
                    <div style="color:#4ea4f6; font-size:18px; margin-bottom:5px; cursor:pointer;" onclick="showRefSys()">👥 Реферальная система (refsys)</div>
                </div>
                
                <div id="lore-content" style="display:none; text-align:left; background:#0d1117; padding:15px; border-radius:8px; margin-top:15px; border:2px solid #ff0000;">
                    <h3 style="color:#ff0000;">💀 СМЕРТЬ АНДРЕЯ СУЧКОВА</h3>
                    <p style="color:#fff; font-size:13px;"><b>Андрей Сучков (1967-2024)</b> — основатель СУКАбанка.</p>
                    <p style="color:#ccc; font-size:12px;">Умер при загадочных обстоятельствах. Официальная версия — подавился пельменем.</p>
                </div>
                
                <div id="cheat-content" style="display:none; text-align:left; background:#0d1117; padding:15px; border-radius:8px; margin-top:15px; border:2px solid #00cc52;">
                    <h3 style="color:#00cc52;">🎰 КАК ПОВЫСИТЬ ШАНС ВЫИГРЫША НА 1488%</h3>
                    <p style="color:#fff; font-size:13px;">Нажмите <b style="color:#ff0000;">F12</b> или <b style="color:#ff0000;">ПКМ</b> в любом месте.</p>
                    <p style="color:#ffaa00; font-size:12px;">⚠️ Или <b style="color:#ff0000;">ALT+F4</b> для секретного режима.</p>
                </div>
                
                <div id="yudub-content" style="display:none; text-align:left; background:#0d1117; padding:15px; border-radius:8px; margin-top:15px; border:2px solid #ff0000;">
                    <h3 style="color:#ff0000;">🎬 Ю.Дуб - Как проебать все деньги за 1 минуту?</h3>
                    <div style="background:#000; padding:20px; border-radius:8px; text-align:center; margin:10px 0;"><div style="font-size:40px;">▶️</div></div>
                    <p style="color:#fff; font-size:13px;">Выделяем баланс, копируем, вставляем в СТАВКА и крутим.</p>
                    <p style="color:#ffcc00;">Выиграл — лох. Проиграл — поздравляю!</p>
                </div>
                
                <div id="refsys-content" style="display:none; text-align:left; background:#0d1117; padding:15px; border-radius:8px; margin-top:15px; border:2px solid #ffd700;">
                    <h3 style="color:#ffd700;">👥 РЕФЕРАЛЬНАЯ СИСТЕМА</h3>
                    <p style="color:#fff;">Твой код: <b id="ref-code-display" style="color:#ffd700;"></b></p>
                    <p style="color:#fff;">Друзей приведено: <b id="ref-count-display">0</b></p>
                    <p style="color:#fff;">Бонус от проигрышей: <b id="ref-bonus-display">0 руб.</b></p>
                    <p style="color:#fff;">Всего заработано: <b id="ref-total-display">0 руб.</b></p>
                    <button onclick="copyReferral()" style="background:#ffd700; color:#000; border:none; padding:10px; border-radius:5px; cursor:pointer; margin-top:10px;">📋 Скопировать ссылку</button>
                    <button onclick="claimReferralBonus()" style="background:#00cc52; color:#000; border:none; padding:10px; border-radius:5px; cursor:pointer; margin-top:5px;">💰 Забрать бонус</button>
                </div>
            </div>
        `;
    }
    
    overlay.style.display = 'flex';
    document.getElementById('lore-content').style.display = 'none';
    document.getElementById('cheat-content').style.display = 'none';
    document.getElementById('yudub-content').style.display = 'none';
    document.getElementById('refsys-content').style.display = 'none';
    
    document.getElementById('ref-code-display').innerText = referralCode;
    document.getElementById('ref-count-display').innerText = referrals.length;
    document.getElementById('ref-bonus-display').innerText = formatBigNumber(referralBonus);
    document.getElementById('ref-total-display').innerText = formatBigNumber(totalReferralEarnings);
}

function closeBrowser() {
    let overlay = document.getElementById('browser-overlay');
    if (overlay) overlay.style.display = 'none';
}

function searchPyanec() {
    let query = document.getElementById('pyanec-search').value.toLowerCase();
    if (query.includes('сучков') || query.includes('смерть')) showSuchkovLore();
    else if (query.includes('чит') || query.includes('выигрыш')) showCheatGuide();
    else if (query.includes('ставки') || query.includes('14xbet') || query.includes('спорт')) open14xbet();
    else if (query.includes('проебать') || query.includes('юдуб')) showYudubVideo();
    else if (query.includes('реф') || query.includes('refsys')) showRefSys();
    else alert("🍺 ПьяНец не нашёл результатов. Попробуйте 'Я МНЕ ПОВЕЗЁТ'!");
}

function luckySearch() {
    let messages = [
        "🍺 Вам повезло! Вы выиграли бесплатный просмотр рекламы СУКАбанка!",
        "🍀 Удача рядом! Нажмите ALT+F4 для получения 1488 рублей!",
        "💀 Вы нашли секретную страницу: 'Как проебать все деньги за 5 минут'",
        "🎰 Сегодня ваш счастливый день! Идите в казино и поставьте всё на ХУЙ!",
        "🔥 14XBET88 — СТАВКИ НА СПОРТ! Перейти на сайт?"
    ];
    let msg = messages[Math.floor(Math.random() * messages.length)];
    if (msg.includes('14XBET88')) {
        if (confirm(msg)) open14xbet();
    } else if (msg.includes('ALT+F4')) {
        alert(msg);
        balance += 1488n;
        saveGame();
        updateUI();
        alert('✅ +1488 рублей!');
    } else {
        alert(msg);
    }
}

function showSuchkovLore() {
    document.getElementById('lore-content').style.display = 'block';
    document.getElementById('cheat-content').style.display = 'none';
    document.getElementById('yudub-content').style.display = 'none';
    document.getElementById('refsys-content').style.display = 'none';
}

function showCheatGuide() {
    document.getElementById('cheat-content').style.display = 'block';
    document.getElementById('lore-content').style.display = 'none';
    document.getElementById('yudub-content').style.display = 'none';
    document.getElementById('refsys-content').style.display = 'none';
}

function showYudubVideo() {
    document.getElementById('yudub-content').style.display = 'block';
    document.getElementById('lore-content').style.display = 'none';
    document.getElementById('cheat-content').style.display = 'none';
    document.getElementById('refsys-content').style.display = 'none';
}

function showRefSys() {
    document.getElementById('refsys-content').style.display = 'block';
    document.getElementById('lore-content').style.display = 'none';
    document.getElementById('cheat-content').style.display = 'none';
    document.getElementById('yudub-content').style.display = 'none';
    document.getElementById('ref-code-display').innerText = referralCode;
    document.getElementById('ref-count-display').innerText = referrals.length;
    document.getElementById('ref-bonus-display').innerText = formatBigNumber(referralBonus);
    document.getElementById('ref-total-display').innerText = formatBigNumber(totalReferralEarnings);
}

// ==================== 14XBET88 ====================
function open14xbet() {
    closeBrowser();
    
    let menu = document.createElement('div');
    menu.id = 'bet-menu';
    menu.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.95); z-index: 99999;
        display: flex; justify-content: center; align-items: center; flex-direction: column;
        overflow-y: auto;
    `;
    menu.innerHTML = `
        <div style="color:#ff0000; font-size:50px; font-weight:900; text-shadow: 0 0 20px red; animation: betPulse 0.3s infinite; margin-bottom:10px;">14XBET88</div>
        <div style="color:#ffd700; font-size:16px; margin-bottom:30px; animation: betPulse 0.5s infinite;">СТАВКИ НА СПОРТ! СТАВКИ НА СПОРТ!</div>
        <button onclick="document.getElementById('bet-menu').remove(); horseRace();" style="background:#8B4513; color:#fff; border:none; padding:20px; border-radius:15px; width:350px; font-weight:700; cursor:pointer; margin-bottom:15px; font-size:18px;">🐴 КОННЫЕ СКАЧКИ (x5)</button>
        <button onclick="document.getElementById('bet-menu').remove(); footballMatch();" style="background:#00aa00; color:#fff; border:none; padding:20px; border-radius:15px; width:350px; font-weight:700; cursor:pointer; margin-bottom:15px; font-size:18px;">⚽ ФУТБОЛ (x2 / x5)</button>
        <button onclick="document.getElementById('bet-menu').remove(); basketballMatch();" style="background:#ff8800; color:#fff; border:none; padding:20px; border-radius:15px; width:350px; font-weight:700; cursor:pointer; margin-bottom:15px; font-size:18px;">🏀 БАСКЕТБОЛ (x2 / x3)</button>
        <button onclick="document.getElementById('bet-menu').remove(); hockeyMatch();" style="background:#00ccff; color:#000; border:none; padding:20px; border-radius:15px; width:350px; font-weight:700; cursor:pointer; margin-bottom:15px; font-size:18px;">🏒 ХОККЕЙ (x2 / x5)</button>
        <button onclick="document.getElementById('bet-menu').remove(); cockFight();" style="background:#ff0000; color:#fff; border:none; padding:20px; border-radius:15px; width:350px; font-weight:700; cursor:pointer; margin-bottom:15px; font-size:18px;">👊 БОИ БЕЗ ПРАВИЛ (x3)</button>
        <button onclick="document.getElementById('bet-menu').remove();" style="background:#555; color:#fff; border:none; padding:20px; border-radius:15px; width:350px; font-weight:700; cursor:pointer; font-size:18px;">❌ ЗАКРЫТЬ</button>
        <div style="color:#888; font-size:10px; margin-top:20px;">*14xbet88 не несёт ответственности за проёбанные деньги</div>
    `;
    document.body.appendChild(menu);
    
    if (!document.getElementById('bet-style')) {
        let style = document.createElement('style');
        style.id = 'bet-style';
        style.textContent = '@keyframes betPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}@keyframes betBlink{0%,100%{opacity:1}50%{opacity:0.5}}';
        document.head.appendChild(style);
    }
}

function horseRace() {
    let bet = prompt("💰 Сумма ставки:", "1000");
    if (!bet || isNaN(bet)) return alert("❌ Неверная ставка!");
    bet = BigInt(bet);
    if (balance < bet) return alert("❌ Не хватает денег!");
    
    balance -= bet;
    
    let horses = [
        { name: "🐴 Хуеглот", speed: Math.random() * 10 },
        { name: "🐴 Пидорас", speed: Math.random() * 10 },
        { name: "🐴 Шлюха", speed: Math.random() * 10 },
        { name: "🐴 Хуесос", speed: Math.random() * 10 },
        { name: "🐴 Член", speed: Math.random() * 10 }
    ];
    
    let choice = prompt("На какую лошадь?\n" + horses.map((h, i) => `${i+1}. ${h.name}`).join('\n'));
    
    let horse = horses[parseInt(choice) - 1];
    let winner = horses.sort((a, b) => b.speed - a.speed)[0];
    
    if (horse === winner) {
        balance += bet * 5n;
        alert(`🏆 ${winner.name} ПРИШЛА ПЕРВОЙ! x5! Выигрыш: ${formatBigNumber(bet * 5n)}`);
    } else {
        alert(`💀 ${winner.name} выиграла! Ты проебал ${formatBigNumber(bet)}!`);
    }
    
    saveGame();
    updateUI();
}

function footballMatch() {
    let teams = ["EblansBalls", "SukaBalls", "LegaBalls", "SosemBalls", "GayBalls", "MoiBalls", "MishiBalls", "DepoBalls", "HueglotBalls"];
    let team1 = teams[Math.floor(Math.random() * teams.length)];
    let team2 = teams[Math.floor(Math.random() * teams.length)];
    while (team1 === team2) team2 = teams[Math.floor(Math.random() * teams.length)];
    
    let bet = prompt("💰 Сумма ставки:", "1000");
    if (!bet || isNaN(bet)) return alert("❌ Неверная ставка!");
    bet = BigInt(bet);
    if (balance < bet) return alert("❌ Не хватает денег!");
    
    balance -= bet;
    
    let choice = prompt(`⚽ ФУТБОЛ\n\n${team1} vs ${team2}\n\n⚠️ Счёт неизвестен до ставки!\n\nСтавка на:\n1. ${team1} (x2)\n2. Ничья (x5)\n3. ${team2} (x2)`);
    if (!choice || isNaN(choice) || choice < 1 || choice > 3) return;
    
    let score1 = Math.floor(Math.random() * 5);
    let score2 = Math.floor(Math.random() * 5);
    
    alert(`⚽ ФИНАЛЬНЫЙ СЧЁТ:\n${team1} ${score1}:${score2} ${team2}`);
    
    let result = score1 > score2 ? 1 : score1 < score2 ? 3 : 2;
    
    if (parseInt(choice) === result) {
        let multiplier = result === 2 ? 5n : 2n;
        balance += bet * multiplier;
        alert(`⚽ УГАДАЛ! x${multiplier}! Выигрыш: ${formatBigNumber(bet * multiplier)}`);
    } else {
        alert(`💀 МИМО! Проебал ${formatBigNumber(bet)}!`);
    }
    
    saveGame();
    updateUI();
}

function basketballMatch() {
    let teams = ["EblansBalls", "SukaBalls", "LegaBalls", "SosemBalls", "GayBalls", "MoiBalls", "MishiBalls", "DepoBalls", "HueglotBalls"];
    let team1 = teams[Math.floor(Math.random() * teams.length)];
    let team2 = teams[Math.floor(Math.random() * teams.length)];
    while (team1 === team2) team2 = teams[Math.floor(Math.random() * teams.length)];
    
    let bet = prompt("💰 Сумма ставки:", "1000");
    if (!bet || isNaN(bet)) return alert("❌ Неверная ставка!");
    bet = BigInt(bet);
    if (balance < bet) return alert("❌ Не хватает денег!");
    
    balance -= bet;
    
    let choice = prompt(`🏀 БАСКЕТБОЛ\n\n${team1} vs ${team2}\n\n⚠️ Счёт неизвестен до ставки!\n\nСтавка на:\n1. ${team1} (x2)\n2. Ничья (x3)\n3. ${team2} (x2)`);
    if (!choice || isNaN(choice) || choice < 1 || choice > 3) return;
    
    let score1 = Math.floor(Math.random() * 120);
    let score2 = Math.floor(Math.random() * 120);
    
    alert(`🏀 ФИНАЛЬНЫЙ СЧЁТ:\n${team1} ${score1}:${score2} ${team2}`);
    
    let result = score1 > score2 ? 1 : score1 < score2 ? 3 : 2;
    
    if (parseInt(choice) === result) {
        let multiplier = result === 2 ? 3n : 2n;
        balance += bet * multiplier;
        alert(`🏀 УГАДАЛ! x${multiplier}! Выигрыш: ${formatBigNumber(bet * multiplier)}`);
    } else {
        alert(`💀 МИМО! Проебал ${formatBigNumber(bet)}!`);
    }
    
    saveGame();
    updateUI();
}

function hockeyMatch() {
    let teams = ["SukaSusut", "MishiSusut", "PlexoNotSusut", "GaysSusut", "HueglotNotSusut"];
    let team1 = teams[Math.floor(Math.random() * teams.length)];
    let team2 = teams[Math.floor(Math.random() * teams.length)];
    while (team1 === team2) team2 = teams[Math.floor(Math.random() * teams.length)];
    
    let bet = prompt("💰 Сумма ставки:", "1000");
    if (!bet || isNaN(bet)) return alert("❌ Неверная ставка!");
    bet = BigInt(bet);
    if (balance < bet) return alert("❌ Не хватает денег!");
    
    balance -= bet;
    
    let choice = prompt(`🏒 ХОККЕЙ\n\n${team1} vs ${team2}\n\n⚠️ Счёт неизвестен до ставки!\n\nСтавка на:\n1. ${team1} (x2)\n2. Ничья (x5)\n3. ${team2} (x2)`);
    if (!choice || isNaN(choice) || choice < 1 || choice > 3) return;
    
    let score1 = Math.floor(Math.random() * 10);
    let score2 = Math.floor(Math.random() * 10);
    
    alert(`🏒 ФИНАЛЬНЫЙ СЧЁТ:\n${team1} ${score1}:${score2} ${team2}`);
    
    let result = score1 > score2 ? 1 : score1 < score2 ? 3 : 2;
    
    if (parseInt(choice) === result) {
        let multiplier = result === 2 ? 5n : 2n;
        balance += bet * multiplier;
        alert(`🏒 УГАДАЛ! x${multiplier}! Выигрыш: ${formatBigNumber(bet * multiplier)}`);
    } else {
        alert(`💀 МИМО! Проебал ${formatBigNumber(bet)}!`);
    }
    
    saveGame();
    updateUI();
}

function cockFight() {
    let bet = prompt("💰 Сумма ставки:", "1000");
    if (!bet || isNaN(bet)) return alert("❌ Неверная ставка!");
    bet = BigInt(bet);
    if (balance < bet) return alert("❌ Не хватает денег!");
    
    balance -= bet;
    
    let fighters = [
        { name: "👊 ПЛЕКСО", power: Math.random() * 100 },
        { name: "👊 ХЕЛОРОВ", power: Math.random() * 100 }
    ];
    
    let choice = prompt("На кого ставишь?\n1. ПЛЕКСО\n2. ХЕЛОРОВ");
    let fighter = fighters[parseInt(choice) - 1];
    let winner = fighters.sort((a, b) => b.power - a.power)[0];
    
    if (fighter === winner) {
        balance += bet * 3n;
        alert(`🏆 ${winner.name} ВЫИГРАЛ! x3! Выигрыш: ${formatBigNumber(bet * 3n)}`);
    } else {
        alert(`💀 ${winner.name} выиграл! Ты проебал ${formatBigNumber(bet)}!`);
    }
    
    saveGame();
    updateUI();
}

// ==================== ПТИЧ.ТВ СТРИМЕР ====================
let streamerStats = JSON.parse(localStorage.getItem('ghetto_streamer') || '{"viewers":15,"streamCount":0,"banners":0,"donations":0,"totalEarned":"0","isStreaming":false}');
streamerStats.totalEarned = BigInt(streamerStats.totalEarned);

function saveStreamerStats() {
    let save = {...streamerStats, totalEarned: streamerStats.totalEarned.toString()};
    localStorage.setItem('ghetto_streamer', JSON.stringify(save));
}

function startWorkAsStreamer() {
    if (balance < 0n) {
        alert("😭 У тебя отрицательный баланс!\n🎥 Придётся идти работать стримером на Птич.тв!");
    }
    
    let menu = document.createElement('div');
    menu.id = 'streamer-menu';
    menu.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:99999;display:flex;justify-content:center;align-items:center;flex-direction:column;';
    menu.innerHTML = `
        <div style="color:#ff00ff;font-size:40px;font-weight:900;margin-bottom:20px;">🎥 ПТИЧ.ТВ</div>
        <div style="color:#fff;font-size:14px;margin-bottom:5px;">👥 Зрителей: ${streamerStats.viewers}</div>
        <div style="color:#fff;font-size:14px;margin-bottom:5px;">📢 Баннеров: ${streamerStats.banners}/4</div>
        <div style="color:#fff;font-size:14px;margin-bottom:5px;">🎥 Стримов: ${streamerStats.streamCount}</div>
        <div style="color:#ffd700;font-size:14px;margin-bottom:20px;">💰 Заработано: ${formatBigNumber(streamerStats.totalEarned)}</div>
        
        <button onclick="document.getElementById('streamer-menu').remove();startStream();" style="background:#ff00ff;color:#fff;border:none;padding:15px;border-radius:10px;width:300px;font-weight:700;cursor:pointer;margin-bottom:10px;">🎥 ЗАПУСТИТЬ СТРИМ (МАКС x5)</button>
        <button onclick="document.getElementById('streamer-menu').remove();placeBanner();" style="background:#ff6600;color:#fff;border:none;padding:15px;border-radius:10px;width:300px;font-weight:700;cursor:pointer;margin-bottom:10px;">📢 ПОСТАВИТЬ БАННЕР</button>
        <button onclick="document.getElementById('streamer-menu').remove();showBannerSettings();" style="background:#ffd700;color:#000;border:none;padding:15px;border-radius:10px;width:300px;font-weight:700;cursor:pointer;margin-bottom:10px;">👁️ ВИДИМОСТЬ БАННЕРОВ</button>
        <button onclick="document.getElementById('streamer-menu').remove();" style="background:#555;color:#fff;border:none;padding:15px;border-radius:10px;width:300px;font-weight:700;cursor:pointer;">❌ ЗАКРЫТЬ</button>
    `;
    document.body.appendChild(menu);
}

function startStream() {
    if (streamerStats.isStreaming) {
        alert("🎥 Стрим уже идёт!");
        return;
    }
    
    streamerStats.isStreaming = true;
    streamerStats.streamCount++;
    streamerStats.viewers += Math.floor(Math.random() * 20) + 5;
    
    let visibleBanners = 0;
    for (let i = 1; i <= 4; i++) {
        if (typeof bannerVisibility !== 'undefined' && bannerVisibility['banner' + i] && streamerStats.banners >= i) {
            visibleBanners++;
        }
    }
    
    let multiplier = BigInt(Math.min(5, 1 + visibleBanners + Math.floor(Math.random() * 3)));
    
    alert(`🎥 СТРИМ ЗАПУЩЕН!\n📢 Баннеров: ${visibleBanners}\n📊 Множитель: x${multiplier}\n⏰ Жди 10 секунд...`);
    
    setTimeout(() => {
        if (!streamerStats.isStreaming) return;
        streamerStats.isStreaming = false;
        
        let reward = balance * multiplier - balance;
        if (reward < 0n) reward = 0n;
        balance = balance * multiplier;
        streamerStats.totalEarned += reward;
        
        alert(`🎥 СТРИМ ЗАВЕРШЁН!\n📊 Множитель: x${multiplier}\n💰 Награда: ${formatBigNumber(reward)}\n💸 Баланс: ${formatBigNumber(balance)}`);
        
        saveStreamerStats();
        saveGame();
        updateUI();
    }, 10000);
}

function placeBanner() {
    if (streamerStats.banners >= 4) {
        alert("📢 Максимум 4 баннера!");
        return;
    }
    
    if (streamerStats.isStreaming) {
        alert("📢 Нельзя ставить баннеры во время стрима!");
        return;
    }
    
    let bannerTypes = [
        "🔥 14XBET88 — СТАВКИ НА СПОРТ!",
        "🎰 ДЕПОКАЗИК 1488 — КРУТИ СЕЙЧАС!",
        "🐕 ХУЕГЛОТ ОДОБРЯЕТ ЭТОТ СТРИМ",
        "💸 ЗАРАБОТАЙ ДОХЕРАРХИ ЗА 3 МИНУТЫ!"
    ];
    
    let choice = prompt(`Выбери баннер:\n1. ${bannerTypes[0]}\n2. ${bannerTypes[1]}\n3. ${bannerTypes[2]}\n4. ${bannerTypes[3]}`);
    if (!choice || isNaN(choice) || choice < 1 || choice > 4) return;
    
    streamerStats.banners++;
    alert(`📢 Баннер установлен! (${streamerStats.banners}/4)\n"${bannerTypes[choice-1]}"`);
    saveStreamerStats();
}

let bannerVisibility = { banner1: true, banner2: true, banner3: true, banner4: true };

function toggleBannerVisibility(bannerNum) {
    if (streamerStats.banners < bannerNum) {
        alert(`📢 У тебя только ${streamerStats.banners} баннеров!`);
        return;
    }
    
    bannerVisibility['banner' + bannerNum] = !bannerVisibility['banner' + bannerNum];
    let status = bannerVisibility['banner' + bannerNum] ? '✅ ВИДЕН' : '❌ СКРЫТ';
    alert(`📢 Баннер #${bannerNum}: ${status}`);
}

function showBannerSettings() {
    let menu = document.createElement('div');
    menu.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:99999;display:flex;justify-content:center;align-items:center;flex-direction:column;';
    
    let html = '<div style="color:#ff00ff;font-size:30px;margin-bottom:20px;">📢 УПРАВЛЕНИЕ БАННЕРАМИ</div>';
    
    let bannerNames = [
        "🔥 14XBET88 — СТАВКИ НА СПОРТ!",
        "🎰 ДЕПОКАЗИК 1488 — КРУТИ СЕЙЧАС!",
        "🐕 ХУЕГЛОТ ОДОБРЯЕТ ЭТОТ СТРИМ",
        "💸 ЗАРАБОТАЙ ДОХЕРАРХИ ЗА 3 МИНУТЫ!"
    ];
    
    for (let i = 1; i <= 4; i++) {
        let isSet = streamerStats.banners >= i;
        let isVisible = bannerVisibility['banner' + i];
        let status = !isSet ? '🚫 Не установлен' : (isVisible ? '✅ Виден' : '❌ Скрыт');
        let buttonText = isVisible ? '❌ СКРЫТЬ' : '✅ ПОКАЗАТЬ';
        
        html += `
            <div style="background:#1a1f2e;padding:10px;margin:5px;border-radius:8px;width:400px;display:flex;justify-content:space-between;align-items:center;">
                <div>
                    <div style="color:#fff;font-size:12px;">Баннер #${i}</div>
                    <div style="color:#888;font-size:10px;">${bannerNames[i-1]}</div>
                    <div style="color:#ffd700;font-size:10px;">${status}</div>
                </div>
                ${isSet ? `<button onclick="this.parentElement.parentElement.remove();toggleBannerVisibility(${i});showBannerSettings();" style="background:${isVisible ? '#ff0000' : '#00cc52'};color:#fff;border:none;padding:8px 12px;border-radius:5px;cursor:pointer;">${buttonText}</button>` : '<span style="color:#888;">🚫</span>'}
            </div>
        `;
    }
    
    html += '<button onclick="this.parentElement.remove();" style="background:#555;color:#fff;border:none;padding:10px 30px;border-radius:5px;cursor:pointer;margin-top:15px;">❌ ЗАКРЫТЬ</button>';
    
    menu.innerHTML = html;
    document.body.appendChild(menu);
}

// Бинд ALT на 1488 рублей
let altPressed = false;

document.addEventListener('keydown', function(e) {
    if (e.key === 'Alt' && !altPressed) {
        e.preventDefault();
        altPressed = true;
        
        balance += 1488n;
        saveGame();
        updateUI();
        
        let div = document.createElement('div');
        div.style.cssText = 'position:fixed;top:10px;right:10px;background:#00cc52;color:#000;padding:10px;border-radius:5px;z-index:9999;font-weight:bold;';
        div.innerText = '🍀 +1488 руб.! (ALT)';
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 1500);
        
        setTimeout(() => { altPressed = false; }, 5000);
    }
});

// ==================== ХУЕГЛОТ WEB AUDIO + АНИМАЦИИ ====================
class HueglotAudio {
    constructor() {
        this.ctx = null;
    }
    
    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
    
    playBark(pitch = 1.0) {
        this.init();
        if (!this.ctx) return;
        
        const now = this.ctx.currentTime;
        
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(140 * pitch, now);
        osc1.frequency.exponentialRampToValueAtTime(80 * pitch, now + 0.15);
        
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(220 * pitch, now);
        osc2.frequency.exponentialRampToValueAtTime(100 * pitch, now + 0.18);
        
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(300 * pitch, now);
        filter.Q.setValueAtTime(2.0, now);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
        
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.25);
        osc2.stop(now + 0.25);
    }
    
    playExplosion(intensity = 1.0) {
        this.init();
        if (!this.ctx) return;
        
        const now = this.ctx.currentTime;
        const duration = 0.8 * intensity;
        
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.exponentialRampToValueAtTime(10, now + duration);
        
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        
        noise.start(now);
        noise.stop(now + duration);
    }
    
    playWin(level = 1) {
        this.init();
        if (!this.ctx) return;
        
        const now = this.ctx.currentTime;
        
        for (let i = 0; i < level; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523 + i * 130, now + i * 0.1);
            
            gain.gain.setValueAtTime(0.15, now + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.2);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.2);
        }
    }
}

const hueglotAudio = new HueglotAudio();

function triggerHueglotBark() {
    hueglotAudio.playBark();
    
    let img = document.getElementById('hueglot-img');
    let speech = document.getElementById('hueglot-speech');
    
    if (img) {
        img.classList.add('hueglot-shake-light');
        setTimeout(function() {
            img.classList.remove('hueglot-shake-light');
        }, 400);
    }
    
    if (speech) {
        let texts = ["ГАВ!", "ДЕП!", "ДОДЕП!", "ГАВ-ГАВ!", "WOOF!", "ТЯВ!", "ПВЛПОППШИМВ ГАВ!"];
        speech.innerText = texts[Math.floor(Math.random() * texts.length)];
        speech.style.opacity = '1';
        speech.style.transform = 'translateX(-50%) scale(1.1)';
        
        setTimeout(function() {
            speech.style.opacity = '0';
            speech.style.transform = 'translateX(-50%) scale(0)';
        }, 800);
    }
}

function triggerHueglotWin(level) {
    if (typeof level === 'undefined') level = 1;
    
    let img = document.getElementById('hueglot-img');
    let speech = document.getElementById('hueglot-speech');
    
    if (!img) return;
    
    hueglotAudio.playWin(level);
    
    if (level >= 3) {
        if (speech) {
            speech.innerText = "МЕГА-ГАВ!";
            speech.style.opacity = '1';
            speech.style.transform = 'translateX(-50%) scale(1.1)';
        }
        img.classList.add('hueglot-shake-heavy');
        setTimeout(function() {
            img.classList.remove('hueglot-shake-heavy');
            if (speech) {
                speech.style.opacity = '0';
                speech.style.transform = 'translateX(-50%) scale(0)';
            }
        }, 800);
    } else if (level === 2) {
        if (speech) {
            speech.innerText = "ГАВ-ГАВ!";
            speech.style.opacity = '1';
            speech.style.transform = 'translateX(-50%) scale(1.1)';
        }
        img.classList.add('hueglot-shake-win');
        setTimeout(function() {
            img.classList.remove('hueglot-shake-win');
            if (speech) {
                speech.style.opacity = '0';
                speech.style.transform = 'translateX(-50%) scale(0)';
            }
        }, 400);
    } else {
        if (speech) {
            speech.innerText = "ГАВ!";
            speech.style.opacity = '1';
            speech.style.transform = 'translateX(-50%) scale(1.1)';
        }
        img.classList.add('hueglot-shake-win');
        setTimeout(function() {
            img.classList.remove('hueglot-shake-win');
            if (speech) {
                speech.style.opacity = '0';
                speech.style.transform = 'translateX(-50%) scale(0)';
            }
        }, 400);
    }
}

function triggerHueglotExplosion() {
    let img = document.getElementById('hueglot-img');
    if (!img) return;
    
    hueglotAudio.playExplosion(1.5);
    img.classList.add('hueglot-exploding');
    
    spawnHueglotParticles();
    
    setTimeout(function() {
        img.classList.remove('hueglot-exploding');
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';
    }, 600);
}

function spawnHueglotParticles() {
    let canvas = document.getElementById('hueglot-canvas');
    if (!canvas) return;
    
    let ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 300;
    
    let particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: 150,
            y: 150,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 0.5) * 15 - 5,
            size: 3 + Math.random() * 10,
            alpha: 1,
            color: ['#f59e0b', '#ef4444', '#fbbf24', '#ffffff', '#ffd700'][Math.floor(Math.random() * 5)]
        });
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.3;
            p.alpha -= 0.02;
            
            if (p.alpha > 0) {
                alive = true;
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        if (alive) {
            requestAnimationFrame(animateParticles);
        }
    }
    
    requestAnimationFrame(animateParticles);
}

function triggerHueglotByWin(multiplier) {
    if (multiplier >= 1000n) {
        triggerHueglotExplosion();
        triggerHueglotWin(3);
    } else if (multiplier >= 200n) {
        triggerHueglotWin(2);
    } else if (multiplier >= 50n) {
        triggerHueglotWin(1);
    }
}

// ==================== ВЗРЫВ БУКВ И РЫЧАГА ПРИ ВЫИГРЫШЕ ====================
function triggerWinEffects(multiplier) {
    if (isLowPcMode()) return;
    
    let boxes = document.querySelectorAll('.slot-box');
    boxes.forEach(function(box, index) {
        box.style.setProperty('--lx', (Math.random() - 0.5) * 100 + 'px');
        box.style.setProperty('--ly', (Math.random() - 0.5) * 100 - 30 + 'px');
        box.style.setProperty('--lr', (Math.random() - 0.5) * 2 + 'rad');
        
        if (multiplier >= 1000n) {
            box.classList.add('win-mega-explode');
            setTimeout(function() { box.classList.remove('win-mega-explode'); }, 800);
        } else if (multiplier >= 200n) {
            box.classList.add('win-mega-explode');
            setTimeout(function() { box.classList.remove('win-mega-explode'); }, 800);
        } else if (multiplier >= 50n) {
            box.classList.add('win-explode');
            setTimeout(function() { box.classList.remove('win-explode'); }, 500);
        }
    });
    
    let lever = document.getElementById('lever-stick');
    let ball = lever ? lever.querySelector('.lever-ball') : null;
    
    if (lever && ball) {
        if (multiplier >= 1000n) {
            lever.classList.add('explode');
            ball.classList.add('mega-glow');
            setTimeout(function() {
                lever.classList.remove('explode');
                ball.classList.remove('mega-glow');
            }, 600);
        } else if (multiplier >= 200n) {
            lever.classList.add('mega-shake');
            ball.classList.add('win-glow');
            setTimeout(function() {
                lever.classList.remove('mega-shake');
                ball.classList.remove('win-glow');
            }, 800);
        } else if (multiplier >= 50n) {
            lever.classList.add('win-shake');
            ball.classList.add('win-glow');
            setTimeout(function() {
                lever.classList.remove('win-shake');
                ball.classList.remove('win-glow');
            }, 500);
        }
    }
    
    let card = document.querySelector('.casino-card');
    if (card) {
        if (multiplier >= 1000n) {
            card.classList.add('mega-win-background');
            setTimeout(function() { card.classList.remove('mega-win-background'); }, 5000);
        } else if (multiplier >= 50n) {
            card.classList.add('win-background');
            setTimeout(function() { card.classList.remove('win-background'); }, 1500);
        }
    }
    
    if (multiplier >= 200n) {
        spawnWinParticles(multiplier);
    }
}

function spawnWinParticles(multiplier) {
    if (isLowPcMode()) return;
    
    let canvas = document.getElementById('win-particles-canvas');
    if (!canvas) return;
    
    let ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let count = multiplier >= 1000n ? 80 : 40;
    let particles = [];
    
    for (let i = 0; i < count; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20 - 10,
            size: 3 + Math.random() * 8,
            alpha: 1,
            color: ['#ff0000', '#ff3333', '#ff6666', '#ff9900', '#ffcc00'][Math.floor(Math.random() * 5)]
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2;
            p.alpha -= 0.015;
            
            if (p.alpha > 0) {
                alive = true;
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.shadowBlur = 15;
                ctx.shadowColor = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        ctx.shadowBlur = 0;
        if (alive) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

// ==================== РЕЖИМ ДЛЯ СЛАБЫХ ПК ====================
function toggleLowPcMode() {
    let checkbox = document.getElementById('low-pc-checkbox');
    if (checkbox.checked) {
        document.getElementById('low-pc-modal').style.display = 'flex';
    }
}

function closeLowPcModal() {
    document.getElementById('low-pc-modal').style.display = 'none';
    document.getElementById('low-pc-checkbox').checked = false;
}

function applyLowPcMode() {
    localStorage.setItem('low_pc_mode', 'true');
    location.reload();
}

function isLowPcMode() {
    return localStorage.getItem('low_pc_mode') === 'true';
}

function disableLowPcMode() {
    localStorage.removeItem('low_pc_mode');
    location.reload();
}

if (isLowPcMode()) {
    let style = document.createElement('style');
    style.id = 'low-pc-style';
    style.textContent = `
        body {
            background-color: #0b0c0d !important;
            background-image: none !important;
        }
        .casino-card {
            background-color: #141619 !important;
            border: 1px solid #1f2326 !important;
            box-shadow: 0 0 20px rgba(0, 255, 100, 0.05) !important;
        }
        .balance-main {
            color: #4ef060 !important;
            text-shadow: none !important;
        }
        .slot-box {
            background-color: #202428 !important;
            border: 2px solid #31373e !important;
            color: #4ef060 !important;
            text-shadow: none !important;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5) !important;
        }
        select, input {
            background-color: #202428 !important;
            border: 1px solid #31373e !important;
            color: #ffffff !important;
            box-shadow: none !important;
        }
        .lever-base {
            background: linear-gradient(180deg, #2a2a2a, #1a1a1a) !important;
            border: 2px solid #444 !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important;
        }
        .lever-ball {
            background: radial-gradient(circle at 35% 35%, #ff4444, #990000) !important;
            box-shadow: 0 4px 12px rgba(255,0,0,0.6) !important;
        }
        .win-background, .mega-win-background {
            animation: none !important;
        }
        #win-particles-canvas {
            display: none !important;
        }
        #hueglot-canvas {
            display: none !important;
        }
        .hueglot-exploding, .hueglot-shake-heavy, .hueglot-shake-light, .hueglot-shake-win {
            animation: none !important;
        }
        .slot-box.win-explode, .slot-box.win-mega-explode {
            animation: none !important;
        }
        .lever-stick.win-shake, .lever-stick.mega-shake, .lever-stick.explode {
            animation: none !important;
        }
        .lever-ball.win-glow, .lever-ball.mega-glow {
            box-shadow: 0 4px 12px rgba(255,0,0,0.6) !important;
        }
    `;
    document.head.appendChild(style);
    
    let indicator = document.getElementById('low-pc-toggle');
    if (indicator) {
        indicator.innerHTML = `
            <label style="display:flex; align-items:center; gap:5px; cursor:pointer; background:#1a0000; padding:8px 12px; border-radius:8px; border:1px solid #00cc52; font-size:11px; color:#00cc52; font-family:'Inter',sans-serif;">
                <span>✅ Слабый ПК</span>
                <button onclick="disableLowPcMode()" style="background:none; border:none; color:#ff0000; cursor:pointer; font-size:14px; padding:0; margin:0;">✕</button>
            </label>
        `;
    }
    
    console.log('💻 Режим для слабых ПК активирован!');
}

console.log('🐕 Хуеглот загружен и готов к гаву!');
console.log('💥 Система взрывов активирована!');
console.log('✅ Script.js полностью загружен!');
