# Product 3: Content Engine

**Дата создания:** 09.04.2026
**Статус:** INFRASTRUCTURE / ENABLER
**Владелец продукта:** (живой человек)

---

## Описание продукта

Инструмент и движок для автоматической генерации образовательного игрового контента из учебных материалов. Превращает учебник в игру.

**Ключевое отличие:** Автоматизация production pipeline для образовательных игр.

---

## Концепция

### Проблема

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   СОЗДАНИЕ ОБРАЗОВАТЕЛЬНОГО КОНТЕНТА                      │
│                                                             │
│   Ручной процесс:                                          │
│   ┌───────────────────────────────────────────────────┐   │
│   │                                                   │   │
│   │   Учебник (текст)                                │   │
│   │       │                                            │   │
│   │       ▼                                            │   │
│   │   Методист адаптирует                            │   │
│   │       │                                            │   │
│   │       ▼                                            │   │
│   │   Game designer создает квесты                    │   │
│   │       │                                            │   │
│   │       ▼                                            │   │
│   │   Художники рисуют ассеты                        │   │
│   │       │                                            │   │
│   │       ▼                                            │   │
│   │   Программисты реализуют                         │   │
│   │       │                                            │   │
│   │       ▼                                            │   │
│   │   QA тестирует                                    │   │
│   │       │                                            │   │
│   │       ▼                                            │   │
│   │   РЕЛИЗ (через 3-6 месяцев)                      │   │
│   │                                                   │   │
│   └───────────────────────────────────────────────────┘   │
│                                                             │
│   Cost: $100K-500K per subject                            │
│   Time: 3-6 months                                        │
│   Quality: Variable                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Решение: AI-powered Content Engine

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   CONTENT ENGINE                                            │
│                                                             │
│   ┌───────────────────────────────────────────────────┐   │
│   │                                                   │   │
│   │   Учебник (PDF, EPUB, URL)                        │   │
│   │       │                                            │   │
│   │       ▼                                            │   │
│   │   AI PARSER & ANALYZER                            │   │
│   │   • Извлекает структуру                            │   │
│   │   • Понимает зависимости тем                       │   │
│   │   • Идентифицирует ключевые концепции              │   │
│   │       │                                            │   │
│   │       ▼                                            │   │
│   │   CONTENT GENERATOR                                │   │
│   │   • Генерирует квесты и задания                   │   │
│   │   • Создает объяснения                            │   │
│   │   • Генерирует вопросы                            │   │
│   │       │                                            │   │
│   │       ▼                                            │   │
│   │   GAME LAYER                                      │   │
│   │   • Обворачивает в игровую механику                │   │
│   │   • Добавляет геймификацию                        │   │
│   │   • Создает progression                           │   │
│   │       │                                            │   │
│   │       ▼                                            │   │
│   │   HUMAN REVIEW (minimal)                          │   │
│   │   • Педагог проверяет                            │   │
│   │   • Корректирует при необходимости                 │   │
│   │       │                                            │   │
│   │       ▼                                            │   │
│   │   РЕЛИЗ (через 1-2 недели)                       │   │
│   │                                                   │   │
│   └───────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Компоненты Content Engine

### 1. Document Parser

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   INPUT:                                                    │
│   • PDF учебника                                            │
│   • EPUB                                                   │
│   • Веб-страницы                                            │
│   • Markdown/HTML                                           │
│   • Сканы (OCR)                                            │
│                                                             │
│   OUTPUT:                                                   │
│   • Структурированный контент                               │
│   • Dependencies между темами                               │
│   • Сложность (по возрасту/классу)                         │
│   • Ключевые термины и определения                          │
│   • Примеры и упражнения                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. AI Content Generator

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   GENERATES:                                                │
│                                                             │
│   • Learning paths - оптимальная последовательность          │
│   • Quests - практические задания                           │
│   • Dialogs - объяснения от AI тьютора                     │
│   • Assessments - тесты и проверочные                       │
│   • Gamification - как превратить в игру                    │
│   • Adaptive rules - как усложнять/упрощать                │
│                                                             │
│   QUALITY:                                                  │
│   • Pedagogically sound                                     │
│   • Age-appropriate                                        │
│   • Culturally sensitive                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3. Game Template Engine

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   TEMPLATES:                                                │
│                                                             │
│   • RPG Adventure                                          │
│   • Puzzle/Strategy                                        │
│   • Simulation                                             │
│   • Visual novel                                           │
│   • Quiz show                                             │
│   • Tower defense                                          │
│   • И другие...                                            │
│                                                             │
│   CUSTOMIZATION:                                           │
│   • Difficulty                                             │
│   • Theme/style                                            │
│   • Pacing                                                │
│   • Rewards structure                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4. Human-in-the-Loop

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   РОЛЬ ЧЕЛОВЕКА (педагога/методиста):                     │
│                                                             │
│   • Review & approve generated content                      │
│   • Correct errors or inappropriate content                │
│   • Add custom content or modifications                    │
│   • Set difficulty parameters                               │
│   • Preview before release                                  │
│                                                             │
│   ВРЕМЯ НА РЕВЬЮ:                                         │
│   ~30 минут на главу (vs 2 недели ручной работы)          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Use Cases

