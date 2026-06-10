# 🔍 Как перейти на страницу Settings → API

## ⚠️ Вы сейчас на странице "Data API"

Это не та страница! Нужна страница **Settings → API** для получения ключей.

## 📍 Как перейти:

### Способ 1: Через левое меню

1. В **левом боковом меню** (sidebar) найдите иконку **⚙️ Settings** (шестеренка)
   - Она находится внизу списка иконок
   - Обычно после всех других разделов

2. Нажмите на **Settings**

3. В подменю выберите **"API"**

### Способ 2: Через URL напрямую

В адресной строке браузера замените текущий URL на:

```
https://supabase.com/dashboard/project/tgeeuqmzxynkqudoihjv/settings/api
```

Или просто добавьте `/settings/api` в конец текущего URL.

### Способ 3: Через поиск

1. Нажмите `⌘K` (или кликните на поиск)
2. Введите "API settings" или "API keys"
3. Выберите нужный результат

## ✅ На странице Settings → API вы увидите:

### Project URL
```
https://tgeeuqmzxynkqudoihjv.supabase.co
```
(У вас уже есть)

### Project API keys

#### anon public
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
→ Скопируйте этот ключ

#### service_role secret
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
→ Скопируйте этот ключ (может быть скрыт - нажмите "Reveal")

## 🚀 После получения ключей:

Запустите:
```bash
./setup-supabase.sh
```

Вставьте все три значения.


