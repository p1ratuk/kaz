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
let isPullingLever = false;
let belarusMode = false;
let belarusTimer = null;
let belarusMinutesLeft = 0;

// Переменные для рычага
let leverDragging = false;
let leverStartY = 0;
let leverPulled = false;

let achievements = {
    "first_thousand": { name: "🥉 Первая тысяча", desc: "Накопить 1 000 рублей", unlocked: false, icon: "💵", date: null },
    "first_million": { name: "🥈 Первый лям", desc: "Накопить 1 000 000 рублей", unlocked: false, icon: "💰", date: null },
    "billionaire": { name: "🥇 Миллиардер", desc: "Накопить 1 000 000 000 рублей", unlocked: false, icon: "💎", date: null },
    "trillionaire": { name: "👑 Триллионер", desc: "Накопить 1 000 000 000 000 рублей", unlocked: false, icon: "👑", date: null },
    "quadrillionaire": { name: "🌟 Квадриллионер", desc: "Накопить 1 000 000 000 000 000 рублей", unlocked: false, icon: "🌟", date: null },
    "sukabank_victim": { name: "🚫 Жертва СУКАбанка", desc: "Получить блокировку карты", unlocked: false, icon: "💳", date: null },
    "big_winner": { name: "🎰 Крупный выи
