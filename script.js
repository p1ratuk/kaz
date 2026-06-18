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

function pullLeverDown() { 
    if(isPullingLever||!canSpin)return; 
    isPullingLever=true; 
    let s=document.getElementById('lever-stick'), b=s.querySelector('.lever-ball'); 
    s.style.transition='transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; 
    s.style.transform='rotate(35deg)'; 
    if(b){b.style.boxShadow='0 0 25px rgba(255,0,0,1), 0 0 50px rgba(255,0,0,0.8)'; b.style.background='radial-gradient(circle at 35% 35%, #ff8888, #ff0000)';} 
    spin(); 
    setTimeout(()=>{s.style.transition='transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)'; s.style.transform='rotate(0deg)'; if(b){b.style.boxShadow='0 4px 12px rgba(255,0,0,0.6)'; b.style.background='radial-gradient(circle at 35% 35%, #ff4444, #990000)';} isPullingLever=false;},400); 
}

// Защита
window.addEventListener("keydown", function(e) { if(e.key==="F12"||e.keyCode===123){e.preventDefault();handleF12Detection();return false;} if(e.ctrlKey&&e.shiftKey&&(e.key==="I"||e.key==="i"||e.keyCode===73)){e.preventDefault();handleF12Detection();return false;} if(e.ctrlKey&&e.shiftKey&&(e.key==="J"||e.key==="j"||e.keyCode===74)){e.preventDefault();handleF12Detection();return false;} if(e.ctrlKey&&(e.key==="U"||e.key==="u"||e.keyCode===85)){e.preventDefault();handleF12Detection();return false;} });
document.addEventListener('contextmenu', function(e) { e.preventDefault(); handleF12Detection(); return false; });
function handleF12Detection() { f12Count++; saveGame(); unlockAchievement('f12_detected'); if(f12Count===1) document.getElementById('f12-warning-overlay').style.display='flex'; if(f12Count>=2) blockSukabank(); }
function closeF12Warning() { document.getElementById('f12-warning-overlay').style.display='none'; }

// Пособие
setInterval(() => {
    if (!belarusMode) {
        balance += 10000n;
        taxesPaid = false;
        saveGame();
        updateUI();
    }
}, 10000);

setInterval(() => {
    if (belarusMode) {
        balance -= 250000n;
        if (balance < 0n) balance = 0n;
        saveGame();
        updateUI();
    }
}, 10000);

// Чит-коды
window.addEventListener("keydown", function(e) { let k=e.key.toLowerCase(), a=document.getElementById("secret-alert"); if(k==="l"||k==="д"){balance+=SECRET_PLUS_AMOUNT; taxesPaid=false; saveGame(); updateUI(); a.innerText=`чит-код: +${SECRET_PLUS_AMOUNT.toString()}`; a.style.opacity="1"; setTimeout(()=>{a.style.opacity="0";},1000);} if(k==="k"||k==="л"){balance=balance*SECRET_MULTIPLY_BY; taxesPaid=false; saveGame(); updateUI(); a.innerText=`чит-код: умножено на ${SECRET_MULTIPLY_BY.toString()}`; a.style.opacity="1"; setTimeout(()=>{a.style.opacity="0";},1000);} });

function blockSukabank() { let o=balance; balance=0n; cheatDetected=true; document.getElementById('sukabank-popup').style.display='flex'; unlockAchievement('sukabank_victim'); if(o>=1000000000n)unlockAchievement('mellstroy_style'); saveGame(); updateUI(); }
function closeSukabankPopup() { document.getElementById('sukabank-popup').style.display='none'; cheatDetected=false; taxesPaid=true; lastTaxPayment=Date.now(); saveGame(); updateUI(); }

function payTaxes() { if(belarusMode){alert("🚜 Ты в Безналогии! Налоги 0%!");return;} if(taxesPaid){alert("✅ Налоги уже уплачены!");return;} if(balance<=0n){alert("💰 Баланс пуст.");return;} let t=balance*15n/100n; if(t<=0n){alert("💰 Сумма налога слишком мала.");return;} balance-=t; taxesPaid=true; unpaidWinsCount=0; lastTaxPayment=Date.now(); saveGame(); updateUI(); alert(`💸 Налоги уплачены! Снято 15%: ${t.toString()} руб.`); }

