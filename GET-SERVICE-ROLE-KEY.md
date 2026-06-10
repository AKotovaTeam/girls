# 🔑 Получите service_role secret key

## ✅ У вас уже есть:

1. **Project URL**: `https://tgeeuqmzxynkqudoihjv.supabase.co`
2. **Anon public key**: `sb_publishable_BYEPxPPqpVXVDeTYjH2eCQ_eRDpAiRC`

## 📋 Осталось получить:

### service_role secret key

На странице **Settings → API**, в секции **"Project API keys"**:

1. Найдите **"service_role secret"**
2. Ключ может быть **скрыт** - нажмите кнопку **"Reveal"** чтобы показать
3. Скопируйте ключ (он будет длинной строкой, похожей на anon key)

**⚠️ ВАЖНО:** 
- Это **секретный ключ** - не публикуйте его!
- Он нужен для server-side операций
- Без него приложение не сможет работать с базой данных

## 🚀 После получения service_role key:

Запустите скрипт:
```bash
./setup-supabase.sh
```

Скрипт попросит ввести:
1. **NEXT_PUBLIC_SUPABASE_URL** → `https://tgeeuqmzxynkqudoihjv.supabase.co`
2. **NEXT_PUBLIC_SUPABASE_ANON_KEY** → `sb_publishable_BYEPxPPqpVXVDeTYjH2eCQ_eRDpAiRC`
3. **SUPABASE_SERVICE_ROLE_KEY** → вставьте service_role secret key

## 📍 Где найти на странице:

Страница Settings → API выглядит примерно так:

```
Project URL
https://tgeeuqmzxynkqudoihjv.supabase.co

Project API keys
┌─────────────────────────────────────┐
│ anon public                         │
│ sb_publishable_BYEPxPPqpVXVDeTYj... │ ✅ У вас есть
│ [Copy]                              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ service_role secret                 │
│ [Reveal] [Copy]  ← НАЖМИТЕ REVEAL   │ ⚠️ Нужно получить
│ (скрыт)                              │
└─────────────────────────────────────┘
```

## ✅ После настройки всех 3 значений:

1. Перезапустите сервер: `npm run dev`
2. Откройте: http://test.localhost:3000


