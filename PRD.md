# Girls — PRD: сторона пользователя (Subscriber)

| | |
|---|---|
| **Тип документа** | Product Requirements Document |
| **Аудитория** | Product, Tech — оценка и планирование MVP |
| **Scope** | Только end-user (подписчик) на домене креатора |
| **Out of scope** | Creator cabinet, Platform Admin, Creator API |
| **Версия** | 1.1 |
| **Статус** | Draft for estimation |

---

## Overview — Pages & functionality

### Pages

| Page | Route |
|------|-------|
| Landing | `/` |
| Register | `/register` |
| Login | `/login` |
| Email confirm | `/auth/confirm` |
| Subscribe | `/subscribe` |
| Feed | `/feed` |
| Messages | `/messages` |
| Conversation | `/messages/[id]` |
| Billing | `/billing` |
| Contact | `/contact` |
| Terms & Conditions | `/terms` |

### Functionality

- Register / Login (email + password)
- Email confirmation (optional)
- Session / Log out
- Landing только для guests (logged-in → Feed)
- Feed: free + premium (blur без subscription)
- Subscribe: один plan, fixed price, payment provider
- Messages: 1:1 чат с креатором
- Credits за исходящие сообщения
- Paid photos in chat (unlock за credits)
- Chat packs (покупка доп. credits)
- Billing: статус subscription + балансы
- Manage / Cancel subscription
- Terms & Conditions + согласие при Register
- Contact (mailto)
- **Notifier:** email + in-app (unread) при новых событиях

*Ниже — детальная спецификация для оценки.*

---

## Контекст продукта

White-label персональный сайт креатора. Пользователь заходит на branded-домен, регистрируется / логинится, смотрит free и premium контент, оформляет subscription, пишет креатору в Messages и управляет credits.

**Решения MVP, влияющие на пользователя:**

- Один subscription plan, fixed price
- Chat packs — готовые пакеты (пользователь только покупает)
- Paid photos in chat (unlock за credits)
- Без in-app moderation; обратная связь через Contact + email
- Ответы в чате — от человека (или его инструментов); платформа **не** отвечает AI от имени креатора
- Auth: email + password; email confirmation есть, но **optional / non-blocking** в MVP
- Terms & Conditions: публичная страница; обязательное согласие при Register
- **Notifier:** уведомления пользователю (email + in-app unread); отдельной страницы Notifications в MVP нет
- Payment: через платёжного провайдера (конкретный провайдер — TBD), не привязка к одной брендовой платежке в тексте требований

---

## 1. Who the user is

| Attribute | Правило |
|-----------|---------|
| Role | Subscriber / fan одного креатора |
| Entry | Invite / персональная ссылка на домен креатора |
| Account | Email + password |
| Auth | Register / Login по паролю; session после входа |
| Email confirm | Письмо при регистрации; **не обязательно** для использования продукта в MVP |

---

## 2. Site map (user only)

**Note on URLs:** Это **responsive website** (desktop + mobile browser). Отдельного native app в scope нет. Префикс `/app` не используем — путает с native shell. Продуктовые пути: `/feed`, `/messages`, `/billing`.

| Route | Auth | Purpose |
|-------|------|---------|
| `/` | Guests only | Landing; **если logged in → redirect на `/feed`** |
| `/login` | Guests only | Login (email + password) |
| `/register` | Guests only | Register (email + password) |
| `/auth/confirm` | Не требуется | Confirm email по ссылке из письма (optional для доступа) |
| `/subscribe` | Да перед оплатой | Один plan + старт payment |
| `/feed` | Да | Content Feed |
| `/messages` | Да | Вход в чат с креатором |
| `/messages/[id]` | Да | Conversation thread |
| `/billing` | Да | Subscription + message credits + покупка packs |
| `/contact` | Нет | Complaints & suggestions (email) |
| `/terms` | Нет | Terms & Conditions |

### Global chrome

- **Header:** brand → у guest на `/`; у logged-in на `/feed` (не на Landing)
- У logged-in: Feed / Messages (+ unread badge) / Credits; email; Log out
- **Footer:** Contact & feedback → `/contact`; Terms & Conditions → `/terms`

### Access rule

Залогиненный пользователь **не может** открыть Landing `/`. Любой заход на `/` при активной session → redirect на `/feed`. Landing только для guests (до логина). После Log out Landing снова доступен.

---

## 3. Pages — detailed product spec

### 3.1 Landing `/`

