# MVP Specification: МегаКорп — Путь к Прогрессу

**Дата:** 10.04.2026  
**Версия:** 2.0 MVP (Updated)  
**Status:** SPECIFICATION

---

## Overview

MVP образовательной ролевой игры для обучения AI-assisted PM и разработчиков. Игрок проходит 3 главы, собирает инструменты, прокачивает навыки — и формирует реальные компетенции.

**Development:** Local only  
**Target Deployment:** VK Mini App + GitHub Pages (static)  
**Backend:** Docker + DevTunnels (MVP, no cloud deploy)

---

## Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   DEVELOPMENT ENVIRONMENT:                                   │
│   └── Local only                                            │
│   └── PostgreSQL: Already installed locally (localhost:5432) │
│                                                             │
│   FRONTEND:                                                │
│   ├── React 22+ (Latest stable)                            │
│   ├── React Router v7 (Hash Router для VK compatibility)   │
│   ├── Context API (управление состоянием)                  │
│   ├── Styled Components (стилизация)                        │
│   ├── Node.js 22.x (LTS)                                   │
│   └── package manager: pnpm / npm                          │
│                                                             │
│   BACKEND:                                                 │
│   ├── .NET 10 (Web API)                                    │
│   ├── Entity Framework Core (БД)                          │
│   ├── PostgreSQL (подключение к localhost:5432)            │
│   ├── Docker (API container для деплоя)                   │
│   ├── DevTunnels (для проброса наружу)                    │
│   └── OpenAI API / OpenRouter (AI-тьютор, ревьюер)        │
│                                                             │
│   AUTH:                                                    │
│   └── Кастомный код приглашения (10 символов)              │
│                                                             │
│   DEPLOY TARGET (Post-MVP):                               │
│   ├── Frontend: VK Hosting / GitHub Pages                  │
│   ├── Backend: Russian cloud (Docker container)            │
│   └── Database: Managed PostgreSQL (отдельный сервер)      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### React Router v7 Hash Router Configuration

```typescript
// Используем Hash Router для совместимости с VK Mini App
import { HashRouter } from 'react-router';

<HashRouter>
  <App />
</HashRouter>

// Роуты будут вида: /#/chapter/1, /#/quest/q1.1
// Это избегает проблем с VK router и history API
```

### Docker для Backend (Production Deploy)

```yaml
# docker-compose.yml (только для API)
version: '3.9'

services:
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__Default=Host=${DB_HOST};Database=${DB_NAME};User=${DB_USER};Password=${DB_PASSWORD}
      - OpenAI__ApiKey=${OPENAI_API_KEY}
    restart: unless-stopped

# PostgreSQL - отдельный сервер (не в Docker)
# Подключение к: DB_HOST=managed-postgres.example.com
```

```dockerfile
# backend/Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["Api/Api.csproj", "Api/"]
RUN dotnet restore "Api/Api.csproj"
COPY . .
RUN dotnet build "Api/Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Api/Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Api.dll"]
```

### DevTunnels Setup

```bash
# Запуск dev tunnel для API
dotnet run --devtunnel
# или
dotnet devtunnel tunnel create --name megakorp-api
dotnet devtunnel tunnel expose 5000 --protocol http
```

---

## Design System

### Color Palette (Education-Focused)

**Исследование:** Фиолетовый и голубой отлично подходят для образовательных проектов:
- Фиолетовый ассоциируется с креативностью, мудростью, инновациями
- Голубой/синий снижает тревожность, улучшает концентрацию
- Контрастные акценты для gamification элементов

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   LIGHT THEME (Default):                                   │
│                                                             │
│   Primary:     #6366F1 (Indigo-500, основной фиолетовый)  │
│   Primary Alt: #8B5CF6 (Violet-500, вторичный фиолетовый) │
│   Secondary:   #06B6D4 (Cyan-500, голубой акцент)        │
│   Secondary Alt: #22D3EE (Cyan-400, светлый голубой)      │
│   Background:  #FFFFFF (белый)                            │
│   Surface:     #F8FAFC (Slate-50, карточки)              │
│   Text:        #1E293B (Slate-800)                        │
│   Text Muted: #64748B (Slate-500)                        │
│   Border:      #E2E8F0 (Slate-200)                       │
│                                                             │
│   GAMIFICATION:                                           │
│   Success:     #10B981 (Emerald-500, зеленый)            │
│   Warning:     #F59E0B (Amber-500, желтый)              │
│   Error:       #EF4444 (Red-500, красный)                │
│   XP:          #A855F7 (Purple-500, для XP)              │
│   Level:       #6366F1 (Indigo-500, для уровней)          │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   DARK THEME:                                             │
│                                                             │
│   Primary:     #818CF8 (Indigo-400, светлый фиолетовый)  │
│   Primary Alt: #A78BFA (Violet-400)                      │
│   Secondary:   #22D3EE (Cyan-400, голубой акцент)        │
│   Secondary Alt: #67E8F9 (Cyan-300)                       │
│   Background:  #0F172A (Slate-900, темный фон)            │
│   Surface:     #1E293B (Slate-800, карточки)              │
│   Text:        #F1F5F9 (Slate-100)                       │
│   Text Muted:  #94A3B8 (Slate-400)                       │
│   Border:      #334155 (Slate-700)                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Semantic Colors

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   SEMANTIC TOKENS:                                         │
│                                                             │
│   --color-accent-primary    → Primary (фиолетовый)         │
│   --color-accent-secondary  → Secondary (голубой)          │
│   --color-success          → Success (зеленый)             │
│   --color-warning          → Warning (желтый)             │
│   --color-error            → Error (красный)               │
│   --color-xp               → XP color (фиолетовый)        │
│   --color-level            → Level color (индиго)         │
│   --color-streak           → Streak/fire (оранжевый)      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Typography

