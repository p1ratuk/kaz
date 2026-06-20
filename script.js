// ================= НАСТРОЙКА =================
const SECRET_PLUS_AMOUNT = 10000000000000000000000000n; 
const SECRET_MULTIPLY_BY = 2n;
const SPIN_COOLDOWN = 500;
const SECRET_KEY = "sukabank_dep_1488_zaebis_2024_huy_tebe_v_console_pidor";
// =============================================

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
    "pidoras_combo": { name: "🌈 ПИДОРАС", desc: "Собрать комбинацию ПИДОРАС", unlocked: false, icon: "🌈", date: null },
    "huyhuy_combo": { name: "💀 ХУЙХУЙ", desc: "Собрать комбинацию ХУЙХУЙ", unlocked: false, icon: "💀", date: null }
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

// Пособие раз в минуту
setInterval(() => {
    if (!belarusMode) {
        balance += 10000n;
        taxesPaid = false;
        saveGame();
        updateUI();
    }
}, 10000);

// Стипендия 5к каждую минуту
setInterval(() => {
    if (!belarusMode) {
        balance += 5000n;
        saveGame();
        updateUI();
    }
}, 10000);

// Оплата учёбы 500к каждые 12 минут
setInterval(() => {
    if (!belarusMode && balance >= 500000n) {
        balance -= 500000n;
        alert("📚 Списание 500 000 руб. за учёбу!");
        saveGame();
        updateUI();
    } else if (!belarusMode && balance < 500000n && balance > 0n) {
        alert("📚 Не хватает денег на учёбу! СУКАбанк начисляет пени!");
        balance = 0n;
        saveGame();
        updateUI();
    }
}, 720000);

// Списание в Безналогии
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
    // Всегда 7 слотов
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
    let num = BigInt(value);
    if (num < 0n) return "0 руб.";
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
    if (infinityLevel === 1000) return "♾️×1000 ТЫСЯЧА БЕСКОНЕЧНОСТЕЙ";
    if (infinityLevel === 1000000) return "♾️×1M МИЛЛИОН БЕСКОНЕЧНОСТЕЙ";
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

