## Обзор проекта

Это полнофункциональный клон Netflix, построенный на Next.js (Pages Router), TypeScript, Prisma с MongoDB и NextAuth.js для аутентификации. Приложение предоставляет:

- Аутентификацию пользователей (email/пароль, GitHub, Google OAuth)
- Профили пользователей
- Каталог фильмов с Billboard и списками фильмов
- Систему избранного
- Просмотр фильмов с видеоплеером
- Модальное окно с детальной информацией о фильме
- Адаптивный интерфейс с поддержкой мобильных устройств

## Технологический стек

### Frontend
- **Next.js 16** (Pages Router)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 3.4** (с @tailwindcss/cli v4)
- **SWR** - клиентское кэширование и получение данных
- **Zustand** - управление глобальным состоянием
- **Axios** - HTTP клиент
- **React Icons** - иконки

### Backend
- **Next.js API Routes** - серверные эндпоинты
- **NextAuth.js 4** - аутентификация
- **Prisma 6** - ORM
- **MongoDB** - база данных
- **bcrypt** - хеширование паролей

### Инструменты разработки
- **ESLint** - линтинг кода
- **PostCSS** - обработка CSS
- **Autoprefixer** - автоматические префиксы CSS

## Основная функциональность

### Аутентификация и профили
- Регистрация пользователей с email и паролем
- Вход через GitHub OAuth
- Вход через Google OAuth
- Выбор профиля пользователя
- Защищенные маршруты (требуют аутентификации)

### Каталог фильмов
- Billboard (главный баннер) с случайным фильмом
- Горизонтальные списки фильмов с прокруткой
- Карточки фильмов с превью и информацией
- Адаптивная сетка для разных размеров экрана

### Просмотр и взаимодействие
- Страница просмотра фильма с видеоплеером
- Добавление/удаление фильмов из избранного
- Модальное окно с детальной информацией о фильме
- Кнопка "Играть" для перехода к просмотру
- Отображение жанра и продолжительности

### UI/UX
- Адаптивная навигационная панель
- Мобильное меню для маленьких экранов
- Выпадающее меню аккаунта
- Плавающие labels для input полей
- Smooth animations и transitions

## Установка и настройка

### 1. Клонирование репозитория
```bash
git clone <repository-url>
cd netflix
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Настройка переменных окружения
Создайте файл `.env` в корне проекта и добавьте следующие переменные:

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database"

# NextAuth
NEXTAUTH_JWT_SECRET="your-jwt-secret"
NEXTAUTH_SECRET="your-nextauth-secret"

# GitHub OAuth
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 4. Настройка базы данных
```bash
# Применить схему к MongoDB
npx prisma db push