**Исследование:** Для образовательных проектов лучше работают:
- sans-serif шрифты для экранов (высокая читаемость)
- Не слишком тонкие (для долгого чтения)
- Хорошо различимые символы (для кода)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   FONTS:                                                   │
│                                                             │
│   PRIMARY FONT (UI, Body):                                │
│   └── Inter (Google Fonts)                                │
│       - Readable at all sizes                              │
│       - Excellent for screens                              │
│       - Wide language support                              │
│       - Fallback: system-ui, sans-serif                   │
│                                                             │
│   DISPLAY FONT (Headings):                                │
│   └── Inter Bold / SemiBold                              │
│       - Same family, consistency                          │
│       - Clear hierarchy                                   │
│                                                             │
│   MONOSPACE (Code, Technical):                            │
│   └── JetBrains Mono (Google Fonts)                        │
│       - Clear distinction between similar characters        │
│       - Designed for developers                           │
│       - Fallback: 'Fira Code', monospace                 │
│                                                             │
│   SIZING SCALE (8px base):                               │
│   ├── xs:   12px (captions)                              │
│   ├── sm:   14px (secondary text)                        │
│   ├── base: 16px (body)                                   │
│   ├── lg:   18px (emphasis)                              │
│   ├── xl:   20px (subheadings)                           │
│   ├── 2xl:  24px (headings)                             │
│   ├── 3xl:  32px (page titles)                          │
│   └── 4xl:  48px (hero text)                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Spacing System (8px base)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   SPACING:                                                 │
│   ├── xs:   4px                                           │
│   ├── sm:   8px                                           │
│   ├── md:   16px                                          │
│   ├── lg:   24px                                          │
│   ├── xl:   32px                                          │
│   ├── 2xl:  48px                                          │
│   └── 3xl:  64px                                          │
│                                                             │
│   BORDER RADIUS:                                           │
│   ├── sm:   4px  (inputs, small elements)                 │
│   ├── md:   8px  (cards, buttons)                          │
│   ├── lg:   16px (modals, large cards)                    │
│   └── full: 9999px (avatars, pills)                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Shadows

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   SHADOWS:                                                 │
│   ├── sm:  0 1px 2px rgba(0,0,0,0.05)                    │
│   ├── md:  0 4px 6px rgba(0,0,0,0.1)                     │
│   ├── lg:  0 10px 15px rgba(0,0,0,0.1)                   │
│   └── xl:  0 20px 25px rgba(0,0,0,0.15)                   │
│                                                             │
│   GLOW (для gamification):                                │
│   ├── xp-glow:   0 0 20px rgba(168,85,247,0.4)           │
│   ├── level-glow: 0 0 20px rgba(99,102,241,0.4)           │
│   └── streak-glow: 0 0 20px rgba(251,146,60,0.4)          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Avatar System

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   AVATARS (Simple, AI-ready for future):                   │
│                                                             │
│   NPC AVATARS:                                             │
│   ├── Круг с первой буквой имени                          │
│   ├── Цвет фона = primary color                           │
│   ├── Белая буква внутри                                  │
│   ├── Размер: 40px (small), 64px (medium), 96px (large)  │
│   └── Пример: [М] [Н] [Д] [А]                            │
│                                                             │
│   USER AVATAR:                                            │
│   ├── По умолчанию: gradient circle                       │
│   ├── С инициалами или emoji                             │
│   └── VK photo integration (future)                       │
│                                                             │
│   КАК БУДЕТ ВЫГЛЯДЕТЬ:                                   │
│   ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐                     │
│   │  М  │  │  Н  │  │  Д  │  │  А  │                     │
│   │violet│  │cyan │  │green│  │orange│                     │
│   └─────┘  └─────┘  └─────┘  └─────┘                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Russian Cloud Providers (Research)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   CLOUD PROVIDERS ДЛЯ РОССИЙСКОГО РЫНКА:                │
│   (PostgreSQL всегда как отдельный Managed Service)        │
│                                                             │
│   ════════════════════════════════════════════════════════ │
│                                                             │
│   ЯНДЕКС ОБЛАКО:                                          │
│   ├── PostgreSQL: Yandex Managed Service for PostgreSQL     │
│   ├── Compute/Serverless: API в контейнере/функции        │
│   ├── Container Registry: Docker образы                     │
│   ├── Object Storage: статика и файлы                      │
│   ├── Pros: Популярность, хорошая интеграция с VK          │
│   ├── Cons: Сложная регистрация                            │
│   └── Pricing: Pay-as-you-go, стартовые кредиты           │
│                                                             │
│   ════════════════════════════════════════════════════════ │
│                                                             │
│   СБЕР ОБЛАКО:                                            │
│   ├── PostgreSQL: Managed PostgreSQL                        │
│   ├── Compute: Облачные серверы                            │
│   ├── Kubernetes: для масштабирования                       │
│   ├── Pros: Надёжность, поддержка                         │
│   ├── Cons: Может быть дороже                             │
│   └── Pricing: Корпоративные тарифы                       │
│                                                             │
│   ════════════════════════════════════════════════════════ │
│                                                             │
│   TIMEWEB CLOUD:                                          │
│   ├── PostgreSQL: Managed PostgreSQL (отдельный сервер)    │
│   ├── VPS: Для Docker контейнера с API                     │
│   ├── Pros: Простая регистрация, дешевле                  │
│   ├── Cons: Меньше интеграций                              │
│   └── Pricing: Starting ~300₽/month                       │
│                                                             │
│   ════════════════════════════════════════════════════════ │
│                                                             │
│   VK CLOUD:                                               │
│   ├── PostgreSQL: Managed PostgreSQL                       │
│   ├── Compute/Serverless: API                              │
│   ├── Storage: для файлов                                 │
│   ├── Pros: Интеграция с VK Mini Apps                     │
│   ├── Cons: Ограниченные регионы                           │
│   └── Pricing: Pay-as-you-go                              │
│                                                             │
│   ════════════════════════════════════════════════════════ │
│                                                             │
│   RECOMMENDATION MVP:                                     │
│   └── Timeweb Cloud (просто, дешево, достаточно)          │
│                                                             │
│   RECOMMENDATION SCALE:                                   │
│   └── Яндекс Облако или VK Cloud (интеграция с VK)       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
```

---

## Core Features

### F1: Система авторизации (Код приглашения)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   FLOW:                                                    │
│                                                             │
│   1. Пользователь открывает приложение                     │
│   2. Видит экран: "Введите код приглашения"                │
│   3. Вводит 10-значный код (формат: XXXX-XXXX-XX)         │
│   4. Система валидирует код:                               │
│      • Действителен ли код?                               │
│      • Не использован ли уже?                              │
│      • Привязан ли к конкретному треку (PM/Dev)?          │
│   5. Если OK → создаём пользователя, привязываем код      │
│   6. Если нет → сообщение об ошибке                        │
│                                                             │
│   КОДЫ ПРИГЛАШЕНИЙ:                                      │
│   • Генерируются админом                                  │
│   • Могут быть одноразовые или многоразовые               │
│   • Могут истекать по времени                             │
│   • Могут быть привязаны к track (PM/Dev)                │
│                                                             │
│   Пример кода: MEGA-2026-001                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**API Endpoints:**
```
POST /api/auth/validate
  Request: { code: "MEGA-2026-001" }
  Response: { valid: true, track: "pm", used: false }
  