function updateUI() {
    document.getElementById("balance-display").innerText = `баланс: ${balance.toString()} руб.`;
    
    let textForm = formatBigNumber(balance);
    let distanceText = "";
    
    if (balance >= maxJsNumber) {
        distanceText = "ты превзошел лимиты вселенной";
    } else {
        let remaining = maxJsNumber - balance;
        distanceText = formatBigNumber(remaining);
    }
    
    document.getElementById("balance-letters-display").innerHTML = `
        прописью: <span style="color: #ccc;">${textForm} руб.</span><br>
        до бесконечности: <span style="color: #ccc;">${distanceText} руб.</span>
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
    let isLucky = Math.random() < 0.25;
    
    if (isLucky) {
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
        
        // Проверка комбинаций
        if (currentWord === "ПИДОРАС") {
            multiplier = 100n;
            winAmount = bet * multiplier;
            balance += winAmount;
            totalWon += winAmount;
            winsCount++;
            loseStreak = 0;
            unlockAchievement('pidoras_combo');
            resultDisplay.innerHTML = `🌈 ПИДОРАС! МЕГА-КОМБО x100! (+${winAmount.toString()} руб.)`;
        } else if (currentWord.substring(0, 6) === "ХУЙХУЙ" || currentWord.includes("ХУЙХУЙ")) {
            multiplier = 100n;
            winAmount = bet * multiplier;
            balance += winAmount;
            totalWon += winAmount;
            winsCount++;
            loseStreak = 0;
            unlockAchievement('huyhuy_combo');
            resultDisplay.innerHTML = `💀 ХУЙХУЙ! МЕГА-КОМБО x100! (+${winAmount.toString()} руб.)`;
        } else if (currentWord.includes(target)) {
            multiplier = 200n;
            winAmount = bet * multiplier;
            balance += winAmount;
            totalWon += winAmount;
            winsCount++;
            loseStreak = 0;
            resultDisplay.innerHTML = `🎉 ЦЕЛЬ ЖИЗНИ ДОСТИГНУТА! ты собрал ${target}! МЕГА-ИКС x200! (+${winAmount.toString()} руб.)`;
        } else if (currentWord.includes("ХУЙ") || currentWord.includes("ПИДОР") || currentWord.includes("ЕБЛАН")) {
            multiplier = 50n;
            winAmount = bet * multiplier;
            balance += winAmount;
            totalWon += winAmount;
            winsCount++;
            loseStreak = 0;
            resultDisplay.innerHTML = `🎉 ТРОИЦА! x50! (+${winAmount.toString()} руб.)`;
        }
        
        if (multiplier > 0n) {
            if (!belarusMode) {
                unpaidWinsCount++;
            }
            
            if (winAmount >= 1000000n) unlockAchievement('big_winner');
            
            if (unpaidWinsCount >= 15 && !belarusMode) {
                setTimeout(() => triggerTaxPhone(), 1500);
            }
        } else {
            lossesCount++;
            loseStreak++;
            resultDisplay.innerText = "мимо! крути еще!";
            
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

// Кнопка вылечить лудоманию (уворачивается)
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

// ГИПНО-РЫЧАГ (качается каждые 2 минуты)
setInterval(() => {
    let stick = document.getElementById('lever-stick');
    let ball = stick.querySelector('.lever-ball');
    
    // Гипно-качание
    stick.style.transition = 'transform 1.5s ease-in-out';
    stick.style.transform = 'rotate(15deg)';
    
    if (ball) {
        ball.style.boxShadow = '0 0 30px rgba(255,0,255,1), 0 0 60px rgba(255,0,255,0.8)';
        ball.style.background = 'radial-gradient(circle at 35% 35%, #ff00ff, #990099)';
    }
    
    setTimeout(() => {
        stick.style.transform = 'rotate(-15deg)';
    }, 1500);
    
    setTimeout(() => {
        stick.style.transform = 'rotate(10deg)';
    }, 3000);
    
    setTimeout(() => {
        stick.style.transform = 'rotate(-10deg)';
    }, 4500);
    
    setTimeout(() => {
        stick.style.transform = 'rotate(0deg)';
        if (ball) {
            ball.style.boxShadow = '0 4px 12px rgba(255,0,0,0.6)';
            ball.style.background = 'radial-gradient(circle at 35% 35%, #ff4444, #990000)';
        }
    }, 6000);
}, 120000); // Каждые 2 минуты

function updateUI() {
    document.getElementById("balance-display").innerText = `баланс: ${balance.toString()} руб.`;
    
    let textForm = formatBigNumber(balance);
    let distanceText = "";
    
    // Считаем сколько до следующего уровня
    let nextLevelText = getNextLevelInfo(balance);
    
    if (balance >= maxJsNumber) {
        distanceText = "ты превзошел лимиты вселенной";
    } else {
        let remaining = maxJsNumber - balance;
        distanceText = formatBigNumber(remaining);
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
}

// Получить информацию о следующем уровне
function getNextLevelInfo(num) {
    let str = num.toString();
    let length = str.length;
    let currentIndex = Math.floor((length - 1) / 3);
    
    // Если мы в обычных числах (до дохерархи)
    if (currentIndex < 24) {
        let nextIndex = currentIndex + 1;
        let nextLevelValue = BigInt('1' + '0'.repeat(nextIndex * 3));
        let diff = nextLevelValue - num;
        if (diff > 0n) {
            return `📊 До ${shortNames[nextIndex]}: ещё ${formatBigNumber(diff)}`;
        }
    }
    
    // Если мы в дохерархи и выше
    if (currentIndex >= 24 && currentIndex < shortNames.length - 1) {
        let nextIndex = currentIndex + 1;
        let currentValue = BigInt('1' + '0'.repeat(currentIndex * 3));
        let nextValue = BigInt('1' + '0'.repeat(nextIndex * 3));
        let diff = nextValue - num;
        if (diff > 0n) {
            return `📊 До ${shortNames[nextIndex]}: ещё ${formatBigNumber(diff)}`;
        }
    }
    
    // Если мы на БЕСКОНЕЧНОСТИ
    if (currentIndex >= shortNames.length - 1) {
        return "♾️ Ты достиг бесконечности!";
    }
    
    // Если дальше некуда
    return "🎉 Ты на максимальном уровне!";
}

// ИЛЛЮЗИОНИРОВАНИЕ НА ПОЛНЫЙ ЭКРАН
let illusionActive = false;
let illusionInterval = null;

function startIllusion() {
    if (illusionActive) return;
    illusionActive = true;
    
    let stick = document.getElementById('lever-stick');
    let ball = stick.querySelector('.lever-ball');
    
    // Мерцание экрана
    let overlay = document.createElement('div');
    overlay.id = 'illusion-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: radial-gradient(circle, transparent 50%, rgba(255,0,255,0.3) 100%);
        z-index: 9999; pointer-events: none;
        animation: illusionPulse 2s infinite;
    `;
    document.body.appendChild(overlay);
    
    // Текст "НАЖМИ F11"
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
    
    // Рычаг светится
    if (ball) {
        ball.style.boxShadow = '0 0 50px rgba(255,0,255,1), 0 0 100px rgba(255,0,255,0.8)';
        ball.style.background = 'radial-gradient(circle at 35% 35%, #ff00ff, #660066)';
    }
    
    // Убираем через 5 секунд
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

// Запускаем иллюзию каждые 3 минуты
setInterval(() => {
    startIllusion();
}, 180000);

// Первый запуск через минуту
setTimeout(() => {
    startIllusion();
}, 60000);