**Goal:** Представить креатора и привести к Sign in / Register. **Только guests.**

**Access:**

- Guest → видит Landing
- Logged in → **автоматический redirect на `/feed`** (без UI лендинга, без CTA «Go to Feed» на Landing)
- Пока пользователь залогинен, вернуться на Landing нельзя (logo, back, прямой URL `/` → `/feed`)

**User sees (guest only):**

- Имя / brand креатора (hero-level)
- Короткая история / зачем этот сайт
- Visuals (фото) креатора
- Value points: exclusive photos, direct messages, без посредников
- Primary CTA: **Sign in** / **Register**

**User can:**

- Перейти на `/login` или `/register`
- Открыть Contact или Terms & Conditions из footer
- Снова увидеть Landing только после Log out

**Empty / error:** Неизвестный domain → 404

**Acceptance:** Guest Landing; logged-in `/` → `/feed`; нет logged-in состояния Landing; footer; domain 404

---

### 3.2 Register `/register`

**Goal:** Создать account (email + password).

**User sees:**

- Email
- Password (+ confirm password — в оценку закладываем password + confirm)
- Submit / **Create account**
- Ссылка на Login
- Короткая пометка, что уйдёт confirmation email (подтверждать необязательно)
- Checkbox **I agree to the Terms & Conditions** + ссылка на `/terms` (обязателен для Submit)

**User can:**

- Валидные email + password → account создан → session → redirect на `/feed` (или return URL)
- После Register система шлёт confirmation email со ссылкой `/auth/confirm?token=…`

**Rules:**

- Email уникален на сайте (один account на email)
- Password: min length (например 8+); базовые validation errors
- Без принятых Terms & Conditions Register не завершается (checkbox required)
- **Email confirmation optional в MVP:** unverified пользователь может Login, Subscribe, Feed, Messages — без hard block
- Soft UX (nice-to-have): banner «Please confirm your email» + Resend

**Edge cases:**

- Email уже занят → понятная ошибка + ссылка на Login
- Невалидный email / слабый password → inline validation
- Confirm может истечь / не сработать — account в MVP не блокируем

**Acceptance:** Форма Register; checkbox Terms required; создание account; session; confirmation email; продукт доступен без confirmed email

---

### 3.3 Login `/login`

**Goal:** Вход по email + password.

**User sees:**

- Email, Password
- Submit / **Log in**
- Ссылка на Register
- «Forgot password?» — **out of MVP** (optional add-on отдельной строкой оценки)

**User can:**

- Успешный Login → session → `/feed` (или return URL, например `/subscribe`)
- Уже logged in → redirect на `/feed`

**Rules:**

- Неверный email/password → общая ошибка (не раскрывать, какое поле неверно)
- Unconfirmed email → **можно логиниться** в MVP
- Session после успешного Login

**Acceptance:** Password Login; session; redirect если уже logged in; return URL для paywall

---

### 3.4 Email confirm `/auth/confirm`

**Goal:** Пометить email как verified по ссылке из письма.

**User sees:**

- Success: «Email confirmed» → CTA на Feed / Login
- Error: invalid / expired / already used token

**User can:**

- Confirm email (флаг `email_verified`)
- Продолжить в продукт, если уже logged in, иначе → Login

**Rules:**

- Token: one-time, time-limited
- Confirmation **optional** — фичи MVP **не** гейтятся по verified email
- Resend из soft banner (если делаем)

**Acceptance:** Страница confirm; success/error; нет блокировок для unverified

---

### 3.5 Subscribe `/subscribe`

**Goal:** Продать **один** subscription plan и запустить оплату через payment provider.

**User sees:**

- Идентичность креатора (имя / avatar)
- **One plan only:** fixed price (например $X / month) — без выбора тарифов
- What’s included:
  - Доступ ко всем exclusive (premium) фото / posts
  - N messages в billing period (N задаётся платформой, показывается пользователю)
  - Direct messages с креатором
  - Cancel anytime
- Primary CTA: **Subscribe** (оплата через payment provider)
- Ссылка на Terms & Conditions (`/terms`) рядом с оплатой (пользователь может перечитать перед pay)
- Назад в Feed (для logged-in; guests до оплаты уходят в Login / Register)

**User can:**

- Начать payment
- Если не logged in: **сначала Login или Register**, затем return на Subscribe

**After successful payment:**

- Subscription status = active
- Premium в Feed открывается
- Message allowance на период (included N) доступен

**Failed / cancelled payment:**

- Возврат без subscription; можно повторить

