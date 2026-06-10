# 🔍 Где найти Settings → API в Supabase Dashboard

## 📍 Пошаговая инструкция:

### Шаг 1: Найдите иконку Settings (шестеренка)

В **левом боковом меню** (sidebar) найдите иконку **⚙️ Settings** (шестеренка).

Она находится внизу списка иконок, обычно после:
- Home (дом)
- Table Editor (таблица)
- SQL Editor (код)
- Database (база данных)
- и других иконок

### Шаг 2: Нажмите на Settings

Кликните на иконку **Settings** (шестеренка).

### Шаг 3: Выберите API

После клика на Settings откроется подменю с опциями:
- **General**
- **API** ← **ВЫБЕРИТЕ ЭТО**
- **Database**
- **Auth**
- **Storage**
- и другие

Нажмите на **"API"**.

### Шаг 4: Скопируйте credentials

На странице API вы увидите несколько секций:

#### 1. Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```
→ Это ваш `NEXT_PUBLIC_SUPABASE_URL`

#### 2. Project API keys

##### anon public
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
→ Это ваш `NEXT_PUBLIC_SUPABASE_ANON_KEY`

##### service_role secret ⚠️
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
→ Это ваш `SUPABASE_SERVICE_ROLE_KEY`

**⚠️ ВАЖНО:** `service_role` key может быть скрыт - нажмите "Reveal" чтобы показать его.

## 🎯 Альтернативный путь:

Если не видите Settings в левом меню:

1. В верхней панели найдите иконку **профиля** (аватар) или **шестеренку**
2. Или используйте поиск: нажмите `⌘K` и введите "API"
3. Или перейдите напрямую по URL: `https://supabase.com/dashboard/project/[ваш-project-id]/settings/api`

## 📸 Визуальные подсказки:

- Settings обычно находится в **нижней части левого меню**
- Иконка выглядит как **⚙️ шестеренка**
- После клика появляется **подменю** с опциями
- API - это одна из опций в подменю

## ✅ После того как найдете:

Скопируйте все три значения и запустите:
```bash
./setup-supabase.sh
```

Вставьте скопированные значения когда скрипт попросит.


