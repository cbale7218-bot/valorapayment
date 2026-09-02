// VALORA — configuración remota mediante GitHub Gist
// IMPORTANTE: cambia SOLO esta URL una vez, por la URL RAW de tu Gist.
const GIST_RAW_URL = 'https://gist.githubusercontent.com/cbale7218-bot/99b95074e00df4c7f2dd93b0e2fd3ffe/raw/9e5fce10388590d35095cc486b58cb76bcc97254/payment.json';

// Frecuencia de comprobación. 5000 = cada 5 segundos.
// El QR solo se redibuja cuando cambia el contenido.
const REFRESH_MS = 5000;

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

function renderQR(payload) {
  const box = $('qrcode');
  box.innerHTML = '';

  if (!payload) {
    $('qrStatus').textContent = 'QR no configurado.';
    return;
  }

  try {
    new QRCode(box, {
      text: String(payload),
      width: 230,
      height: 230,
      correctLevel: QRCode.CorrectLevel.M
    });
    $('qrStatus').textContent = 'QR actualizado.';
  } catch (error) {
    console.error(error);
    $('qrStatus').textContent = 'No se pudo generar el QR.';
  }
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
  renderQR(payment.qrPayload);
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