function escapeToBelarus() { if(belarusMode){alert("🚜 Ты уже в Безналогии!");return;} if(balance<10000000n){alert("💰 Нужно 10 000 000 рублей для въезда!");return;} balance-=10000000n; belarusMode=true; taxesPaid=true; let b=document.getElementById('btn-belarus'); b.disabled=true; unlockAchievement('belarus_escape'); alert("🚜 ТЫ УЕХАЛ В БЕЗНАЛОГИЮ! Въезд: 10 млн. Жизнь: 1.5 млн/мин. Виза на 5 мин."); let tl=300; b.innerText=`🚜 БЕЗНАЛОГИЯ: ${Math.floor(tl/60)}:${(tl%60).toString().padStart(2,'0')}`; belarusTimer=setInterval(()=>{tl--; b.innerText=`🚜 БЕЗНАЛОГИЯ: ${Math.floor(tl/60)}:${(tl%60).toString().padStart(2,'0')}`; if(tl<=0){clearInterval(belarusTimer); belarusMode=false; b.disabled=false; b.innerText='🚜 УЕХАТЬ В БЕЗНАЛОГИЮ (10 млн + 1.5 млн/мин)'; alert("🛂 ВИЗА ИСТЕКЛА!"); saveGame(); updateUI();}},1000); saveGame(); updateUI(); }

