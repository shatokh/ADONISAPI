-- файл: db_setup.sql

-- Включаем контроль ошибок и начинаем транзакцию
BEGIN;

-- 0. Подключаем расширение для генерации UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Создаём ENUM-типы
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role   AS ENUM ('user','admin');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
    CREATE TYPE user_status AS ENUM ('active','inactive');
  END IF;
END
$$ LANGUAGE plpgsql;

-- 2. Таблица users
CREATE TABLE IF NOT EXISTS users (
  id          BIGSERIAL PRIMARY KEY,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    VARCHAR(180) NOT NULL,
  role        user_role    NOT NULL DEFAULT 'user',
  status      user_status  NOT NULL DEFAULT 'active',
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Функция для обновления updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
  RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Триггер на users
DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- 5. Таблица api_tokens
CREATE TABLE IF NOT EXISTS api_tokens (
  id          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash  CHAR(64)  NOT NULL UNIQUE,
  salt        VARCHAR(32) NOT NULL,
  user_id     BIGINT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_revoked  BOOLEAN   NOT NULL DEFAULT false,
  expires_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '3 days'),
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Индекс на user_id
CREATE INDEX IF NOT EXISTS idx_api_tokens_user_id ON api_tokens(user_id);

-- Фиксируем все изменения
COMMIT;
-- Проверяем, что транзакция завершена успешно
SELECT 1;
