# 🌐 Frutiger Aero OS — Интерактивное Портфолио

> Интерактивное портфолио технического художника и разработчика, выполненное в эстетике веб-операционной системы **Frutiger Aero OS**.

[English](README.md) | [Русский](README.ru.md)

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen.svg?style=for-the-badge)](https://Fuheshka.github.io/portfolio)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

---

## 🌟 О проекте

**Frutiger Aero OS Portfolio** — это не просто статичный сайт, а полноценный интерактивный веб-рабочий стол. Проект вдохновлен дизайном конца 2000-х (Windows Vista / 7 Aero Glass, глянцевые текстуры, объемные элементы) и сочетает его с современными веб-технологиями и плавными анимациями.

---

## ✨ Основные возможности

- 🖥️ **Рабочий стол веб-ОС**:
  - Анимированный экран загрузки (Boot Screen) и аутентификация.
  - Панель задач (Taskbar) с индикаторами запущенных приложений и часами.
  - Верхняя панель меню (MenuBar) и система управления питанием (Shutdown / Restart).
- 🪟 **Полноценная система окон**:
  - Перетаскивание (Drag & Drop) с интеллектуальной привязкой к границам.
  - Изменение размеров (Resize), разворачивание на весь экран (Maximize) и свертывание в панель задач (Minimize).
  - Каскадное расположение при открытии и управление слоями (`z-index` фокусировка).
- 🎨 **Персонализация & Эффекты**:
  - Смена фоновых обоев рабочего стола с сохранением в `localStorage`.
  - Настройка интенсивности размытия стекла (Aero Glassmorphism).
  - Переключение звукового сопровождения.
- 🔊 **Звуковой движок (Web Audio API)**:
  - Процедурные звуковые эффекты приветствия при загрузке, кликах, открытии и свертывании окон.
- 📱 **Встроенные веб-приложения**:
  - **📁 Projects** — интерактивная витрина проектов с фильтрацией по тегам, скриншотами и ссылками на код/демо.
  - **👤 About Me** — информация о разработчике, ключевые навыки и опыт.
  - **✉️ Contact** — контактные данные и форма обратной связи.
  - **🎛️ Personalization** — Центр управления обоями, звуком и визуальными эффектами.

---

## 🛠 Технологический стек

| Категория | Технологии |
| :--- | :--- |
| **Фреймворк** | [React 19](https://react.dev/) |
| **Сборка & HMR** | [Vite 7](https://vite.dev/) |
| **Стилизация** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Анимации** | [Framer Motion 12](https://www.framer.com/motion/) |
| **Иконки** | [Lucide React](https://lucide.dev/) |
| **Деплой** | GitHub Pages |

---

## 🚀 Быстрый старт

### Требования
- [Node.js](https://nodejs.org/) (версия 18.0 или выше)
- `npm` или `pnpm` / `yarn`

### Установка и запуск

1. **Клонируйте репозиторий**:
   ```bash
   git clone https://github.com/Fuheshka/portfolio.git
   cd portfolio
   ```

2. **Установите зависимости**:
   ```bash
   npm install
   ```

3. **Запустите сервер разработки**:
   ```bash
   npm run dev
   ```
   Откройте [http://localhost:5173](http://localhost:5173) в браузере.

---

## 📜 Скрипты

- `npm run dev` — Запуск локального сервера разработки Vite с HMR.
- `npm run build` — Сборка оптимизированного бандла для продакшена в папку `dist`.
- `npm run preview` — Предпросмотр локальной продакшен-сборки.
- `npm run lint` — Проверка кода с помощью ESLint.

---

## 📁 Структура проекта

```text
portfolio/
├── public/              # Статические ассеты (звуки, изображения обоев)
├── src/
│   ├── assets/          # Изображения и ресурсы
│   ├── components/      # Компоненты веб-ОС и окон приложений
│   │   ├── Window.jsx           # Компонент универсального окна
│   │   ├── Taskbar.jsx          # Панель задач и меню Пуск
│   │   ├── MenuBar.jsx          # Верхнее системное меню
│   │   ├── Personalization.jsx # Окно персонализации
│   │   ├── ProjectList.jsx     # Приложение проектов
│   │   ├── About.jsx           # Приложение "Обо мне"
│   │   └── Contact.jsx         # Приложение "Контакты"
│   ├── data/            # Данные проектов и информации
│   ├── utils/           # Утилиты (в т.ч. Web Audio API)
│   ├── App.jsx          # Главный компонент состояния ОС
│   └── main.jsx         # Точка входа React
├── index.html           # Шаблон HTML
├── package.json
└── vite.config.js
```

---

## 📄 Лицензия

Этот проект распространяется под лицензией [MIT](LICENSE).