POST /api/auth/register
  Request: { code: "MEGA-2026-001", name: "Иван", track: "pm" }
  Response: { userId: "uuid", token: "jwt" }
```

### F2: Профиль игрока

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ПРОФИЛЬ:                                                 │
│                                                             │
│   {                                                        │
│     "userId": "uuid",                                     │
│     "name": "Иван",                                       │
│     "track": "pm",  // или "dev"                         │
│     "xp": 1250,                                           │
│     "level": 3,                                           │
│     "createdAt": "2026-04-10",                           │
│     "lastActive": "2026-04-10",                          │
│     "inviteCodeUsed": "MEGA-2026-001"                     │
│   }                                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### F3: Система навыков

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   НАВЫКИ ДЛЯ MVP:                                          │
│                                                             │
│   ┌─────────────────────────────────────────────────┐     │
│   │                                                   │     │
│   │   PM TRACK:                                     │     │
│   │   ├── AI Fundamentals       [████████░░] Lv.3  │     │
│   │   ├── VibeCoding            [████░░░░░░] Lv.1  │     │
│   │   ├── Prototyping           [░░░░░░░░░░] Lv.0  │     │
│   │   ├── Testing               [░░░░░░░░░░] Lv.0  │     │
│   │   ├── Deployment            [░░░░░░░░░░] Lv.0  │     │
│   │   └── Product Thinking      [░░░░░░░░░░] Lv.0  │     │
│   │                                                   │     │
│   │   БОНУС:                                         │     │
│   │   ├── Security & Privacy    [██████░░░░] Lv.2  │     │
│   │   └── AI Mindset            [██████████] Lv.4   │     │
│   │                                                   │     │
│   └─────────────────────────────────────────────────┘     │
│                                                             │
│   XP РАСПРЕДЕЛЕНИЕ:                                       │
│   • Задание выполнено: +100-300 XP                        │
│   • Самостоятельная находка ошибки: +50 XP бонус         │
│   • Завершение главы: +500 XP                             │
│   • Серия дней: +20 XP/день                               │
│                                                             │
│   LEVELING:                                               │
│   • Level 1: 0 XP                                         │
│   • Level 2: 500 XP                                       │
│   • Level 3: 1500 XP                                      │
│   • Level 4: 3000 XP                                      │
│   • Level 5: 5000 XP                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### F4: Инвентарь инструментов

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ИНСТРУМЕНТЫ ДЛЯ MVP:                                     │
│                                                             │
│   ПОЛУЧЕННЫЕ:                                              │
│   ├── [✓] Промптер Базовый (Lv.1)                         │
│   │      "Умею писать простые промты"                      │
│   │                                                   │
│   ├── [✓] Промптер Продвинутый (Lv.2)                     │
│   │      "Промты с контекстом и примерами"                │
│   │                                                   │
│   ├── [✓] Чеклист Требований (Lv.1)                       │
│   │      "Шаблон для проверки требований"                 │
│   │                                                   │
│   ├── [🔒] Шаблон MVP (locked, need Lv.2 Prototyping)     │
│   │                                                   │
│   ├── [🔒] CI/CD Pipeline (locked, need Lv.2 Deployment)  │
│   │                                                   │
│   └── [🔒] Security Scanner (locked, need Lv.2 Security) │
│                                                             │
│   КАК ПОЛУЧИТЬ:                                           │
│   • Завершить задание → инструмент разблокируется          │
│   • Иногда нужно определённое кол-во XP в навыке           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### F5: Главы и квесты

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   MVP: 3 ГЛАВЫ + БОКОВЫЕ КВЕСТЫ                          │
│                                                             │
│   ════════════════════════════════════════════════════════│
│                                                             │
│   ГЛАВА 1: ПРИБЫТИЕ                                      │
│   ─────────────────────────────────────────                │
│                                                             │
│   • Q1.1: Знакомство с МегаКорп [Tutorial]                │
│   • Q1.2: Встреча с Командой Прогресса [Story]            │
│   • Q1.3: Задание от Валерия Педровича [Practice]          │
│   • Q1.4: Первая встреча с Максом [Tutorial]              │
│                                                             │
│   ГЛАВА 2: ОСНОВЫ AI                                     │
│   ─────────────────────────────────────────                │
│                                                             │
│   • Q2.1: Что такое AI-агенты? [Tutorial]                  │
│   • Q2.2: Как работает LLM [Tutorial]                     │
│   • Q2.3: Типы AI-агентов [Practice]                      │
│   • Q2.4: Практика: Общение с AI [Practice]               │
│   • Q2.5: Макс рассказывает о себе [Story]                 │
│                                                             │
│   ГЛАВА 3: ПЕРВЫЙ ПРОМТ                                  │
│   ─────────────────────────────────────────                │
│                                                             │
│   • Q3.1: Искусство инструкций [Tutorial]                  │
│   • Q3.2: Контекст и ясность [Practice]                   │
│   • Q3.3: Итеративное улучшение [Practice]                │
│   • Q3.4: Промт для Ворчунов [Challenge]                  │
│   • Q3.5: Финал главы: Разговор с Наташей [Story]          │
│                                                             │
│   ════════════════════════════════════════════════════════│
│                                                             │
│   БОКОВЫЕ КВЕСТЫ: SECURITY                                │
│   ─────────────────────────────────                        │
│                                                             │
│   • BS1: Что нельзя отправлять AI? [Tutorial]              │
│   • BS2: Найди уязвимость [Practice]                     │
│   • BS3: Секретный документ Ворчуна [Exploration]         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### F6: AI-Тьютор (Макс)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   МЕХАНИКА:                                                │
│                                                             │
│   Макс появляется:                                         │
│   • В начале каждой главы (туториал)                       │
│   • При выполнении практических заданий (подсказки)       │
│   • После завершения главы (ретроспектива)                │
│   • Когда игрок застревает (3+ неудачных попыток)          │
│                                                             │
│   ДИАЛОГОВЫЙ ФОРМАТ:                                      │
│   ┌─────────────────────────────────────────────────┐     │
│   │                                                   │     │
│   │   МАКС:                                          │     │
│   │   Эй! Вижу, ты работаешь над промтом.              │     │
│   │   Хочешь, подскажу или сам попробуешь?             │     │
│   │                                                   │     │
│   │   [💡 Подскажи]  [🤔 Попробую сам]               │     │
│   │                                                   │     │
│   └─────────────────────────────────────────────────┘     │
│                                                             │
│   ТИПЫ СООБЩЕНИЙ МАКСА:                                  │
│   • Обучение: Объясняет концепцию                         │
│   • Направление: Задаёт вопросы (Socratic)               │
│   • Поддержка: "Ты справишься!"                          │
│   • Праздник: "Отлично! Ты нашёл сам!"                    │
│   • Рефлексия: "Что ты понял?"                           │
│                                                             │
│   API ИНТЕГРАЦИЯ:                                         │
│   POST /api/tutor/message                                 │
│   Request: { userId, chapterId, questId, message, context }│
│   Response: { text, suggestions[], emotion }               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### F7: Проверка заданий (Solution Reviewer)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ТИПЫ ЗАДАНИЙ И ПРОВЕРКА:                               │
│                                                             │
│   1. PROMPT (напиши промт)                                │
│      → Проверка: структура, ясность, контекст              │
│      → Шкала: 1-5 звёзд                                   │
│                                                             │
│   2. QUIZ (выбери ответ)                                  │
│      → Проверка: правильный ответ                          │
│      → Мгновенный результат                                │
│                                                             │
│   3. TEXT_ANSWER (опиши/объясни)                          │
│      → Проверка: ключевые слова, понимание                  │
│      → AI-assisted review                                 │
│                                                             │
│   4. MULTI_STEP (несколько шагов)                         │
│      → Проверка каждого шага                              │
│      → Частичный зачёт                                     │
│                                                             │
│   ════════════════════════════════════════════════════════│
│                                                             │
│   ФОРМАТ ОТВЕТ:                                            │
│   ┌─────────────────────────────────────────────────┐     │
│   │                                                   │     │
│   │   ЭКСПЕРТИЗА РЕШЕНИЯ                             │     │
│   │   ─────────────────────                           │     │
│   │                                                   │     │
│   │   Оценка: ⭐⭐⭐⭐☆ (4/5)                        │     │
│   │                                                   │     │
│   │   ✅ Сильные стороны:                            │     │
│   │   • Хороший контекст                             │     │
│   │   • Чёткие инструкции                            │     │
│   │                                                   │     │
│   │   ⚠️ Можно улучшить:                            │     │
│   │   • Добавить формат вывода                       │     │
│   │   • Уточнить ролевые инструкции                  │     │
│   │                                                   │     │
│   │   💡 Наводка (если ошибки):                      │     │
│   │   "Что если добавить пример того, какой          │     │
│   │    вывод ты ожидаешь?"                          │     │
│   │                                                   │     │
│   │   XP: +150 (100 базовые + 50 за 4+ звёзда)     │     │
│   │                                                   │     │
│   └─────────────────────────────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### F8: Academy of Experience

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   СТРУКТУРА ЗАПИСИ:                                       │
│                                                             │
│   {                                                        │
│     "id": "uuid",                                         │
│     "questId": "Q3.2",                                    │
│     "mistakeType": "vague_context",                        │
│     "mistakeDescription": "Написал промт без контекста",   │
│     "selfDiscovered": true,                                │
│     "discoveryAttempts": 1,                                │
│     "learnerInsight": "Контекст помогает AI понять...",   │
│     "xpBonus": 50,                                        │
│     "createdAt": "2026-04-10"                             │
│   }                                                        │
│                                                             │
│   ОТОБРАЖЕНИЕ:                                             │
│   ┌─────────────────────────────────────────────────┐     │
│   │                                                   │     │
│   │   📔 МОЯ АКАДЕМИЯ ОПЫТА                         │     │
│   │                                                   │     │
│   │   ┌─────────────────────────────────────────┐  │     │
│   │   │  💡 Контекст важнее, чем я думал          │  │     │
│   │   │  Найдено: Самостоятельно (1 попытка)     │  │     │
│   │   │  XP: +50                                 │  │     │
│   │   └─────────────────────────────────────────┘  │     │
│   │                                                   │     │
│   │   📊 Статистика:                                │     │
│   │   • Всего записей: 8                           │     │
│   │   • Найдено сам: 5 (62%)                      │     │
│   │   • Бонус XP: +250                            │     │
│   │                                                   │     │
│   └─────────────────────────────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### F9: Система ачивок

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   MVP ACHIEVEMENTS:                                        │
│                                                             │
│   ✅ ПОЛУЧЕНЫ:                                             │
│   ├── Добро пожаловать в МегаКорп                         │
│   ├── Первый промт                                         │
│   ├── Три звезды — Промт уровня "Хорошо"                  │
│   ├── Самостоятельный наход — Первая ошибка найдена сама    │
│   └── Завершено: Глава 1                                   │
│                                                             │
│   🔓 ДОСТУПНЫ:                                             │
│   ├── Завершено: Глава 2 (нужно завершить)                │
│   ├── Завершено: Глава 3 (нужно завершить)                │
│   ├── Пять звёзд — Промт уровня "Отлично"                 │
│   └── Академик — 10 записей в Academy                      │
│                                                             │
│   🔒 ЗАБЛОКИРОВАНЫ:                                        │
│   ├── Прогресс-агент (нужно завершить MVP)                 │
│   ├── Помощник Ворчунов (нужно помочь 3 игрокам)          │
│   └── Коллекционер (нужно собрать 5 инструментов)          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ТАБЛИЦЫ:                                                 │
│                                                             │
│   users                                                     │
│   ├── id (UUID, PK)                                       │
│   ├── name (VARCHAR)                                       │
│   ├── track (ENUM: pm, dev)                                │
│   ├── xp (INT)                                             │
│   ├── level (INT)                                          │
│   ├── invite_code_id (FK)                                  │
│   ├── created_at (TIMESTAMP)                               │
│   └── last_active (TIMESTAMP)                              │
│                                                             │
│   invite_codes                                              │
│   ├── id (UUID, PK)                                       │
│   ├── code (VARCHAR, UNIQUE)                               │
│   ├── track (ENUM: pm, dev, any)                          │
│   ├── is_single_use (BOOLEAN)                              │
│   ├── used (BOOLEAN)                                       │
│   ├── expires_at (TIMESTAMP, nullable)                     │
│   └── created_at (TIMESTAMP)                               │
│                                                             │
│   quest_progress                                            │
│   ├── id (UUID, PK)                                       │
│   ├── user_id (FK)                                        │
│   ├── quest_id (VARCHAR)                                   │
│   ├── status (ENUM: locked, available, in_progress,        │
│   │               completed, failed)                       │
│   ├── attempts (INT)                                       │
│   ├── best_score (INT)                                     │
│   ├── completed_at (TIMESTAMP)                             │
│   └── data (JSONB) — ответы, избранное                    │
│                                                             │
│   skill_progress                                            │
│   ├── id (UUID, PK)                                       │
│   ├── user_id (FK)                                        │
│   ├── skill_id (VARCHAR)                                   │
│   ├── level (INT)                                          │
│   ├── xp (INT)                                             │
│   └── updated_at (TIMESTAMP)                               │
│                                                             │
│   tools_inventory                                           │
│   ├── id (UUID, PK)                                       │
│   ├── user_id (FK)                                        │
│   ├── tool_id (VARCHAR)                                    │
│   ├── level (INT)                                          │
│   ├── unlocked_at (TIMESTAMP)                              │
│   └── data (JSONB)                                         │
│                                                             │
│   academy_entries                                           │
│   ├── id (UUID, PK)                                        │
│   ├── user_id (FK)                                         │
│   ├── quest_id (VARCHAR)                                   │
│   ├── mistake_type (VARCHAR)                               │
│   ├── mistake_description (TEXT)                            │
│   ├── self_discovered (BOOLEAN)                           │
│   ├── discovery_attempts (INT)                             │
│   ├── learner_insight (TEXT)                               │
│   ├── xp_bonus (INT)                                       │
│   └── created_at (TIMESTAMP)                               │
│                                                             │
│   achievements                                              │
│   ├── id (UUID, PK)                                       │
│   ├── user_id (FK)                                        │
│   ├── achievement_id (VARCHAR)                             │
│   └── unlocked_at (TIMESTAMP)                              │
│                                                             │
│   chat_history                                              │
│   ├── id (UUID, PK)                                       │
│   ├── user_id (FK)                                        │
│   ├── chapter_id (VARCHAR)                                 │
│   ├── quest_id (VARCHAR, nullable)                        │
│   ├── role (ENUM: user, assistant)                        │
│   ├── message (TEXT)                                       │
│   └── created_at (TIMESTAMP)                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## API Endpoints Summary

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   AUTH:                                                    │
│   POST /api/auth/validate     — Проверить код              │
│   POST /api/auth/register     — Зарегистрировать           │
│   GET  /api/auth/me           — Текущий пользователь       │
│                                                             │
│   USER:                                                   │
│   GET  /api/users/profile     — Профиль                    │
│   GET  /api/users/skills     — Навыки                     │
│   GET  /api/users/inventory  — Инструменты                 │
│   GET  /api/users/achievements — Ачивки                   │
│   GET  /api/users/academy   — Academy entries             │
│                                                             │
│   QUESTS:                                                 │
│   GET  /api/quests           — Все квесты                  │
│   GET  /api/quests/:id       — Конкретный квест           │
│   POST /api/quests/:id/start — Начать квест               │
│   POST /api/quests/:id/submit — Отправить решение          │
│   GET  /api/quests/:id/hint  — Получить подсказку         │
│                                                             │
│   CHAPTERS:                                                │
│   GET  /api/chapters         — Все главы                   │
│   GET  /api/chapters/:id    — Конкретная глава            │
│                                                             │
│   TUTOR:                                                  │
│   POST /api/tutor/message    — Сообщение Максу             │
│   GET  /api/tutor/context   — Контекст для Макса          │
│                                                             │
│   ADMIN (protected):                                       │
│   POST /api/admin/codes      — Создать коды               │
│   GET  /api/admin/codes      — Список кодов               │
│   GET  /api/admin/stats     — Статистика по пользователям  │
│   GET  /api/admin/analytics — Аналитика контента          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   /frontend                                                │
│   ├── /src                                                 │
│   │   ├── /components                                      │
│   │   │   ├── /common          (Button, Card, Modal...)   │
│   │   │   ├── /game            (QuestCard, SkillBar...)   │
│   │   │   ├── /chat            (ChatWindow, Message...)   │
│   │   │   └── /layout          (Header, Sidebar...)       │
│   │   ├── /pages                                        │
│   │   │   ├── Auth.tsx         (Invite code entry)        │
│   │   │   ├── Dashboard.tsx    (Main game view)          │
│   │   │   ├── Chapter.tsx      (Chapter view)            │
│   │   │   ├── Quest.tsx        (Quest execution)          │
│   │   │   ├── Profile.tsx      (User profile)            │
│   │   │   ├── Inventory.tsx    (Tools)                  │
│   │   │   ├── Academy.tsx      (Experience)             │
│   │   │   └── Admin.tsx       (Admin panel)            │
│   │   ├── /hooks                                         │
│   │   ├── /context                                        │
│   │   ├── /services            (API calls)               │
│   │   ├── /data               (quests, chapters config)  │
│   │   ├── /styles                                        │
│   │   └── /types                                         │
│   └── package.json                                         │
│                                                             │
│   /backend                                                 │
│   ├── /src                                                │
│   │   ├── /Controllers                                     │
│   │   │   ├── AuthController.cs                           │
│   │   │   ├── UserController.cs                          │
│   │   │   ├── QuestController.cs                         │
│   │   │   ├── ChapterController.cs                       │
│   │   │   ├── TutorController.cs                         │
│   │   │   └── AdminController.cs                         │
│   │   ├── /Services                                        │
│   │   │   ├── AuthService.cs                             │
│   │   │   ├── QuestService.cs                            │
│   │   │   ├── ReviewService.cs  (Solution Reviewer)     │
│   │   │   ├── TutorService.cs   (AI Tutor)             │
│   │   │   ├── SkillService.cs                            │
│   │   │   └── AnalyticsService.cs                        │
│   │   ├── /Models                                         │
│   │   ├── /DTOs                                           │
│   │   ├── /Data                    (DbContext)           │
│   │   └── /AI                     (AI prompts)          │
│   └── *.csproj                                             │
│                                                             │
│   /shared                                                  │
│   └── /types  (общие тайпскрипты и шарпы)                 │
│                                                             │
│   DOCKER:                                                  │
│   └── /backend/Dockerfile                                  │
│       (Для production deploy API в контейнере)              │
│       (PostgreSQL - отдельный сервер)                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Quest Configuration Example

```typescript
// data/quests/chapter1.ts

