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
    try { let decoded = atob(encrypted); let decrypted = ''; for (let i = 0; i < decoded.length; i++) { decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length)); } return decrypted; } catch(e) { return null; }
}
function generateHash(data) { let hash = 0; for (let i = 0; i < data.length; i++) { hash = ((hash << 5) - hash) + data.charCodeAt(i); hash |= 0; } return hash.toString(); }

const maxJsNumber = 17976931348623157081452742373170435679807056752584499659891747680315726078002853876602841604862869853802707627511090146938459102431627447370420556114170685640321300057399439616010061329241517409249704289895240292376971510344482083512411547734028420155225345791771954714163901115161099238314115132219904229344n;
const shortNames = ["", "тыс.", "млн.", "млрд.", "трил.", "квадр.", "квинт.", "секстил.", "септили.", "октил.", "нонил.", "децил.", "ундецил.", "дуодецил.", "тредецил.", "кваттордецил.", "квиндецил.", "секстдецил.", "септемдецил.", "октодецил.", "нонемдецил.", "вигинтил."];
const alphabet = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";

let balance = 10000n, taxesPaid = true, cheatDetected = false, totalWon = 0n;
let spinsCount = 0, winsCount = 0, lossesCount = 0, canSpin = true;
let lastTaxPayment = Date.now(), f12Count = 0, unpaidWinsCount = 0, declaredBalance = 0n;
let isPullingLever = false, belarusMode = false, belarusTimer = null;
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
    "belarus_escape": { name: "🚜 Побег в Безналогию", desc: "Уехать из Казии и не платить налоги", unlocked: false, icon: "🚜", date: null }
};

function loadGame() {
    let ed = localStorage.getItem('ghetto_data_encrypted'), sh = localStorage.getItem('ghetto_hash');
    if (ed && sh) { let d = decryptData(ed); if (d && generateHash(d + SECRET_KEY) === sh) { try { let s = JSON.parse(d); balance = BigInt(s.balance||"10000"); taxesPaid = s.taxesPaid===true; lastTaxPayment = parseInt(s.lastTaxPayment||Date.now().toString()); spinsCount = parseInt(s.spinsCount||"0"); winsCount = parseInt(s.winsCount||"0"); lossesCount = parseInt(s.lossesCount||"0"); totalWon = BigInt(s.totalWon||"0"); f12Count = parseInt(s.f12Count||"0"); cheatDetected = s.f12Blocked===true; unpaidWinsCount = parseInt(s.unpaidWinsCount||"0"); return true; } catch(e) {} } else { blockSukabank(); return false; } } return false;
}
function loadAchievements() {
    let ea = localStorage.getItem('ghetto_achievements_encrypted'); if (ea) { let d = decryptData(ea); if (d) { try { let s = JSON.parse(d); Object.keys(s).forEach(k => { if (achievements[k]) { achievements[k].unlocked = s[k].unlocked; achievements[k].date = s[k].date; } }); } catch(e) {} } }
}

if (!loadGame()) { balance = 10000n; taxesPaid = true; lastTaxPayment = Date.now(); cheatDetected = false; }
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
        pullLever
