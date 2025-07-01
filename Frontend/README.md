# Rule Frontend

A modern, user-friendly web application for uploading resumes and viewing parsed results from the Resume Parser backend.

---

## 🚀 Features

- **PDF Resume Upload:** Upload one or more PDF resumes for parsing.
- **Instant Results:** View structured candidate data (name, contact, skills, experience, etc.) right after upload.
- **Beautiful UI:** Built with React, Tailwind CSS, and ShadCN UI for a clean, responsive experience.
- **Reusable Components:** Modular design for easy extension and maintenance.

---

## 🧰 Tech Stack

- React (with TypeScript)
- Vite (fast dev/build tool)
- Tailwind CSS (utility-first styling)
- ShadCN UI (accessible, customizable UI components)
- Framer Motion (animations)
- Lucide Icons (icon set)

---

## 📁 Folder Structure

```
frontend/
├── public/                # Static assets (images, icons)
├── src/
│   ├── assets/            # SVGs and images
│   ├── blocks/            # Animated/utility blocks (e.g., BlurText)
│   ├── components/
│   │   ├── layout/        # Layout components (UploadCard, OutputViewer)
│   │   └── ui/            # UI primitives (Button, Card, Table)
│   ├── const/             # Static/mock data
│   ├── lib/               # API and utility functions
│   ├── pages/             # Page-level components (LandingPage)
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Tailwind base styles
├── index.html             # App HTML template
├── tailwind.config.js     # Tailwind config
├── postcss.config.cjs     # PostCSS config
├── vite.config.ts         # Vite config
├── tsconfig*.json         # TypeScript configs
└── README.md              # This file
```

---

## ⚡ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/dharshan-kumarj/rule/tree/frontend/phase_oneAPi_integration
cd rule/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

- The app will be available at http://localhost:5173 (or as shown in your terminal).

### 4. Build for Production

```bash
npm run build
```

- Output will be in the `dist/` folder.

### 5. Preview the Production Build

```bash
npm run preview
```

---

## 🖇️ Connecting to the Backend

- The frontend expects the Resume Parser backend (FastAPI) to be running and accessible (default: http://localhost:8000).
- You can configure the backend URL in `src/lib/api.ts` if needed.

---

## 🧩 Customization

- **UI Components:** All UI elements are in `src/components/ui/` and can be easily customized or extended.
- **Theme:** Tailwind and ShadCN UI make it easy to adjust colors, fonts, and layout.
- **API Integration:** The upload logic is in `src/lib/api.ts` and can be adapted for different endpoints.

---

## 📝 Example Usage

1. Click the upload card to select a PDF resume.
2. The file is sent to the backend and parsed.
3. The parsed candidate data is displayed in a structured, readable format.

---

## 🛠️ Additional Setup Details

### Tailwind CSS
- Configured in `tailwind.config.js` and `postcss.config.cjs`.
- Styles are imported in `src/index.css`.

### ShadCN UI
- Components are generated and managed via `components.json`.
- To add a new UI component, run:
  ```bash
  npx shadcn-ui@latest add <component>
  ```

### TypeScript
- TypeScript configuration is in `tsconfig.json`, `tsconfig.app.json`, and `tsconfig.node.json`.

### Linting
- ESLint is configured via `eslint.config.js` for code quality and consistency.

---

## 🤝 Contributing

1. Fork this repo and create a new branch.
2. Make your changes and commit.
3. Open a Pull Request with a clear description.

---

## 📄 License

This project is licensed under the MIT License.

---

**Questions?**  
Open an issue or contact the maintainer.