export const chapter1Quests: Quest[] = [
  {
    id: "Q1.1",
    title: "Знакомство с МегаКорп",
    type: "tutorial",
    chapterId: "C1",
    xpReward: 50,
    unlockRequirements: [],
    content: {
      intro: "Добро пожаловать в МегаКорп...",
      text: "Ты — новый сотрудник...",
    },
    tasks: [],
    nextQuest: "Q1.2",
  },
  {
    id: "Q1.3",
    title: "Задание от Валерия Педровича",
    type: "practice",
    chapterId: "C1",
    xpReward: 150,
    unlockRequirements: ["Q1.2"],
    content: {
      intro: "Валерий Педрович подозрительно смотрит...",
      task: "Валерий просит тебя помочь с...",
      expectedOutput: "Текст промта для AI",
    },
    validation: {
      type: "prompt",
      criteria: ["has_context", "has_clear_goal", "has_format"],
      minScore: 3,
    },
    hints: [
      "Попробуй начать с контекста: кто ты и зачем это нужно",
      "Добавь чёткую цель: что должен сделать AI",
      "Укажи формат вывода",
    ],
    xpBonusSelfDiscovery: 50,
    nextQuest: "Q1.4",
  },
];
```

---

## Deployment Plan

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   MVP DEVELOPMENT (Local Only):                           │
│   ════════════════════════════════════════════════════════ │
│   ├── Frontend: npm run dev (localhost:3000)              │
│   ├── Backend: dotnet run (localhost:5000)                │
│   ├── PostgreSQL: localhost:5432 (уже установлен)         │
│   └── DevTunnels: Проброс API наружу для тестирования     │
│                                                             │
│   ───────────────────────────────────────────────────────── │
│                                                             │
│   PHASE 1: Development (Week 1-2)                        │
│   ├── Все фичи локально                                    │
│   ├── Testing через DevTunnels                             │
│   └── Frontend build для VK тестирования                   │
│                                                             │
│   ───────────────────────────────────────────────────────── │
│                                                             │
│   PHASE 2: Content (Week 3)                               │
│   ├── QA testing локально                                 │
│   ├── Bug fixes                                           │
│   └── Content validation                                   │
│                                                             │
│   ───────────────────────────────────────────────────────── │
│                                                             │
│   PHASE 3: VK Mini App (Week 4)                          │
│   ├── VK Developer Console setup                          │
│   ├── Build frontend для VK                                │
│   ├── Тестирование в VK environment                       │
│   └── Приглашение beta testers (через VK)                  │
│                                                             │
│   ───────────────────────────────────────────────────────── │
│                                                             │
│   PHASE 4: Production Deploy (Post-MVP)                   │
│   ├── Frontend: VK Hosting + GitHub Pages (fallback)       │
│   ├── Backend: Docker container на Timeweb/Yandex Cloud     │
│   ├── PostgreSQL: Managed PostgreSQL (отдельный сервер)    │
│   └── Domain + SSL                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### VK Mini App Setup

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   VK MINI APP DEPLOYMENT:                                 │
│                                                             │
│   1. Создать приложение в VK Developer Console            │
│      https://dev.vk.com/                                  │
│                                                             │
│   2. Настроить Mini App:                                   │
│      - Название: МегаКорп                                  │
│      - Canvas URL: https://your-domain.com/               │
│      - Тип: Mini App                                      │
│                                                             │
│   3. Build для VK:                                        │
│      npm run build:vk                                      │
│      (special build с Hash Router)                         │
│                                                             │
│   4. Загрузить в VK Hosting:                              │
│      - Через VK Developer Console                         │
│      - Или VK CLI                                         │
│                                                             │
│   5. Fallback (GitHub Pages):                             │
│      npm run build                                        │
│      Deploy to gh-pages branch                             │
│      URL: https://username.github.io/megakorp             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### DevTunnels для тестирования

```bash
# 1. Установить dotnet dev-tunnels
dotnet tool install -g microsoft.dotnet-devtunnels

