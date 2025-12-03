## Обзор проекта

Это клон Netflix, построенный на Next.js (Pages Router), TypeScript, Prisma с MongoDB и NextAuth.js для аутентификации. Приложение предоставляет аутентификацию пользователей (email/пароль, GitHub, Google OAuth) и интерфейс для просмотра фильмов.

## Команды разработки

### Запуск сервера разработки
```bash
npm run dev
```
Запускает dev-сервер Next.js с webpack и генерирует типы Prisma клиента.

### Сборка для продакшена
```bash
npm build
```

### Линтинг
```bash
npm run lint
```

### Команды Prisma
Генерация Prisma клиента (автоматически выполняется при `npm run dev`):
```bash
npx prisma generate
```

Отправка изменений схемы в MongoDB:
```bash
npx prisma db push
```

Открыть Prisma Studio для просмотра/редактирования данных:
```bash
npx prisma studio
```

## Архитектура

### База данных и ORM
- **Prisma** с **MongoDB** в качестве базы данных
- Кастомное расположение Prisma клиента: `prisma/client/`
- Основные модели: `User`, `Account`, `Session`, `VerificationToken`, `Movie`
- Singleton Prisma клиента экспортируется из `lib/prismadb.ts`

### Аутентификация
- Конфигурация **NextAuth.js** в `pages/api/auth/[...nextauth].ts`
- Три провайдера аутентификации:
    - Credentials (email/пароль с bcrypt)
    - GitHub OAuth
    - Google OAuth
- PrismaAdapter для управления сессиями
- JWT стратегия для сессий
- Кастомная страница входа на `/auth`
- Хелпер для серверной аутентификации: `lib/serverAuth.ts` (валидирует сессию и получает текущего пользователя)

### API Routes (Pages Router)
Расположены в `pages/api/`:
- `/api/auth/[...nextauth]` - обработчики NextAuth.js
- `/api/register` - эндпоинт регистрации пользователя
- `/api/current` - получение текущего аутентифицированного пользователя

### Получение данных
- **SWR** для клиентского получения данных с автоматической ревалидацией
- Утилита fetcher на основе Axios в `lib/fetcher.ts`
- Кастомные хуки в директории `hooks/` (например, `useCurrentUser.ts`)

### Стилизация
- **Tailwind CSS v4** (использует новый подход на основе CLI)
- Глобальные стили в `styles/globals.css`
- Конфигурация PostCSS в `postcss.config.js`

### Структура файлов
```
pages/           # Страницы Next.js (Pages Router)
  api/           # Обработчики API routes
  _app.tsx       # Обёртка приложения
  index.tsx      # Главная страница
  auth.tsx       # Страница аутентификации
  profiles.tsx   # Страница профилей пользователей

components/      # React компоненты
  Input.tsx
  NavBar.tsx
  NavbarItem.tsx
  MobileMenu.tsx
  AccountMenu.tsx

lib/             # Утилиты и конфигурации
  prismadb.ts    # Singleton Prisma клиента
  serverAuth.ts  # Хелпер серверной аутентификации
  fetcher.ts     # Утилита fetcher для SWR

hooks/           # Кастомные React хуки
  useCurrentUser.ts

prisma/          # Схема базы данных и сгенерированный клиент
  schema.prisma  # Определение Prisma схемы
  client/        # Сгенерированный Prisma клиент (кастомный вывод)

public/          # Статические ресурсы
  images/        # Изображения

styles/          # Глобальные стили
  globals.css
```

### Конфигурация TypeScript
- Алиас пути `@/*` указывает на корень проекта
- Включен strict mode
- Module resolution: bundler
- JSX: react-jsx

### Переменные окружения
Необходимы в `.env`:
- `DATABASE_URL` - строка подключения к MongoDB
- `NEXTAUTH_JWT_SECRET` - секрет для подписи JWT
- `NEXTAUTH_SECRET` - секрет NextAuth.js
- `GITHUB_ID` - ID клиента GitHub OAuth
- `GITHUB_SECRET` - секрет GitHub OAuth
- `GOOGLE_CLIENT_ID` - ID клиента Google OAuth
- `GOOGLE_CLIENT_SECRET` - секрет Google OAuth

## Ключевые паттерны реализации

### Серверная аутентификация
Используйте `serverAuth` из `lib/serverAuth.ts` в API routes для проверки аутентификации пользователя:
```typescript
import serverAuth from "@/lib/serverAuth";
const { currentUser } = await serverAuth(req);
```

### Клиентское получение данных
Создавайте кастомные хуки используя паттерн SWR:
```typescript
import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useData = () => {
  const { data, error, isLoading } = useSWR('/api/endpoint', fetcher);
  return { data, error, isLoading };
};
```

### Доступ к базе данных через Prisma
Всегда импортируйте singleton клиент из `lib/prismadb.ts`:
```typescript
import prismadb from "@/lib/prismadb";
```

## Важные замечания

- Этот проект использует Next.js **Pages Router**, а не App Router
- Prisma клиент генерируется в кастомное расположение (`prisma/client/`) - используйте импорт из `lib/prismadb.ts`
- Поток аутентификации полагается на сессии NextAuth.js, валидируемые на сервере через `serverAuth`
- Используется MongoDB с Prisma (примечание: некоторые функции Prisma могут отличаться от SQL баз данных)
