const GIST_RAW_URL='PASTE_YOUR_GIST_RAW_URL_HERE';
const REFRESH_MS=5000;
const fallback={
 companyName:'VALORA',tagline:'Tu aliado financiero.',
 telegramUrl:'https://t.me/REPLACE_WITH_YOUR_TELEGRAM',
 texts:{
  eyebrow:'PAGOS DIGITALES',heroTitle:'Paga de forma rápida, segura',heroAccent:'y sin complicaciones',
  heroText:'Realiza tu pago escaneando el código QR desde tu aplicación bancaria favorita.',
  benefit1Title:'Pago seguro',benefit1Text:'Tus datos siempre protegidos',benefit2Title:'Rápido',benefit2Text:'Confirmación en segundos',
  benefit3Title:'Confiable',benefit3Text:'Información verificada',telegramButton:'Contactar en Telegram',
  paymentTitle:'Información de pago',paymentSubtitle:'Datos para realizar tu operación',copyAll:'Copiar todo',
  holder:'Titular',bank:'Banco',account:'Número de cuenta',cci:'CCI',
  paymentWarning:'Verifica cuidadosamente la información antes de realizar tu operación.',
  qrTitle:'Escanea para pagar',qrSubtitle:'Usa tu app bancaria para escanear este código QR',
  qrStatus:'QR listo para escanear',refresh:'Actualizar datos',
  trust1Title:'Seguridad garantizada',trust1Text:'Conexión cifrada y protegida',
  trust2Title:'Datos verificados',trust2Text:'Información actualizada en tiempo real',
  trust3Title:'Soporte disponible',trust3Text:'Estamos para ayudarte siempre',
  followText:'Contáctanos',securityFooter:'Tu seguridad es nuestra prioridad',copyright:'© 2026 VALORA · Perú'
 },
 payment:{name:'VALORA SAC',bank:'BCP',account:'123456789',cci:'00212345678901234567',qrImage:'https://raw.githubusercontent.com/cbale7218-bot/valora-qr/main/payment-qr.png'}
};
const $=id=>document.getElementById(id);
function txt(id,v){if($(id))$(id).textContent=v??''}
function render(c){
 const t=c.texts||{},p=c.payment||{};
 txt('companyName',c.companyName);txt('tagline',c.tagline);txt('footerName',c.companyName);txt('footerTagline',c.tagline);
 ['eyebrow','heroTitle','heroAccent','heroText','benefit1Title','benefit1Text','benefit2Title','benefit2Text','benefit3Title','benefit3Text','telegramButton'].forEach(k=>txt(k==='telegramButton'?'telegramTopText':k,t[k]));
 txt('telegramFooter',t.followText||'Telegram');txt('paymentTitle',t.paymentTitle);txt('paymentSubtitle',t.paymentSubtitle);txt('copyAllText',t.copyAll);
 txt('labelName',t.holder);txt('labelBank',t.bank);txt('labelAccount',t.account);txt('labelCCI',t.cci);txt('paymentWarning',t.paymentWarning);
 txt('qrTitle',t.qrTitle);txt('qrSubtitle',t.qrSubtitle);txt('qrStatus',t.qrStatus);txt('refreshText',t.refresh);
 ['trust1Title','trust1Text','trust2Title','trust2Text','trust3Title','trust3Text','followText','securityFooter','copyright'].forEach(k=>txt(k,t[k]));
 $('paymentName').textContent=p.name||'—';$('paymentBank').textContent=p.bank||'—';$('paymentAccount').textContent=p.account||'—';$('paymentCCI').textContent=p.cci||'—';
 $('telegramTop').href=c.telegramUrl||'#';$('telegramFooter').href=c.telegramUrl||'#';
 const img=$('qrImage');img.style.display='block';img.src=p.qrImage?(p.qrImage+(p.qrImage.includes('?')?'&':'?')+'v='+Date.now()):'';img.onerror=()=>{img.style.display='none';txt('qrStatus','QR no disponible')};
}
async function load(){
 if(!GIST_RAW_URL||GIST_RAW_URL.includes('PASTE_YOUR_GIST_RAW_URL_HERE')){render(fallback);txt('updatedText','Gist aún no configurado');return}
 try{const r=await fetch(GIST_RAW_URL+(GIST_RAW_URL.includes('?')?'&':'?')+'v='+Date.now(),{cache:'no-store'});if(!r.ok)throw Error(r.status);render(await r.json());txt('updatedText','Datos actualizados: '+new Date().toLocaleTimeString())}
 catch(e){console.error(e);render(fallback);txt('updatedText','No se pudo actualizar el Gist')}
}
$('refreshButton').onclick=load;
$('copyAll').onclick=()=>navigator.clipboard?.writeText(`Titular: ${$('paymentName').textContent}\nBanco: ${$('paymentBank').textContent}\nCuenta: ${$('paymentAccount').textContent}\nCCI: ${$('paymentCCI').textContent}`);
document.querySelectorAll('[data-copy]').forEach(b=>b.onclick=()=>navigator.clipboard?.writeText($(b.dataset.copy).textContent));
render(fallback);load();setInterval(load,REFRESH_MS);