**Note:** Unconfirmed email **не** блокирует Subscribe в MVP.

**Acceptance:** Single-plan страница; login-before-pay; live checkout; success/cancel return; статус виден в Feed и Billing

---

### 3.6 Feed `/feed`

**Goal:** Основной контент после Login.

**Access:** Logged in. Guest → `/login`.

**User sees:**

- Список опубликованных posts (хронология или иной product order)
- У поста: креатор, дата, title/body, image(s)
- **Free posts:** полный текст и фото
- **Premium posts** (нужна subscription):
  - Нет subscription → blur / lock, overlay, CTA **Subscribe** → `/subscribe`
  - Есть subscription → полный контент
- Multi-image: gallery grid; просмотр при наличии доступа
- Optional soft banner про confirm email (не блокирует Feed)

**User can:**

- Скроллить Feed
- Уйти в Subscribe с locked posts
- Перейти в Messages / Billing через Header

**Out of MVP:** likes, comments, search, filters, download vault

**Acceptance:** Auth-gated Feed; free vs premium; blur + CTA; gallery для multi-image; desktop + mobile

---

### 3.7 Messages entry `/messages`

**Goal:** Войти в 1:1 chat с креатором.

**Access:** Logged in.

**Product model:** Одна conversation на пару user–creator. Открытие Messages создаёт или открывает thread → `/messages/[id]`.

**Rules:**

- Для отправки нужна **active subscription**
- Без subscription: блок отправки + CTA на `/subscribe`
- Email confirmation для чата **не** требуется

**Acceptance:** Auto open/create conversation; gate по subscription на send

---

### 3.8 Conversation `/messages/[id]`

**Goal:** 1:1 чат с креатором (человеческие ответы).

**User sees:**

- History сообщений (свои + креатора) по времени
- Text composer
- Индикатор оставшихся message credits (included + purchased / total)
- Unread: после открытия — прочитано; badge в Header обновляется
- **Images in chat:**
  - Free image — видно
  - **Paid photo** — lock/blur до unlock; цена в credits; CTA **Unlock for N credits**
  - После unlock — полное фото; повторно не списываем

**User can:**

- Отправить text → **−1 credit** (при active subscription и credits > 0)
- Unlock paid photo → **−N credits**
- Уйти в Billing, если credits закончились
- Получать ответы креатора (**0** credits за входящие)

**Credit spend order:**

1. Сначала included quota периода  
2. Затем purchased credits  
3. Если 0 → нельзя send / unlock; UX **NO_CREDITS** + ссылка на Billing / Subscribe  

**Errors in UI:** not subscribed; no credits; network / send failure (retry)

**Out of MVP:** загрузка медиа пользователем (user sends **text only**); voice/video

**Acceptance:** History; send −1 credit; credit display; paid photo unlock; gates; unread badge; mobile composer

---

### 3.9 Billing & credits `/billing`

**Goal:** Прозрачность подписки и монетизация messaging.

**Access:** Logged in.

**Block A — Subscription**

- Status: Active / Not subscribed
- Active: дата renew / конца period
- Не active: CTA → `/subscribe`
- One plan, fixed price (показать цену)
- Cancel / Manage — через flow payment provider или in-app «Manage subscription» (заложить в оценку)

**Block B — Message credits**

- Included за период: used / remaining vs limit (progress)
- Purchased credits (не сгорают)
- Total available

**Block C — Buy more credits (chat packs)**

- Список packs (name, credits, price)
- Выбор pack → one-time payment checkout
- После оплаты баланс purchased растёт сразу (webhook / callback)
- Packs заданы платформой; пользователь только выбирает из списка

**Period reset (видно пользователю):**

- При renew subscription **included** сбрасывается до N
- Purchased credits **не** сбрасываются

**Acceptance:** Корректные status и balances; покупка packs; reset included; manage/cancel path

---

### 3.10 Contact `/contact`

**Goal:** Жалобы и предложения без in-app moderation.

**User sees:**

- Короткое объяснение
- Support email платформы (mailto)
- Можно попросить писать с email аккаунта по account-вопросам

**User can:**

- Открыть почтовый клиент (без ticket-формы в MVP)

**Access:** Публично на валидном домене креатора + ссылка в footer

**Acceptance:** Страница + mailto + footer; email конфигурируемый

---

### 3.11 Terms & Conditions `/terms`

**Goal:** Юридические условия использования продукта (публичная страница).

**Access:** Публично на валидном домене креатора (guest и logged-in). Ссылка всегда в Footer.

