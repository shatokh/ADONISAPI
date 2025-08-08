# AdonisJS

Учебный API-проект на AdonisJS 7 с PostgreSQL, JWT-аутентификацией на access tokens, валидацией и документированием через OpenAPI/Swagger.

## 📦 Структура проекта

```
AdonisApi/
├─ app/
│  ├─ Controllers/Http/
│  │  ├─ AuthController.ts
│  │  └─ UserStatusController.ts
│  ├─ Middleware/
│  │  └─ IsAdmin.ts
│  ├─ Models/
│  │  ├─ User.ts
│  │  └─ ApiToken.ts
│  └─ Validators/
│     ├─ register.ts        # VineJS-валидация
│     ├─ login.ts
│     └─ status.ts
├─ config/
│  ├─ auth.ts              # Guard access_tokens
│  └─ database.ts
├─ docs/
│  └─ swagger.yml          # OpenAPI спецификация
├─ database/
│  └─ migrations/          # миграции Lucid (схемы пользователей и токенов)
├─ start/
│  ├─ kernel.ts            # регистрация middleware
│  └─ routes.ts            # декларация маршрутов
├─ .env                    # переменные окружения
├─ db_setup.sql            # SQL-скрипт для ручной инициализации БД
└─ README.md
```

## 🔧 Что мы сделали

1. **Инициализация AdonisJS**  
   `npm init adonisjs@latest . -- --kit=api --auth-guard=access_tokens --db=postgres`

2. **Установка зависимостей**  
   - `@adonisjs/lucid` + `pg` для PostgreSQL  
   - `@adonisjs/auth/access_tokens` для JWT-токенов  
   - `@adonisjs/validator` и `@vinejs/vine` для валидации  
   - `swagger-ui-express` + `yamljs` для локального Swagger UI

3. **База данных**  
   - Создали ENUM-типы `user_role` и `user_status`  
   - Таблицы `users` и `api_tokens` со схемой и триггером для `updated_at`  
   - В SQL-скрипте `db_setup.sql` обёрнуто в транзакцию с `ON_ERROR_STOP`  
   - Альтернативная Lucid-миграция генерируется через `node ace make:migration`  

4. **Модели Lucid**  
   - `User` с хешированием пароля в `@beforeSave`  
   - `ApiToken` с генерацией токена и хэша в `@beforeCreate`

5. **Аутентификация**  
   - Конфиг `config/auth.ts` с `tokensGuard` и `tokensUserProvider`  
   - Guard `api` хранит токены в таблице `api_tokens`, срок жизни 3 дня

6. **Middleware**  
   - Стандартные `auth` и `guest` из Adonis  
   - Кастомный `isAdmin` для проверки роли администратора

7. **Валидация**  
   - Генерация валидаторов через CLI:  `node ace make:validator`  
   - Использование VineJS (`app/validators/*.ts`) для проверки email, пароля и статуса

8. **Маршруты**  
   - Определили маршруты `/auth/register`, `/auth/login`, `/auth/me` и `/auth/users/:id/status`  
   - Применили middleware `.use(['guest'])`, `.use(['auth'])`, `.use(['isAdmin'])`

9. **Обработка ошибок**  
   - В `app/Exceptions/Handler.ts` конвертация 500→400 с читабельным сообщением  

10. **Документация**  
    - OpenAPI спецификация `docs/swagger.yml` без дублирования блоков  
    - Swagger UI доступен по `/docs` через `swagger-ui-express`

## 🚀 Запуск проекта

1. **Настройка .env**  
   ```dotenv
   DB_CONNECTION=pg
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_USER=adonisuser
   DB_PASSWORD=YourSecurePassword
   DB_DATABASE=postgres

   APP_KEY=<сгенерируйте через `node ace generate:key`>
   AUTH_ACCESS_TOKEN_EXPIRES_IN=3d
   ```

2. **Инициализация БД**  
   - Через `psql`:  
     ```bash
     psql -U postgres --set ON_ERROR_STOP=on -f docs/db_setup.sql
     ```  
   - Или через pgAdmin (Query Tool, стоп по ошибке + Open File)

3. **Запуск миграций Lucid (опционально)**  
   ```bash
   node ace migration:run
   ```

4. **Запуск сервера**  
   ```bash
   node ace serve --watch
   ```

5. **Swagger UI**  
   Откройте в браузере:  `http://localhost:3333/docs`

## 📝 Дальнейшие шаги

- Реализация тестов через `@japa/runner`  
- Логирование запросов и метрик  
- Настройка CI/CD (GitHub Actions → Railway)  
- Расширение функциональности (роль «super-admin», soft-delete, графы доступа)

---

*Автор: d.shatokhin — учебный проект AdonisApi*

