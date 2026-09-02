const GIST_RAW_URL = 'https://gist.githubusercontent.com/cbale7218-bot/c9fb99d723dffd3436f25f1dfc54c4da/raw/gistfile1.txt';
const REFRESH_MS = 5000;

const fallback = {
  companyName: 'VALORA',
  tagline: 'Tu aliado financiero.',
  telegramUrl: 'https://t.me/REPLACE_WITH_YOUR_TELEGRAM',
  texts: {
    eyebrow: 'PAGOS DIGITALES', heroTitle: 'Paga de forma rápida, segura', heroAccent: 'y sin complicaciones',
    heroText: 'Realiza tu pago escaneando el código QR desde tu aplicación bancaria favorita.',
    benefit1Title: 'Pago seguro', benefit1Text: 'Tus datos siempre protegidos',
    benefit2Title: 'Rápido', benefit2Text: 'Confirmación en segundos',
    benefit3Title: 'Confiable', benefit3Text: 'Información verificada',
    telegramButton: 'Contactar en Telegram', paymentTitle: 'Información de pago',
    paymentSubtitle: 'Datos para realizar tu operación', copyAll: 'Copiar todo', copySuccess: '¡Copiado!',
    holder: 'Titular', bank: 'Banco', account: 'Número de cuenta', cci: 'CCI',
    paymentWarning: 'Verifica cuidadosamente la información antes de realizar tu operación.',
    qrTitle: 'Escanea para pagar', qrSubtitle: 'Usa tu app bancaria para escanear este código QR',
    qrStatus: 'QR listo para escanear', qrUnavailable: 'QR no disponible', refresh: 'Actualizar datos',
    trust1Title: 'Seguridad garantizada', trust1Text: 'Conexión cifrada y protegida',
    trust2Title: 'Datos verificados', trust2Text: 'Información actualizada en tiempo real',
    trust3Title: 'Soporte disponible', trust3Text: 'Estamos para ayudarte siempre',
    followText: 'Contáctanos', securityFooter: 'Tu seguridad es nuestra prioridad', copyright: '© 2026 VALORA · Perú'
  },
  payment: {
    name: 'VALORA SAC', bank: 'BCP', account: '123456789', cci: '00212345678901234567',
    qrImage: 'https://raw.githubusercontent.com/cbale7218-bot/valora-qr/main/payment-qr.png'
  },
  design: {
    primaryColor: '#1F9BFF', accentColor: '#7657FF', successColor: '#20E6D5',
    backgroundColor: '#07111F', panelColor: '#111F34', textColor: '#F4F8FF', mutedColor: '#9AACBF',
    borderRadius: '16px', buttonRadius: '11px'
  }
};

const $ = id => document.getElementById(id);
const safe = (v, fallbackValue = '') => v == null ? fallbackValue : String(v);

function txt(id, value) {
  const el = $(id);
  if (el) el.textContent = safe(value);
}

function applyDesign(d = {}) {
  const root = document.documentElement;
  const vars = {
    '--primary': d.primaryColor,
    '--accent': d.accentColor,
    '--success': d.successColor,
    '--bg': d.backgroundColor,
    '--panel-color': d.panelColor,
    '--text': d.textColor,
    '--muted': d.mutedColor,
    '--radius': d.borderRadius,
    '--button-radius': d.buttonRadius
  };
  Object.entries(vars).forEach(([name, value]) => {
    if (value) root.style.setProperty(name, value);
  });
}