**User sees:**

- Заголовок **Terms & Conditions**
- Актуальный текст условий (platform-level; один документ для продукта)
- Дата последнего обновления (Last updated)
- Ссылка назад (guest → Landing `/`; logged-in → `/feed`)

**User can:**

- Прочитать Terms в любой момент
- Открыть из Footer
- При Register — перейти по ссылке на Terms (см. Register)

**Rules:**

- Текст Terms хранится / публикуется платформой (контент TBD legal)
- В MVP: статичная страница с утверждённым текстом (без CMS, если не требуется)
- При существенном обновлении Terms — обновить дату **Last updated** на странице

**Acceptance:** Публичная `/terms`; ссылка в Footer; читаемый текст; Last updated; доступна без Login

---

## 4. Cross-cutting functionality

### 4.1 Session & logout

- Session сохраняется между визитами до expiry или Log out
- Log out → Landing `/` (или Login)
- Пока logged in: `/`, `/login`, `/register` редиректят на `/feed`

### 4.2 Navigation & unread

- Header: Feed, Messages, Credits
- Unread badge на Messages, если есть непрочитанные от креатора
- Badge — часть **Notifier** (in-app канал)

### 4.2a Notifier

**Goal:** Сообщить подписчику о важных событиях, даже если он не в чате.

**Каналы (MVP):**

| Channel | Что видит пользователь |
|---------|------------------------|
| **In-app** | Unread badge на Messages в Header |
| **Email** | Письмо на email аккаунта со ссылкой в Conversation / Billing |

**Out of MVP:** Web Push / mobile push; отдельная страница `/notifications`; SMS.

**События → уведомление:**

| Event | In-app | Email |
|-------|--------|-------|
| Новое сообщение от креатора (text / photo) | Да (badge) | Да |
| Subscription успешно оформлена / продлена | — | Да (confirmation) |
| Payment chat pack успешен | — | Да (confirmation) |
| Subscription отменена / истекла / payment failed | — | Да |

**Rules:**

- Email Notifier → на email аккаунта (в MVP шлём и без confirmed email)
- Письмо о новом сообщении: краткий смысл + CTA в `/messages/[id]` (через Login, если нет session)
- Opt-out настроек в продукте нет в MVP; в письме — стандартный unsubscribe (желательно)
- Default: **одно письмо на каждое** новое сообщение от креатора (digest — TBD)

**Acceptance:** Ответ креатора → email + badge; payment/subscription emails уходят; ссылки ведут в продукт

### 4.3 Paywall consistency

- Premium в Feed и messaging требуют **active** subscription
- Credits — **дополнительно** к subscription (объём сообщений и unlock paid photos)
- Email verification **не** гейтит paywall / messaging в MVP

### 4.4 Payments (user-visible)

- Subscription: recurring, one plan
- Chat packs: one-time
- Цена / currency как на Subscribe / Billing (fixed платформой)
- Пользователь не настраивает pricing

### 4.5 Support & legal

- Нет report-кнопок на posts/messages в MVP
- Contact email для жалоб / предложений
- Terms & Conditions — публичная страница `/terms`; принятие при Register

---

## 5. User flows (для оценки)

| ID | Flow |
|----|------|
| **F1** | Landing → Register → email + password → session → Feed (+ confirmation email в фоне, можно игнорировать) |
| **F2** | Landing → Login → email + password → Feed |
| **F3** | Ссылка из письма → `/auth/confirm` → success → продолжение в продукте |
| **F4** | Feed → free открыты → premium locked → Subscribe CTA |
| **F5** | Subscribe → Login/Register если нужно → payment checkout → success → Feed unlocked + included messages |
| **F6** | Messages → text (−1 credit) → ответ креатора в thread |
| **F7** | Нет credits → Billing → chat pack → checkout → баланс обновлён → снова чат |
| **F8** | Paid photo → Unlock → −N credits → полное фото; повторно без списания |
| **F9** | Billing → Manage / Cancel (payment provider) → статус обновляется; premium может закрыться по статусу подписки |
| **F10** | Footer → Contact → mailto support |
| **F11** | Footer / Register → Terms & Conditions → прочтение `/terms` |
| **F12** | Register → обязательный agree to Terms → Create account |
| **F13** | Креатор ответил → Notifier: email + unread badge → пользователь открывает Messages |

---

## 6. Business rules (checklist)

