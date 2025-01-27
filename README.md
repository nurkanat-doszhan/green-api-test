# WhatsApp Message Handler

Этот проект представляет собой систему обработки сообщений, получаемых через API WhatsApp. Приложение позволяет:

 - Принимать сообщения через API.

 - Обрабатывать сообщения только от определённых пользователей (номеров), указанных в вашем списке users.

 - Игнорировать сообщения от неизвестных номеров, при этом удаляя соответствующие уведомления с сервера.

 - Добавлять сообщения от пользователей в чат.

## Установка
### Шаг 1: Клонирование репозитория
### `git clone https://github.com/nurkanat-doszhan/green-api-test.git`
### `cd green-api-test`
## Установка
### Шаг 2: Установка зависимостей
### `npm install`

## Запуск локального сервера
### `npm start`

## Сборка для продакшена
### `npm run build`

## Особенности

- Уведомления удаляются с сервера даже для сообщений от неизвестных номеров, чтобы избежать их накопления.

- Логирование позволяет отслеживать процесс обработки сообщений и ошибки.