# (Опционально) Открыть Prisma Studio для просмотра данных
npx prisma studio
```

### 5. Запуск приложения
```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:3000`

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

### Маршруты приложения

**Публичные маршруты:**
- `/auth` - страница входа и регистрации

**Защищенные маршруты (требуют аутентификации):**
- `/` - главная страница с каталогом фильмов
- `/profiles` - выбор профиля пользователя
- `/watch/[movieId]` - просмотр конкретного фильма

### База данных и ORM
- **Prisma** с **MongoDB** в качестве базы данных
- Кастомное расположение Prisma клиента: `prisma/client/`
- Singleton Prisma клиента экспортируется из `lib/prismadb.ts`

**Модели данных:**
- `User` - пользователи с поддержкой OAuth и email/пароль аутентификации
  - `favoriteIds` - массив ID избранных фильмов
  - Связи с `Account` и `Session`
- `Account` - учетные записи OAuth провайдеров (GitHub, Google)
- `Session` - сессии пользователей для NextAuth.js
- `VerificationToken` - токены для верификации email
- `Movie` - фильмы с полями:
  - `title`, `description`, `genre`, `duration`
  - `videoUrl` - ссылка на видео
  - `thumbnailUrl` - превью фильма

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

**Аутентификация:**
- `GET/POST /api/auth/[...nextauth]` - обработчики NextAuth.js для всех OAuth провайдеров
- `POST /api/register` - регистрация нового пользователя (email, имя, пароль)
- `GET /api/current` - получение текущего аутентифицированного пользователя

**Фильмы:**
- `GET /api/movies` - получение списка всех фильмов
- `GET /api/movies/[movieId]` - получение детальной информации о конкретном фильме
- `GET /api/random` - получение случайного фильма для Billboard

**Избранное:**
- `GET /api/favorites` - получение списка избранных фильмов пользователя
- `POST /api/favorite` - добавление/удаление фильма из избранного

### Получение данных
- **SWR** для клиентского получения данных с автоматической ревалидацией
- Утилита fetcher на основе Axios в `lib/fetcher.ts`
- **Zustand** для управления глобальным состоянием (модальное окно)

**Кастомные хуки в директории `hooks/`:**
- `useCurrentUser` - получение данных текущего пользователя
- `useBillBoard` - получение случайного фильма для главного баннера
- `useMovieList` - получение списка всех фильмов
- `useFavorites` - получение избранных фильмов пользователя
- `useMovie` - получение детальной информации о конкретном фильме
- `useInfoModal` - управление состоянием модального окна с информацией о фильме

### Стилизация
- **Tailwind CSS v4** (использует новый подход на основе CLI)
- Глобальные стили в `styles/globals.css`
- Конфигурация PostCSS в `postcss.config.js`

### Структура файлов
```
pages/              # Страницы Next.js (Pages Router)
  api/              # Обработчики API routes
    auth/
      [...nextauth].ts  # Конфигурация NextAuth.js
    movies/
      index.ts          # GET - список всех фильмов
      [movieId].ts      # GET - детали фильма по ID
    register.ts         # POST - регистрация пользователя
    current.ts          # GET - текущий пользователь
    random.ts           # GET - случайный фильм для Billboard
    favorite.ts         # POST - добавление/удаление из избранного
    favorites.ts        # GET - список избранных фильмов
  _app.tsx          # Обёртка приложения
  index.tsx         # Главная страница с каталогом фильмов
  auth.tsx          # Страница входа/регистрации
  profiles.tsx      # Выбор профиля пользователя
  watch/
    [movieId].tsx   # Страница просмотра фильма

components/         # React компоненты
  Input.tsx         # Кастомный input с плавающим label
  NavBar.tsx        # Навигационная панель
  NavbarItem.tsx    # Элемент навигации
  MobileMenu.tsx    # Мобильное меню
  AccountMenu.tsx   # Выпадающее меню аккаунта
  Billboard.tsx     # Главный баннер с случайным фильмом
  MovieCard.tsx     # Карточка фильма
  MovieList.tsx     # Горизонтальный список фильмов
  PlayButton.tsx    # Кнопка воспроизведения
  FavoriteButton.tsx # Кнопка добавления в избранное
  InfoModal.tsx     # Модальное окно с информацией о фильме

lib/                # Утилиты и конфигурации
  prismadb.ts       # Singleton Prisma клиента
  serverAuth.ts     # Хелпер серверной аутентификации
  fetcher.ts        # Утилита fetcher для SWR

hooks/              # Кастомные React хуки
  useCurrentUser.ts # Получение текущего пользователя
  useBillBoard.ts   # Случайный фильм для баннера
  useMovieList.ts   # Список всех фильмов
  useFavorites.ts   # Избранные фильмы
  useMovie.ts       # Детали конкретного фильма
  useInfoModal.ts   # Управление модальным окном (Zustand)

prisma/             # Схема базы данных и сгенерированный клиент
  schema.prisma     # Определение Prisma схемы
  client/           # Сгенерированный Prisma клиент (кастомный вывод)

public/             # Статические ресурсы
  images/           # Изображения, логотипы, иконки

styles/             # Глобальные стили
  globals.css       # Tailwind CSS и глобальные стили
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

### Управление состоянием с Zustand
Для глобального состояния (модальное окно) используется Zustand:
```typescript
import useInfoModal from "@/hooks/useInfoModal";

const { isOpen, openModal, closeModal, movieId } = useInfoModal();
```