| ID | Rule |
|----|------|
| R1 | Account по email (unique на сайте) |
| R2 | Auth = email + password; session после Login/Register |
| R2a | Logged-in не видит Landing `/` → всегда `/feed` |
| R3 | При Register отправляется email confirmation link |
| R4 | Email confirmation optional — unverified имеют полный MVP-доступ |
| R5 | One subscription plan, fixed price |
| R6 | Premium posts только при active subscription |
| R7 | Send message требует active subscription |
| R8 | Text message = 1 credit |
| R9 | Входящие от креатора = 0 credits |
| R10 | Сначала included quota, потом purchased credits |
| R11 | Included quota сбрасывается каждый subscription period |
| R12 | Purchased credits не сгорают |
| R13 | Paid chat photo = N credits один раз; далее permanently unlocked |
| R14 | Одна conversation на user–creator |
| R15 | Unknown host → 404 |
| R16 | Contact = mailto only (без ticket system) |
| R17 | Публичная страница Terms & Conditions `/terms` |
| R18 | Register требует явного согласия с Terms (checkbox + ссылка) |
| R19 | Notifier: новое сообщение от креатора → in-app unread + email |
| R20 | Notifier: email при успешных/неуспешных payment и смене статуса subscription |

---

## 7. UI states (для оценки)

| Screen | States |
|--------|--------|
| Register | Empty, validation, email taken, Terms not accepted, success + session, soft fail отправки confirm |
| Login | Empty, validation, wrong credentials, success, return URL |
| Confirm email | Success, invalid, expired, already confirmed |
| Subscribe | Guest redirect, ready, checkout redirect, cancelled return |
| Feed | Empty, free, locked premium, unlocked premium, optional confirm banner |
| Chat | No subscription, no credits, empty thread, sending, send error, paid photo locked/unlocked |
| Billing | Not subscribed, active, packs list, purchase success/fail, manage flow |

---

## 8. MVP In / Out (user side)

### In

- Landing (guests only)
- Register + Login (email + password)
- Session + Log out
- Email confirmation send + confirm page (**non-blocking**)
- Feed: free / premium + blur
- Subscribe через payment provider — one plan
- Billing: status, credits, покупка chat packs
- Messages: 1:1 text, credit spend, paid photo unlock
- Unread badge
- **Notifier** (email + in-app) на сообщения креатора и payment/subscription события
- Contact + footer
- Terms & Conditions `/terms` + согласие при Register

### Out

- Обязательный email verification до использования
- Magic link / passwordless
- Forgot password / reset (optional add-on)
- Social login
- Несколько plans / цена от пользователя
- Пользователь создаёт свои packs
- In-app complaints / tickets / moderation
- Likes / comments в Feed
- Upload медиа пользователем в чат (только text)
- AI auto-replies в чате у пользователя
- Web Push / mobile push / SMS
- Отдельная страница `/notifications`
- Настройки opt-in/opt-out уведомлений в UI

---

## 9. Open inputs (нужно уточнить)

- [ ] Цена subscription + currency + included messages N на period  
- [ ] Каталог chat packs (name, credits, price) на Billing  
- [ ] Platform contact email  
- [ ] Copy для Landing / Subscribe  
- [ ] Cancel UX: portal провайдера vs in-app  
- [ ] Какой payment provider (TBD; закладывать pluggable checkout + webhooks/callbacks)  
- [ ] Правила password (min length и т.д.)  
- [ ] Soft banner «confirm your email» — в MVP или later  
- [ ] Финальный legal-текст Terms & Conditions (+ Privacy Policy отдельно — если нужна, TBD)  
- [ ] Нужна ли повторная фиксация согласия с Terms при Subscribe (в MVP достаточно при Register)  
- [ ] Notifier: preview текста в email о сообщении — да/нет; digest vs per-message  
- [ ] Notifier: слать ли email, если пользователь уже в открытом чате  

---

## 10. Definition of Done (user MVP)

Гость на валидном домене креатора может: зарегистрироваться (email + password), залогиниться, опционально подтвердить email позже без блокировок, оформить один subscription plan через payment provider, видеть premium в Feed, писать в Messages с учётом credits, докупать chat packs, unlock paid photos в чате, видеть корректные balances и статус subscription, управлять / отменять подписку через flow провайдера, получать **Notifier** (email + unread) на ответы креатора и ключевые payment-события, ознакомиться с Terms & Conditions, принять их при Register и связаться с поддержкой по email.

**В этот документ и эту оценку не входят** Creator cabinet и Platform Admin.