### Для Study Skill Trainer

```
Study Skill Trainer использует Content Engine для:

• Генерации учебных материалов
• Создания квестов и заданий
• Production новых предметов/курсов
• Масштабирования контента
```

### Для Epic Learning Game

```
Epic Game использует Content Engine для:

• Быстрого production эпизодов
• Адаптации контента под игровую механику
• Персонализации уровней
• Расширения контента
```

### Standalone (B2B)

```
Other companies используют как:

• SaaS платформа для EdTech companies
• White-label решение для школ
• Tool для出版社 (издательств)
• API для интеграции
```

---

## Бизнес-модель

### B2B SaaS

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   STARTER ($99/month)                                       │
│   • 1 user                                                 │
│   • 5 documents/month                                       │
│   • Basic templates                                        │
│   • Community support                                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   PROFESSIONAL ($499/month)                                 │
│   • 5 users                                                │
│   • Unlimited documents                                     │
│   • All templates                                          │
│   • Priority support                                       │
│   • API access                                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ENTERPRISE (Custom)                                      │
│   • Unlimited users                                         │
│   • Custom templates                                        │
│   • Dedicated support                                       │
│   • On-premise option                                       │
│   • SLA                                                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   USAGE-BASED                                              │
│   • Pay per document                                       │
│   • $5-20 per document processed                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Technical Requirements

### Core Capabilities

1. **Document Understanding**
   - PDF parsing
   - OCR for scanned documents
   - Structure extraction
   - Semantic analysis

2. **LLM Integration**
   - GPT-4 / Claude API
   - Fine-tuning for education domain
   - Consistent output format

3. **Game Generation**
   - Template system
   - Asset generation (images, sounds)
   - Game logic export

4. **Review Workflow**
   - Collaboration tools
   - Version control
   - Approval workflow

---

## Roadmap

### Phase 1: MVP (3 months)
- PDF parser
- Basic quiz generation
- Manual review workflow
- 1 game template

### Phase 2: AI Enhancement (6 months)
- Full LLM integration
- Multiple templates
- Adaptive difficulty
- Auto-review suggestions

### Phase 3: Scale (12 months)
- Multiple languages
- API launch
- White-label options
- Marketplace for templates

---

## Связь с другими продуктами

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                      CONTENT ENGINE                        │
│                            │                               │
│              ┌─────────────┴─────────────┐                  │
│              │                           │                  │
│              ▼                           ▼                  │
│    ┌─────────────────┐      ┌─────────────────┐            │
│    │ STUDY SKILL     │      │ EPIC LEARNING   │            │
│    │ TRAINER         │      │ GAME            │            │
│    │                 │      │                 │            │
│    │ Uses for:       │      │ Uses for:       │            │
│    │ • Course gen    │      │ • Episode prod  │            │
│    │ • New subjects  │      │ • Rapid content │            │
│    └─────────────────┘      └─────────────────┘            │
│                                                             │
│              ┌─────────────┴─────────────┐                  │
│              │                           │                  │
│              ▼                           ▼                  │
│    ┌─────────────────┐      ┌─────────────────┐            │
│    │ B2B LEARNING    │      │ STANDALONE      │            │
│    │ SOLUTIONS       │      │ B2B SAAS        │            │
│    │                 │      │                 │            │
│    │ Custom content  │      │ API customers   │            │
│    │ for clients     │      │                 │            │
│    └─────────────────┘      └─────────────────┘            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ROI Comparison

| Approach | Time | Cost | Quality |
|----------|------|------|--------|
| Manual | 3-6 months | $100K+ | Variable |
| Content Engine | 1-2 weeks | $5K | Consistent |
| **Savings** | **90%+** | **95%+** | **Better** |

---

## Статус

**Текущий статус:** CONCEPT
**Приоритет:** MEDIUM (enabler для масштабирования)
**Dependencies:** None (can be built standalone)

---

**Обновлено:** 09.04.2026