### Работа с избранным
API эндпоинт `/api/favorite` работает как toggle:
- Если фильм уже в избранном - удаляет его
- Если фильма нет в избранном - добавляет его

```typescript
const toggleFavorite = async (movieId: string) => {
  await axios.post('/api/favorite', { movieId });
  // Автоматическая ревалидация через SWR
};
```

## Компоненты приложения

### Основные компоненты

**Input** (`components/Input.tsx`)
- Кастомный input с плавающим label
- Поддержка различных типов (text, email, password)
- Встроенная валидация и стилизация

**NavBar** (`components/NavBar.tsx`)
- Адаптивная навигационная панель
- Интеграция с MobileMenu и AccountMenu
- Прозрачность при скролле

**Billboard** (`components/Billboard.tsx`)
- Главный баннер с случайным фильмом
- Кнопки "Играть" и "Больше информации"
- Автоматическое получение данных через `useBillBoard`

**MovieCard** (`components/MovieCard.tsx`)
- Карточка фильма с превью
- Hover эффекты с увеличением
- Интеграция с PlayButton, FavoriteButton и InfoModal

**MovieList** (`components/MovieList.tsx`)
- Горизонтальный скроллируемый список фильмов
- Отображение заголовка и массива фильмов
- Адаптивная сетка карточек

**InfoModal** (`components/InfoModal.tsx`)
- Модальное окно с детальной информацией о фильме
- Управление через Zustand store
- Кнопки воспроизведения и добавления в избранное

**FavoriteButton** (`components/FavoriteButton.tsx`)
- Кнопка добавления/удаления из избранного
- Иконка меняется в зависимости от состояния
- Автоматическая ревалидация данных после действия

## Разработка

### Добавление новых фильмов
Используйте Prisma Studio для добавления фильмов в базу данных:
```bash
npx prisma studio
```

Или создайте seed скрипт для заполнения базы данных тестовыми данными.

### Структура Movie модели
Каждый фильм должен содержать:
- `title` - название фильма
- `description` - описание
- `videoUrl` - URL видео файла
- `thumbnailUrl` - URL превью изображения
- `genre` - жанр
- `duration` - продолжительность (например, "1h 42m")

### Отладка
- Используйте React DevTools для отладки компонентов
- Проверяйте Network tab для мониторинга API запросов
- Prisma Studio помогает визуализировать данные в MongoDB
- SWR DevTools для отслеживания кэша и ревалидации

## Развертывание

### Vercel (рекомендуется)
1. Подключите репозиторий к Vercel
2. Добавьте переменные окружения в Vercel Dashboard
3. Разверните проект - Vercel автоматически определит Next.js конфигурацию

### Другие платформы
- Убедитесь, что платформа поддерживает Next.js Pages Router
- Настройте переменные окружения
- Запустите `npm run build` и `npm start`

### Важно для продакшена
- Используйте безопасные секреты для `NEXTAUTH_JWT_SECRET` и `NEXTAUTH_SECRET`
- Настройте правильные callback URLs для OAuth провайдеров
- Используйте production MongoDB cluster
- Настройте CORS и security headers

## Важные замечания

- Этот проект использует Next.js **Pages Router**, а не App Router
- Prisma клиент генерируется в кастомное расположение (`prisma/client/`) - используйте импорт из `lib/prismadb.ts`
- Поток аутентификации полагается на сессии NextAuth.js, валидируемые на сервере через `serverAuth`
- Используется MongoDB с Prisma (некоторые функции Prisma могут отличаться от SQL баз данных)
- Все защищенные маршруты проверяют аутентификацию через NextAuth session
- SWR автоматически кэширует и ревалидирует данные для оптимальной производительности

## Возможные улучшения

- Добавление поиска фильмов
- Категории и фильтрация по жанрам
- Множественные профили пользователей
- История просмотров
- Рейтинги и отзывы
- Рекомендации на основе предпочтений
- Поддержка субтитров
- Прогресс просмотра фильмов
- Email уведомления
- Административная панель для управления контентом