function render(c) {
  const t = c.texts || {};
  const p = c.payment || {};
  applyDesign(c.design || {});

  txt('companyName', c.companyName); txt('tagline', c.tagline);
  txt('footerName', c.companyName); txt('footerTagline', c.tagline);

  ['eyebrow','heroTitle','heroAccent','heroText','benefit1Title','benefit1Text','benefit2Title','benefit2Text','benefit3Title','benefit3Text']
    .forEach(k => txt(k, t[k]));
  txt('telegramTopText', t.telegramButton);
  txt('telegramFooter', t.followText || 'Telegram');
  txt('paymentTitle', t.paymentTitle); txt('paymentSubtitle', t.paymentSubtitle); txt('copyAllText', t.copyAll);
  txt('labelName', t.holder); txt('labelBank', t.bank); txt('labelAccount', t.account); txt('labelCCI', t.cci);
  txt('paymentWarning', t.paymentWarning); txt('qrTitle', t.qrTitle); txt('qrSubtitle', t.qrSubtitle);
  txt('qrStatus', t.qrStatus); txt('refreshText', t.refresh);
  ['trust1Title','trust1Text','trust2Title','trust2Text','trust3Title','trust3Text','followText','securityFooter','copyright']
    .forEach(k => txt(k, t[k]));

  txt('paymentName', p.name || '—'); txt('paymentBank', p.bank || '—');
  txt('paymentAccount', p.account || '—'); txt('paymentCCI', p.cci || '—');

  const telegram = c.telegramUrl || '#';
  $('telegramTop').href = telegram;
  $('telegramFooter').href = telegram;

  const img = $('qrImage');
  if (p.qrImage) {
    img.style.display = 'block';
    img.src = p.qrImage + (p.qrImage.includes('?') ? '&' : '?') + 'v=' + Date.now();
    img.onerror = () => {
      img.style.display = 'none';
      txt('qrStatus', t.qrUnavailable || 'QR no disponible');
    };
  } else {
    img.style.display = 'none';
    txt('qrStatus', t.qrUnavailable || 'QR no disponible');
  }
}

async function load() {
  if (!GIST_RAW_URL) {
    render(fallback);
    txt('updatedText', 'Gist no configurado');
    return;
  }
  try {
    const url = GIST_RAW_URL + (GIST_RAW_URL.includes('?') ? '&' : '?') + 'v=' + Date.now();
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const data = await r.json();
    render(data);
    txt('updatedText', 'Datos actualizados: ' + new Date().toLocaleTimeString());
  } catch (e) {
    console.error('Gist error:', e);
    // Keep the last successfully rendered values instead of replacing them with fallback data.
    txt('updatedText', 'No se pudo actualizar · mostrando últimos datos');
  }
}

function legacyCopy(text) {
  return new Promise((resolve, reject) => {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.focus();
    area.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (_) {}
    area.remove();
    ok ? resolve() : reject(new Error('copy failed'));
  });
}

async function copyText(text) {
  if (!text) throw new Error('empty text');
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  await legacyCopy(text);
}

function showCopied(button) {
  const original = button.dataset.originalText || button.textContent.trim();
  button.dataset.originalText = original;
  const t = window.__config?.texts || fallback.texts;
  button.textContent = t.copySuccess || '¡Copiado!';
  button.classList.add('copied');
  clearTimeout(button._copyTimer);
  button._copyTimer = setTimeout(() => {
    button.textContent = original;
    button.classList.remove('copied');
  }, 1400);
}

async function handleCopy(button, text) {
  try {
    await copyText(text);
    showCopied(button);
  } catch (e) {
    console.error(e);
    button.textContent = 'Selecciona y copia';
    setTimeout(() => button.textContent = button.dataset.originalText || 'Copiar', 1800);
  }
}

$('refreshButton').addEventListener('click', async () => {
  const b = $('refreshButton');
  b.disabled = true;
  await load();
  setTimeout(() => b.disabled = false, 300);
});

$('copyAll').addEventListener('click', function () {
  const text = `Titular: ${$('paymentName').textContent}\nBanco: ${$('paymentBank').textContent}\nCuenta: ${$('paymentAccount').textContent}\nCCI: ${$('paymentCCI').textContent}`;
  handleCopy(this, text);
});

document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', function () {
    const target = $(this.dataset.copy);
    handleCopy(this, target ? target.textContent.trim() : '');
  });
});

render(fallback);
window.__config = fallback;
load().then(() => {});
setInterval(load, REFRESH_MS);