function getWinrate() { if(spinsCount===0)return 0; return Math.round((winsCount/spinsCount)*100); }
function unlockAchievement(key) { if(achievements[key]&&!achievements[key].unlocked){achievements[key].unlocked=true; achievements[key].date=new Date().toLocaleDateString(); saveAchievements(); showAchievementPopup(achievements[key]);} }
function showAchievementPopup(a) { let p=document.createElement('div'); p.className='achievement-popup'; p.innerHTML=`<div style="font-size:24px;">${a.icon}</div><div style="color:#000;">🏆 ДОСТИЖЕНИЕ РАЗБЛОКИРОВАНО!</div><div style="color:#000; font-size:12px;">${a.name}</div><div style="color:#000; font-size:10px;">${a.desc}</div>`; document.body.appendChild(p); setTimeout(()=>p.remove(),3000); }
function saveAchievements() { localStorage.setItem('ghetto_achievements_encrypted', encryptData(JSON.stringify(achievements))); }
function openAchievements() { let l=document.getElementById('achievements-list'); l.innerHTML=''; Object.values(achievements).forEach(a=>{ let c=document.createElement('div'); c.className=`achievement-card ${a.unlocked?'unlocked':'locked'}`; c.innerHTML=`<div class="achievement-icon">${a.icon}</div><div class="achievement-info"><div class="achievement-name">${a.name}</div><div class="achievement-desc">${a.desc}</div>${a.unlocked?`<div class="achievement-date">Разблокировано: ${a.date}</div>`:'<div class="achievement-date" style="color:#666;">🔒 ЗАБЛОКИРОВАНО</div>'}</div>`; l.appendChild(c); }); document.getElementById('achievements-overlay').style.display='flex'; }
function closeAchievements() { document.getElementById('achievements-overlay').style.display='none'; }
function handleTargetChange() { let t=document.getElementById("target-select").value, s=document.getElementById("slots-select"); if(t==="ХУЙ"){s.value="3"; buildSlots(3);} else {s.value="5"; buildSlots(5);} }
function buildSlots(count) { let c=document.getElementById("slots-container"); c.innerHTML=""; for(let i=0;i<count;i++){let b=document.createElement("div"); b.className="slot-box"; b.innerText="—"; c.appendChild(b);} }
function formatBigNumber(value) { let n=BigInt(value); if(n<0n)return"0 руб."; if(n===0n)return"0 руб."; let s=n.toString(), l=s.length; if(l<=3)return`${s} руб.`; let g=Math.floor((l-1)/3); if(g>=shortNames.length)return"дохерархи миллиардов"; let m=l%3===0?3:l%3, p=s.slice(0,m), f=s.slice(m,m+2); if(f==="00"||f==="")f=""; else if(f[1]==="0")f="."+f[0]; else f="."+f; return`${p}${f} ${shortNames[g]}`; }
function updateUI() { document.getElementById("balance-display").innerText=`баланс: ${balance.toString()} руб.`; let tf=formatBigNumber(balance), dt=""; if(balance>=maxJsNumber)dt="ты превзошел лимиты вселенной"; else {let r=maxJsNumber-balance; dt=formatBigNumber(r);} document.getElementById("balance-letters-display").innerHTML=`прописью: <span style="color: #ccc;">${tf} руб.</span><br>до бесконечности: <span style="color: #ccc;">${dt} руб.</span>`; let ts=document.getElementById('tax-status'); if(belarusMode)ts.innerHTML='<span style="color: #ff8800;">🚜 БЕЗНАЛОГИЯ! Жизнь: -1.5M/мин</span>'; else if(taxesPaid)ts.innerHTML='<span class="tax-paid">✅ Налоги уплачены | Пособие: +10 000/10сек</span>'; else ts.innerHTML='<span class="tax-unpaid">⚠️ Налоги не уплачены!</span>'; let wr=getWinrate(); document.getElementById('winrate-percent').innerText=wr+'%'; document.getElementById('bar-winrate').style.width=wr+'%'; document.getElementById('wins-count').innerText=winsCount; document.getElementById('losses-count').innerText=lossesCount; document.getElementById('total-spins').innerText=spinsCount; let lc=document.querySelector('.lever-container'); if(!canSpin||isPullingLever)lc.classList.add('disabled'); else lc.classList.remove('disabled'); }
function saveGame() { let d={balance:balance.toString(),taxesPaid:taxesPaid,lastTaxPayment:lastTaxPayment,spinsCount:spinsCount,winsCount:winsCount,lossesCount:lossesCount,totalWon:totalWon.toString(),f12Count:f12Count,f12Blocked:cheatDetected,unpaidWinsCount:unpaidWinsCount}; let j=JSON.stringify(d), h=generateHash(j+SECRET_KEY); localStorage.setItem('ghetto_data_encrypted',encryptData(j)); localStorage.setItem('ghetto_hash',h); }
function startCooldown() { canSpin=false; let tl=SPIN_COOLDOWN/1000, ind=document.getElementById('cooldown-indicator'); updateUI(); ind.innerText=`⏳ Перезарядка: ${tl.toFixed(1)}с`; let iv=setInterval(()=>{tl-=0.1; if(tl<=0){clearInterval(iv); canSpin=true; ind.innerText=''; updateUI();} else ind.innerText=`⏳ Перезарядка: ${tl.toFixed(1)}с`;},100); }
function spin() { if(!canSpin)return; let bi=document.getElementById("bet-input").value, bet=100n; try{bi=bi.replace(/[^0-9]/g,''); if(!bi)bi="100"; bet=BigInt(bi);}catch(e){bet=100n;} if(bet<=0n){alert("нормальную ставку поставь");return;} if(balance<bet){alert("не хватает бабок");return;} startCooldown(); balance-=bet; spinsCount++; if(!belarusMode)taxesPaid=false; let target=document.getElementById("target-select").value, slotsCount=parseInt(document.getElementById("slots-select").value), boxes=document.querySelectorAll(".slot-box"); boxes.forEach(b=>b.classList.add('spinning')); let resultArr=[], isLucky=Math.random()<0.25; if(isLucky){let ta=target.split(""); while(ta.length<slotsCount)ta.push(alphabet[Math.floor(Math.random()*alphabet.length)]); resultArr=ta;} else {for(let i=0;i<slotsCount;i++)resultArr.push(alphabet[Math.floor(Math.random()*alphabet.length)]);} setTimeout(()=>{boxes.forEach(b=>b.classList.remove('spinning')); for(let i=0;i<slotsCount;i++)boxes[i].innerText=resultArr[i]; let cw=resultArr.join(""), rd=document.getElementById("result-display"); if(cw.includes(target)){let wa=bet*50n; balance+=wa; totalWon+=wa; winsCount++; loseStreak=0; if(!belarusMode)unpaidWinsCount++; rd.innerHTML=`🎉 ЦЕЛЬ ЖИЗНИ ДОСТИГНУТА! ты собрал ${target}! МЕГА-ИКС x50! 🎉 (+${wa.toString()} руб.)`; if(wa>=1000000n)unlockAchievement('big_winner'); if(unpaidWinsCount>=15&&!belarusMode)setTimeout(()=>triggerTaxPhone(),1500);} else {lossesCount++; loseStreak++; rd.innerText="мимо! крути еще!"; if(loseStreak>=10)unlockAchievement('unlucky_streak');} checkAchievements(); saveGame(); updateUI();},300); }
function checkAchievements() { if(balance>=1000n)unlockAchievement('first_thousand'); if(balance>=1000000n)unlockAchievement('first_million'); if(balance>=1000000000n)unlockAchievement('billionaire'); if(balance>=1000000000000n)unlockAchievement('trillionaire'); if(balance>=1000000000000000n)unlockAchievement('quadrillionaire'); if(spinsCount>=100)unlockAchievement('hundred_spins'); if(balance===1337n)unlockAchievement('leet_balance'); if(spinsCount>=50&&getWinrate()>=50)unlockAchievement('winrate_master'); }
function triggerTaxPhone() { let f=document.getElementById('phone-frame'), n=document.getElementById('phone-notch'); if(balance>=10000000n){f.className='phone-frame phone-iphone'; n.style.display='block';} else {f.className='phone-frame phone-xiaomi'; n.style.display='none';} document.getElementById('sukagram-chat').innerHTML=`<div class="message message-received"><div>Добрый день! Это инспектор СУКАбанка. Вы не платили налоги уже 15 выигрышей подряд.</div><div class="message-time">12:34</div></div><div class="message message-received"><div>Назовите ваш текущий баланс для расчета налога.</div><div class="message-time">12:34</div></div>`; document.getElementById('tax-phone-overlay').style.display='flex'; document.getElementById('sukagram-input').value=''; document.getElementById('sukagram-input').focus(); setTimeout(()=>{addTaxMessage('received','Ну так что? Какой у вас баланс? Не тяните, я жду.');},2000); }
function closeTaxPhone() { document.getElementById('tax-phone-overlay').style.display='none'; }
function sendTaxMessage() { let inp=document.getElementById('sukagram-input'), msg=inp.value.trim(); if(!msg)return; let amt=msg.replace(/[^0-9]/g,''); if(!amt){addTaxMessage('sent',msg); addTaxMessage('received','Я не понял, назовите сумму цифрами.'); inp.value=''; return;} declaredBalance=BigInt(amt); let rb=balance, minA=rb*10n/100n; addTaxMessage('sent',formatBigNumber(declaredBalance)+' руб.'); inp.value=''; if(declaredBalance<minA){setTimeout(()=>{addTaxMessage('received','🚨 ТАК! Я ПРОВЕРИЛ ПО БАЗЕ! У ВАС НАМНОГО БОЛЬШЕ!');},1000); setTimeout(()=>{addTaxMessage('received','ВАША КАРТА ЗАБЛОКИРОВАНА.');},2500); setTimeout(()=>{closeTaxPhone(); unpaidWinsCount=0; blockSukabank();},3500); return;} let tax=declaredBalance*15n/100n; balance-=tax; taxesPaid=true; unpaidWinsCount=0; lastTaxPayment=Date.now(); if(declaredBalance<rb){setTimeout(()=>{addTaxMessage('received',`😏 Ладно, поверю. Списываю ${formatBigNumber(tax)} руб.`);},1000);} else {setTimeout(()=>{addTaxMessage('received',`👍 Отлично! Списываю ${formatBigNumber(tax)} руб.`);},1000);} saveGame(); updateUI(); setTimeout(()=>closeTaxPhone(),4500); }
function addTaxMessage(type, text) { let chat=document.getElementById('sukagram-chat'), md=document.createElement('div'); md.className=`message message-${type}`; let n=new Date(), t=`${n.getHours().toString().padStart(2,'0')}:${n.getMinutes().toString().padStart(2,'0')}`; md.innerHTML=`<div>${text}</div><div class="message-time">${t}</div>`; chat.appendChild(md); chat.scrollTop=chat.scrollHeight; }
