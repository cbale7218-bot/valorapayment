# VALORA — sitio de pagos

## Estructura

- `index.html` — página
- `styles.css` — diseño
- `app.js` — carga automática desde GitHub Gist cada 5 segundos
- `logo.png` — logo VALORA

## Configuración

El QR actual ya está configurado como:

`https://raw.githubusercontent.com/cbale7218-bot/valora-qr/main/payment-qr.png`

Para conectar los datos del Gist:

1. Cree un **Public Gist**.
2. Cree el archivo `payment.json`.
3. Use como contenido el archivo `payment.json.example`.
4. Cambie nombre, banco, cuenta y CCI.
5. Нажмите **Raw** в Gist и скопируйте URL.
6. В `app.js` замените:
   `PASTE_YOUR_GIST_RAW_URL_HERE`
   на вашу RAW-ссылку.
7. Commit changes в GitHub Pages.

После этого сайт будет проверять Gist каждые 5 секунд и автоматически обновлять реквизиты и QR.

## Как менять QR

В репозитории `cbale7218-bot/valora-qr` загружайте новый QR под новым именем, например:

- `payment-qr-002.png`
- `payment-qr-003.png`

Затем меняйте только `qrImage` в `payment.json` Gist на новый Raw URL.

Использование нового имени файла помогает избежать кэширования старого QR.

## Важно

Не размещайте в Gist пароли, токены или секретные ключи. Публичный Gist предназначен только для тех платежных данных, которые вы готовы показывать клиентам.
