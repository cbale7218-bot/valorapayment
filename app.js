// VALORA — configuración remota mediante GitHub Gist
// IMPORTANTE: cambia SOLO esta URL una vez, por la URL RAW de tu Gist.
const GIST_RAW_URL = 'https://gist.githubusercontent.com/cbale7218-bot/c9fb99d723dffd3436f25f1dfc54c4da/raw/gistfile1.txt';

// Frecuencia de comprobación. 5000 = cada 5 segundos.
// El QR solo se redibuja cuando cambia el contenido.
const REFRESH_MS = 5000;

const DEFAULT_CONFIG = {
  companyName: 'VALORA',
  tagline: 'Tu aliado financiero.',
  payment: {
    name: 'CONFIGURA EN GIST',
    bank: 'CONFIGURA EN GIST',
    account: 'CONFIGURA EN GIST',
    cci: 'CONFIGURA EN GIST',
    qrImage: 'https://raw.githubusercontent.com/cbale7218-bot/valora-qr/main/payment-qr.png'
  }
};

let lastConfigText = '';
let refreshTimer = null;

const $ = (id) => document.getElementById(id);

function setText(id, value) {
  $(id).textContent = value ?? '—';
}

function cacheBust(url) {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${Date.now()}`;
}

function renderQR(qrImage, qrPayload) {
  const box = $('qrcode');
  box.innerHTML = '';

  // Preferred mode: bank-provided QR image (PNG/JPG).
  if (qrImage) {
    const img = document.createElement('img');
    img.alt = 'Código QR de pago';
    img.width = 210;
    img.height = 210;
    img.loading = 'eager';
    img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';
    img.src = cacheBust(String(qrImage));
    img.onload = () => { $('qrStatus').textContent = 'QR actualizado.'; };
    img.onerror = () => {
      box.innerHTML = '';
      $('qrStatus').textContent = 'No se pudo cargar el QR.';
    };
    box.appendChild(img);
    return;
  }

  // Backward compatibility: generate a QR from text payload if provided.
  if (qrPayload) {
    try {
      new QRCode(box, {
        text: String(qrPayload),
        width: 230,
        height: 230,
        correctLevel: QRCode.CorrectLevel.M
      });
      $('qrStatus').textContent = 'QR actualizado.';
    } catch (error) {
      console.error(error);
      $('qrStatus').textContent = 'No se pudo generar el QR.';
    }
    return;
  }

  $('qrStatus').textContent = 'QR no configurado.';
}

function renderConfig(config) {
  const payment = config.payment || {};
  const brand = config.companyName || 'VALORA';

  setText('brand', brand);
  setText('tagline', config.tagline || 'Tu aliado financiero.');
  setText('name', payment.name);
  setText('bank', payment.bank);
  setText('account', payment.account);
  setText('cci', payment.cci);
  setText('footerBrand', brand);

  document.title = `${brand} — Datos de pago`;
  renderQR(payment.qrImage, payment.qrPayload);
}

async function loadRemoteConfig(force = false) {
  if (!GIST_RAW_URL || GIST_RAW_URL.includes('USUARIO/GIST_ID')) {
    $('qrStatus').textContent = 'Configura la URL RAW del Gist en app.js.';
    return;
  }

  try {
    const response = await fetch(cacheBust(GIST_RAW_URL), {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Accept': 'application/json, text/plain, */*' }
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const text = await response.text();
    if (!force && text === lastConfigText) return;
    lastConfigText = text;

    const config = JSON.parse(text);
    renderConfig(config);
    $('lastUpdated').textContent = `Datos verificados: ${new Date().toLocaleTimeString('es-PE')}`;
  } catch (error) {
    console.error('No se pudieron cargar los datos del Gist:', error);
    $('qrStatus').textContent = 'No se pudieron actualizar los datos. Reintentando…';
  }
}

async function copyValue(id, button) {
  const value = $(id).textContent;
  if (!value || value === '—') return;

  try {
    await navigator.clipboard.writeText(value);
    const old = button.textContent;
    button.textContent = 'Copiado';
    setTimeout(() => { button.textContent = old; }, 1200);
  } catch {
    // Fallback sencillo para navegadores antiguos/no seguros.
    const area = document.createElement('textarea');
    area.value = value;
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }
}

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', () => copyValue(button.dataset.copy, button));
});

$('refreshButton').addEventListener('click', async () => {
  const button = $('refreshButton');
  button.disabled = true;
  button.textContent = 'Actualizando…';
  await loadRemoteConfig(true);
  button.disabled = false;
  button.textContent = 'Actualizar';
});

$('year').textContent = new Date().getFullYear();

loadRemoteConfig(true);
refreshTimer = setInterval(() => loadRemoteConfig(false), REFRESH_MS);

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) loadRemoteConfig(true);
});
