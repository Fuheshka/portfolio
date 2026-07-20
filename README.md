# 🌐 Frutiger Aero OS — Interactive Portfolio

> An interactive web-based operating system portfolio inspired by late 2000s **Frutiger Aero** aesthetics.

[English](README.md) | [Русский](README.ru.md)

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen.svg?style=for-the-badge)](https://Fuheshka.github.io/portfolio)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

---

## 🌟 About

**Frutiger Aero OS Portfolio** is more than just a portfolio website — it's an interactive web desktop environment. The project is inspired by late-2000s UI design (Windows Vista / 7 Aero Glass, glossy textures, skeumorphism) combined with modern web frameworks and fluid animations.

---

## ✨ Features

- 🖥️ **Web OS Desktop**:
  - Animated boot screen & login prompt.
  - Taskbar with running app badges and system clock.
  - Top MenuBar with power management (Shutdown / Restart).
- 🪟 **Window Management**:
  - Drag & drop positioning with desktop bounds checking.
  - Resizing, maximizing, and minimizing to taskbar.
  - Cascading initial position and dynamic `z-index` layering.
- 🎨 **Personalization & Effects**:
  - Wallpaper switching persisted via `localStorage`.
  - Customizable Aero glass blur intensity.
  - Sound effects toggle.
- 🔊 **Sound Engine (Web Audio API)**:
  - Synthesized procedural sound effects for boot, click, window open, and minimize.
- 📱 **Built-in Applications**:
  - **📁 Projects** — Interactive showcase with tag filters, screenshots, and live/repo links.
  - **👤 About Me** — Personal background, skills, and experience.
  - **✉️ Contact** — Contact details and message form.
  - **🎛️ Personalization** — Control panel for wallpapers, glass blur, and audio.

---

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) |
| **Build Tool** | [Vite 7](https://vite.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Animations** | [Framer Motion 12](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Deployment** | GitHub Pages |

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher)
- `npm` (or `pnpm` / `yarn`)

### Installation & Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Fuheshka/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📜 Scripts

- `npm run dev` — Launch Vite dev server with HMR.
- `npm run build` — Build production bundle in `dist/`.
- `npm run preview` — Locally preview production build.
- `npm run lint` — Lint code with ESLint.

---

## 📁 Project Structure

```text
portfolio/
├── public/              # Static assets (sounds, wallpapers)
├── src/
│   ├── assets/          # Images and UI assets
│   ├── components/      # Web OS components & application windows
│   │   ├── Window.jsx           # Universal window wrapper
│   │   ├── Taskbar.jsx          # Taskbar & Start Menu
│   │   ├── MenuBar.jsx          # Top system bar
│   │   ├── Personalization.jsx # Customization control panel
│   │   ├── ProjectList.jsx     # Projects app
│   │   ├── About.jsx           # About Me app
│   │   └── Contact.jsx         # Contact app
│   ├── data/            # Projects & profile data
│   ├── utils/           # Web Audio API & helpers
│   ├── App.jsx          # Root OS state manager
│   └── main.jsx         # React entry point
├── index.html           # HTML template
├── package.json
└── vite.config.js
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
