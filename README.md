# Simple Lexical Describe

Учебный проект на **Next.js 14 (App Router)** с интеграцией **Lexical editor**.
Поддерживает базовое форматирование текста, списки, ссылки, а также прикрепление **изображений и файлов** с кнопкой удаления.

<img src="https://s3.akarmain.ru/S/YzWdc.mp4" alt="Demo" width="600">
---

## 🚀 Возможности

- **Редактор текста** с тулбаром:
  - **жирный / курсив**
  - **ссылки**
  - **нумерованные / ненумерованные списки**
- **Вставка изображений по ссылке**
  - отображаются в тексте, можно удалить крестиком
- **Вставка файлов по ссылке**
  - карточка с названием, иконкой и кнопкой удаления
- **Предпросмотр HTML** (`$generateHtmlFromNodes`)
- **Рендеринг HTML** через `dangerouslySetInnerHTML`
- Минимальная HTML-разметка при экспорте (без лишних `<span>`)

---

## 📂 Структура проекта
```
src/
├── app
│   ├── layout.tsx
│   └── page.tsx
├── components
│   └── editor
│       └── Toolbar.tsx
├── nodes
│   ├── FileCardNode.tsx
│   └── ImageNode.tsx
├── styles
│   └── ui.ts
└── utils
    └── sanitizeUrl.ts
```
---

## ⚙️ Установка

1. Клонируй репозиторий:

```bash
git clone https://github.com/akarmain/simple-lexical-describe.git
cd simple-lexical-describe
```
2.	Установи зависимости:

```bash
npm install
```

⸻

▶️ Запуск

`npm run dev`

Открой http://localhost:3000 в браузере.

⸻

🛠 Технологии
	•	Next.js 14 (App Router)
	•	React 18
	•	Lexical (lexical, @lexical/react, @lexical/html, @lexical/link, @lexical/list)
	•	Кастомные Nodes для работы с изображениями и файлами

⸻

🔑 Лицензия

MIT © 2025

___
_Спасибо, что читаете мой код!_
