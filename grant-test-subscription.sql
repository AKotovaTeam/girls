-- Сделать пользователя платным подписчиком (для локального теста)
-- Supabase Dashboard → SQL Editor → вставить и Run

-- 1. Найти account по email
SELECT id, email, creator_id
FROM accounts
WHERE email = 'test@example.com';

-- 2. Активировать подписку (замените email при необходимости)
INSERT INTO subscriptions (
  account_id,
  creator_id,
  status,
  current_period_start,
  current_period_end
)
SELECT
  a.id,
  a.creator_id,
  'active',
  now(),
  now() + interval '30 days'
FROM accounts a
WHERE a.email = 'test@example.com'
ON CONFLICT (account_id, creator_id) DO UPDATE
SET
  status = 'active',
  current_period_start = now(),
  current_period_end = now() + interval '30 days';

-- 3. Создать/обновить лимит сообщений
INSERT INTO message_allowances (
  account_id,
  creator_id,
  included_limit_per_period,
  included_used_in_period,
  period_start,
  period_end,
  purchased_credits_balance
)
SELECT
  a.id,
  a.creator_id,
  c.included_message_limit,
  0,
  now(),
  now() + interval '30 days',
  0
FROM accounts a
JOIN creators c ON c.id = a.creator_id
WHERE a.email = 'test@example.com'
ON CONFLICT (account_id, creator_id) DO UPDATE
SET
  included_limit_per_period = EXCLUDED.included_limit_per_period,
  included_used_in_period = 0,
  period_start = EXCLUDED.period_start,
  period_end = EXCLUDED.period_end;

-- 4. Проверка
SELECT
  a.email,
  s.status,
  s.current_period_end,
  ma.included_limit_per_period,
  ma.included_used_in_period
FROM accounts a
LEFT JOIN subscriptions s ON s.account_id = a.id
LEFT JOIN message_allowances ma ON ma.account_id = a.id
WHERE a.email = 'test@example.com';
