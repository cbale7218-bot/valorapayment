# VALORA — página de datos de pago + GitHub Gist

Esta versión está preparada para que **los datos de pago y el QR se administren desde un GitHub Gist**, mientras que el sitio permanece publicado en GitHub Pages.

## 1. Crear el Gist

Crea un **Gist público** en GitHub con un archivo llamado exactamente:

`payment.json`

Contenido de ejemplo:

```json
{
  "companyName": "VALORA",
  "tagline": "Tu aliado financiero.",
  "payment": {
    "name": "NOMBRE DEL TITULAR",
    "bank": "NOMBRE DEL BANCO",
    "account": "000000000000",
    "cci": "00000000000000000000",
    "qrPayload": "PEGA_AQUI_EL_CONTENIDO_EXACTO_DEL_QR"
  }
}
```

**No pongas contraseñas, tokens ni claves privadas en el Gist.** El Gist debe ser público porque el sitio necesita leerlo sin autenticación.

## 2. Obtener la URL RAW

En el Gist abre `payment.json` y pulsa **Raw**. Copia esa dirección. Normalmente tendrá una forma parecida a:

`https://gist.githubusercontent.com/USUARIO/GIST_ID/raw/payment.json`

## 3. Conectar el sitio al Gist

Abre `app.js` y cambia únicamente esta línea:

```js
const GIST_RAW_URL = 'https://gist.githubusercontent.com/USUARIO/GIST_ID/raw/payment.json';
```

Pega ahí la URL RAW de tu Gist.

Después de esta configuración, **для изменения платежных данных больше не нужно редактировать сайт**: меняйте только `payment.json` в Gist.

## 4. Как быстро обновляется QR

Сайт:

- запрашивает Gist сразу при открытии;
- проверяет изменения каждые **5 секунд**;
- добавляет уникальный параметр к запросу, чтобы не использовать старый кэш;
- при изменении `qrPayload` автоматически перерисовывает QR;
- при возврате на вкладку принудительно проверяет Gist;
- имеет кнопку **Actualizar** для ручной проверки.

Это означает, что после сохранения новой версии `payment.json` сайт не требует нового deploy: данные берутся из Gist отдельно от файлов GitHub Pages.

Фактическая задержка зависит от распространения новой версии Gist/Raw через сеть и браузер. Интервал проверки сайта — 5 секунд, но это не является гарантией пятисекундной доставки новой версии со стороны GitHub.

## 5. Важный момент про платежный QR в Перу

`qrPayload` должен содержать **точный payload/формат, который выдает ваш банк или платежный провайдер**. Сайт не придумывает платежный стандарт самостоятельно: он только кодирует предоставленную строку в QR.

Если провайдер выдает QR как изображение, а не payload/строку, потребуется другой вариант интеграции.

## 6. Публикация

1. Создайте репозиторий на GitHub.
2. Загрузите файлы этого архива.
3. Откройте **Settings → Pages**.
4. Выберите **Deploy from a branch**.
5. Выберите ветку `main` и папку `/ (root)`.
6. Сохраните.

После первоначальной публикации сайт можно больше не трогать при обычной смене платежных реквизитов — меняется только Gist.
