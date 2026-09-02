# VALORA — Fintech ONE GIST

Эта версия сделана в современном fintech-стиле: dark glassmorphism, градиенты, QR-блок, копирование реквизитов и кнопка Telegram.

## Один Gist управляет всем изменяемым контентом

В Gist можно менять:
- название и слоган;
- все заголовки и подписи;
- тексты преимуществ;
- текст кнопки Telegram;
- Telegram URL;
- получателя, банк, счёт и CCI;
- QR image URL;
- тексты безопасности и footer.

## Настройка

1. Откройте `app.js`.
2. Найдите `GIST_RAW_URL`.
3. Вставьте Raw URL вашего Gist.
4. В Gist вставьте JSON из `payment-gist.example.json`.
5. В поле `telegramUrl` укажите ваш настоящий Telegram.
6. Загрузите файлы в корень репозитория GitHub Pages.

После изменения Gist сайт проверяет его примерно каждые 5 секунд; также есть кнопка «Actualizar datos».

## Важно

В QR используйте прямую ссылку на изображение. Текущий пример:
https://raw.githubusercontent.com/cbale7218-bot/valora-qr/main/payment-qr.png

Для нового QR лучше загружать новый файл с новым именем и менять `qrImage` в Gist.
