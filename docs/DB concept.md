Концепция базы данных для AdonisJS API

1. Таблица users

Типы ENUM

CREATE TYPE user_role AS ENUM ('user','admin');
CREATE TYPE user_status AS ENUM ('active','inactive');

Колонка

Тип

Ограничения

id

BIGSERIAL

PK

email

VARCHAR(255)

NOT NULL, UNIQUE

password

VARCHAR(180)

NOT NULL (bcrypt-хэш)

role

user_role

NOT NULL, DEFAULT 'user'

status

user_status

NOT NULL, DEFAULT 'active'

created_at

TIMESTAMP WITH TIME ZONE

NOT NULL, DEFAULT now()

updated_at

TIMESTAMP WITH TIME ZONE

NOT NULL, DEFAULT now(), автоматически обновляется триггером

Триггер для обновления updated_at

CREATE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at := NOW();
RETURN NEW;
END;

$$
LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

2. Таблица api_tokens

Колонка

Тип

Ограничения

id

UUID

PK, DEFAULT gen_random_uuid()

token_hash

CHAR(64)

NOT NULL, UNIQUE (SHA-256-хэш с солью)

salt

VARCHAR(32)

NOT NULL

user_id

BIGINT

NOT NULL, FK → users(id) ON DELETE CASCADE

is_revoked

BOOLEAN

NOT NULL, DEFAULT false

expires_at

TIMESTAMP WITH TIME ZONE

NOT NULL, DEFAULT now() + INTERVAL '3 days'

created_at

TIMESTAMP WITH TIME ZONE

NOT NULL, DEFAULT now()

Пример хэширования токена

const salt      = crypto.randomBytes(16).toString('hex')
const token     = nanoid(32)                // оригинальный токен
const tokenHash = sha256(salt + token)      // сохраняется в БД
// клиенту возвращаем только `token`

3. Атомарность через транзакции Lucid

import Database from '@ioc:Adonis/Lucid/Database'

await Database.transaction(async (trx) => {
  // 1) Создать пользователя
  const user = await User
    .create({ email, password: hashedPassword }, { client: trx })

  // 2) Сгенерировать и сохранить токен
  const salt      = crypto.randomBytes(16).toString('hex')
  const token     = nanoid(32)
  const tokenHash = sha256(salt + token)
  await ApiToken.create({
    userId:    user.id,
    tokenHash,
    salt,
    expiresAt: DateTime.now().plus({ days: 3 }).toSQL(),
  }, { client: trx })

  // При ошибке в любом шаге всё откатится автоматически
})

4. Безопасность и эксплуатация

HTTPSВесь трафик API только по HTTPS.

Secure Cookies (если токен отдаётся в cookie):

Set-Cookie: access_token=<token>; HttpOnly; Secure; SameSite=Strict; Max-Age=259200

Rate limiting/auth/login: максимум 5 попыток в минуту с одного IP или учётки; при превышении — блокировка на 15 минут.

Секреты и конфигурация

В разработке хранить JWT_SECRET, пароли БД и другие ключи только в файле .env.

В продакшене использовать управляемые секреты (AWS Secrets Manager, Azure Key Vault и т.п.), не коммитить .env.


$$
