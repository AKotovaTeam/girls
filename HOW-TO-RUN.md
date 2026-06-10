# 🚀 Как запустить скрипт для добавления в /etc/hosts

## 📍 Где находится скрипт?

Скрипт находится в папке проекта:
```
/Users/alyona/Cursor_project/Girls/add-hosts.sh
```

## 🎯 Способ 1: Запуск из текущей папки

Если вы уже в папке проекта, просто выполните:

```bash
./add-hosts.sh
```

## 🎯 Способ 2: Запуск из любой папки

```bash
cd /Users/alyona/Cursor_project/Girls
./add-hosts.sh
```

## 🎯 Способ 3: Полный путь

```bash
/Users/alyona/Cursor_project/Girls/add-hosts.sh
```

## ⚠️ Если скрипт не запускается

### Проблема: "Permission denied"

Сделайте скрипт исполняемым:
```bash
chmod +x add-hosts.sh
./add-hosts.sh
```

### Проблема: "Command not found"

Убедитесь, что вы в правильной папке:
```bash
cd /Users/alyona/Cursor_project/Girls
pwd  # Должно показать: /Users/alyona/Cursor_project/Girls
ls add-hosts.sh  # Должен показать файл
```

## 🔐 Что произойдет?

1. Скрипт проверит, есть ли уже записи в /etc/hosts
2. Если нет - попросит ввести пароль администратора
3. Добавит записи:
   - `127.0.0.1 test.localhost`
   - `127.0.0.1 admin.localhost`
4. Покажет результат

## ✅ После запуска

Проверьте результат:
```bash
grep -E "test.localhost|admin.localhost" /etc/hosts
```

Должны увидеть:
```
127.0.0.1 test.localhost
127.0.0.1 admin.localhost
```

## 🌐 Затем откройте в браузере

- http://test.localhost:3000
- http://admin.localhost:3000

## 📝 Альтернатива: Команда напрямую

Если скрипт не работает, выполните команду напрямую:

```bash
sudo bash -c 'echo -e "127.0.0.1 test.localhost\n127.0.0.1 admin.localhost" >> /etc/hosts'
```

Введите пароль, когда система попросит.