# 2. Создать persistent tunnel
dotnet devtunnel tunnel create --name megakorp-api --allow-anonymous

# 3. Expose backend port
dotnet devtunnel tunnel expose 5000 --protocol http

# 4. Получить URL типа: https://megakorp-api-xxxx.devtunnels.app/

# 5. Использовать для тестирования frontend
# В .env: REACT_APP_API_URL=https://megakorp-api-xxxx.devtunnels.app/api
```

---

## MVP Metrics

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ОТСЛЕЖИВАЕМЫЕ МЕТРИКИ:                                  │
│                                                             │
│   АКТИВАЦИЯ:                                              │
│   • % пользователей, введших код и начавших главу 1        │
│   • Время до первой конверсии                              │
│                                                             │
│   ВОВЛЕЧЁННОСТЬ:                                          │
│   • Среднее время на главу                                  │
│   • % завершения каждой главы                              │
│   • Количество диалогов с Максом                            │
│   • Self-discovery rate                                    │
│                                                             │
│   RETENTION:                                               │
│   • DAU/MAU                                                │
│   • Return rate Day 1, Day 3, Day 7                        │
│   • Drop-off points                                        │
│                                                             │
│   ОБУЧЕНИЕ:                                                │
│   • Average skill levels                                   │
│   • Quiz pass rates                                        │
│   • Academy entries per user                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Known Gaps & Technical Debt

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   НЕ ВКЛЮЧЕНО В MVP:                                      │
│   ├── Spaced Repetition notifications (после MVP)          │
│   ├── Командный режим / лидерборды                         │
│   ├── VK/Telegram auth (только invite codes пока)          │
│   ├── Полная аналитика для админов                          │
│   ├── Email notifications                                  │
│   ├── PWA / Offline mode                                  │
│   ├── Real-time notifications                              │
│   └── AI image avatars                                     │
│                                                             │
│   ТЕХНИЧЕСКИЙ ДОЛГ:                                       │
│   ├── AI prompts не параметризованы полностью              │
│   ├── Нет rate limiting                                   │
│   ├── Нет unit tests для backend                          │
│   ├── Нет E2E тестов                                      │
│   └── Redis excluded (session in DB for MVP)               │
│                                                             │
│   ПОСТ-МВП:                                               │
│   ├── Production deploy (Timeweb/Yandex)                   │
│   ├── CI/CD pipeline                                       │
│   ├── Monitoring & logging                                 │
│   └── Full Analytics Agent implementation                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Development Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   LOCAL DEVELOPMENT SETUP:                                 │
│   ════════════════════════════════════════════════════════ │
│                                                             │
│   PREREQUISITES:                                          │
│   ├── Node.js 22.x (LTS)                                  │
│   ├── .NET 10 SDK                                          │
│   ├── PostgreSQL (уже установлен локально)                 │
│   ├── Docker (для production build API)                    │
│   ├── pnpm / npm                                           │
│   └── Git                                                  │
│                                                             │
│   ───────────────────────────────────────────────────────── │
│                                                             │
│   POSTGRESQL SETUP (уже есть):                            │
│   ├── Host: localhost                                      │
│   ├── Port: 5432                                          │
│   ├── Database: megakorp                                   │
│   ├── User: postgres                                       │
│   └── Password: <local-password>                           │
│                                                             │
│   ───────────────────────────────────────────────────────── │
│                                                             │
│   STARTUP SEQUENCE:                                        │
│                                                             │
│   Terminal 1 (Backend):                                   │
│   cd backend                                              │
│   dotnet ef database update                                │
│   dotnet run                                               │
│   # API на http://localhost:5000                          │
│                                                             │
│   Terminal 2 (Frontend):                                   │
│   cd frontend                                             │
│   npm install                                              │
│   npm run dev                                              │
│   # App на http://localhost:3000                          │
│                                                             │
│   Terminal 3 (DevTunnel - optional):                      │
│   dotnet devtunnel tunnel expose 5000                     │
│   # Прокидывает API наружу для VK тестов                  │
│                                                             │
│   ───────────────────────────────────────────────────────── │
│                                                             │
│   VK TESTING:                                             │
│   ├── Использовать DevTunnel URL как API endpoint         │
│   ├── VK Mini App preview в VK Dev Console                │
│   └── Или загрузить build в VK Hosting для теста          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   LOCAL DEVELOPMENT SETUP:                                 │
│   ════════════════════════════════════════════════════════ │
│                                                             │
│   PREREQUISITES:                                          │
│   ├── Node.js 22.x (LTS)                                  │
│   ├── .NET 10 SDK                                          │
│   ├── Docker Desktop (только для postgres)                 │
│   ├── pnpm / npm                                           │
│   └── Git                                                  │
│                                                             │
│   ───────────────────────────────────────────────────────── │
│                                                             │
│   STARTUP SEQUENCE:                                        │
│                                                             │
│   Terminal 1 (Backend):                                   │
│   cd backend                                              │
│   docker compose up -d  # только postgres                  │
│   dotnet ef database update                                │
│   dotnet run                                               │
│   # API на http://localhost:5000                          │
│                                                             │
│   Terminal 2 (Frontend):                                   │
│   cd frontend                                             │
│   npm install                                              │
│   npm run dev                                              │
│   # App на http://localhost:3000                          │
│                                                             │
│   Terminal 3 (DevTunnel - optional):                      │
│   dotnet devtunnel tunnel expose 5000                     │
│   # Прокидывает API наружу для VK тестов                  │
│                                                             │
│   ───────────────────────────────────────────────────────── │
│                                                             │
│   VK TESTING:                                             │
│   ├── Использовать DevTunnel URL как API endpoint         │
│   ├── VK Mini App preview в VK Dev Console                │
│   └── Или загрузить build в VK Hosting для теста          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Environment Variables

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   FRONTEND (.env):                                         │
│   ├── REACT_APP_API_URL=http://localhost:5000/api         │
│   ├── REACT_APP_USE_DEVTUNNEL=false                        │
│   └── REACT_APP_VK_APP_ID=your_vk_app_id                   │
│                                                             │
│   BACKEND (.env):                                          │
│   ├── ConnectionStrings__Default=Host=localhost;Port=5432;  │
│   │   Database=megakorp;Username=postgres;Password=...     │
│   ├── OpenAI__ApiKey=sk-...                                │
│   ├── OpenAI__BaseUrl=https://api.openai.com/v1            │
│   ├── Jwt__Secret=your-secret-key-min-32-chars            │
│   ├── Jwt__ExpiryDays=30                                   │
│   └── AspNetCore__Urls=http://0.0.0.0:5000                │
│                                                             │
│   PRODUCTION (.env.prod):                                  │
│   ├── ConnectionStrings__Default=Host=DB_HOST;...           │
│   └── DB_HOST=managed-postgres.example.com                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   НЕ ВКЛЮЧЕНО В MVP:                                      │
│   ├── Spaced Repetition (будет после MVP)                  │
│   ├── Командный режим / лидерборды                         │
│   ├── Telegram/VK auth                                     │
│   ├── Полная аналитика для админов                         │
│   ├── Email notifications                                  │
│   └── PWA / Offline mode                                  │
│                                                             │
│   ТЕХНИЧЕСКИЙ ДОЛГ:                                       │
│   ├── AI prompts не параметризованы полностью              │
│   ├── Нет rate limiting                                   │
│   ├── Нет unit tests для backend                          │
│   └── Нет E2E тестов                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

**Status:** SPECIFICATION v2.1 APPROVED  
**Updated:** 10.04.2026 (Tech stack, Design System, Deployment, Docker clarification)
**Next:** Development Sprint 1
