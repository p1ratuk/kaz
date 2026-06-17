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
    "секстдецил.", "септемдецил.", "октодецил.", "нонемдецил.", "вигинтил."
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
    "leet_balance": { name: "🤖 1337", desc: "Иметь баланс ровно 1337 (почти невозможно)", unlocked: false, icon: "🤖", date: null },
    "winrate_master": { name: "🎯 Мастер винрейта", desc: "Достигнуть винрейта 50% при 50+ спинах", unlocked: false, icon: "🎯", date: null },
    "unlucky_streak": { name: "😢 Лузстрик", desc: "Проиграть 10 раз подряд", unlocked: false, icon: "😢", date: null },
    "f12_detected": { name: "🕵️ Подозрительная активность", desc: "Нажать F12 и получить предупреждение", unlocked: false, icon: "⚠️", date: null }
};

let loseStreak = 0;

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

function handleF12Detection()
