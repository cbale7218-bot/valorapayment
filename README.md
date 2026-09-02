# VALORA — fixed GitHub Pages package

Исправленная версия сайта VALORA.

## Что исправлено
- Кнопки «Copiar» работают через Clipboard API на HTTPS и имеют fallback для браузеров без Clipboard API.
- После копирования кнопка показывает «¡Copiado!». Для Clipboard API браузер требует защищённый HTTPS-контекст. GitHub Pages работает по HTTPS.
- «Copiar todo» копирует все реквизиты.
- «Actualizar datos» вручную перечитывает Gist.
- Gist перечитывается каждые 5 секунд.
- QR получает cache-buster, поэтому замена изображения подтягивается без старого кэша.
- Дизайн можно менять через `design` в Gist.
- При временной ошибке Gist сайт сохраняет последние отображённые данные, а не заменяет их тестовыми реквизитами.

## Файлы
Загрузите все файлы в корень GitHub Pages repository:
- `index.html`
- `styles.css`
- `app.js`
- `logo.png`
- `.nojekyll`

`payment-gist.example.json` — пример содержимого Gist, его загружать в Pages не обязательно.

## Gist
В `app.js` уже указан Gist:
`c9fb99d723dffd3436f25f1dfc54c4da`

Меняйте данные в Gist. Сайт автоматически подхватит их примерно за 5 секунд.
