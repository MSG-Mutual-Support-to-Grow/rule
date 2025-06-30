# React + Tailwind CSS + ShadCN UI + Vite + TypeScript Template

This branch features a fully configured **React** setup using **ShadCN UI**, **Tailwind CSS**, **Vite**, and **TypeScript** — ideal for scalable, modern UI development using utility-first styling and accessible components.

---

## 📁 Folder Structure


```
.  
├── public/  
├── src/  
├── .gitignore  
├── README.md  
├── components.json  
├── eslint.config.js  
├── index.html  
├── package-lock.json  
├── package.json  
├── postcss.config.cjs  
├── tailwind.config.js  
├── tsconfig.json  
├── tsconfig.app.json  
├── tsconfig.node.json  
└── vite.config.ts

```

---

## 🧰 Tech Stack

- ⚛️ React
- ⚡ Vite
- 🟦 TypeScript
- 🎨 Tailwind CSS
- 🧩 ShadCN UI (`@shadcn/ui`)
- 🌐 Radix UI (used under the hood by ShadCN)


---

## 🚀 Getting Started

### 1. Clone the Repository & Checkout the ShadCN Branch

```bash
git clone https://github.com/dharshan-kumarj/React_CSS_Frameworks_Starter/tree/Shadcn
cd React_CSS_Frameworks_Starter
git checkout Shadcn

```

### 2. Install Dependencies

```bash
npm install

```

### 3. Start the Development Server

```bash
npm run dev

```

----------

## 🎨 ShadCN UI Setup

ShadCN components are auto-generated and configured using the `components.json` file.

### ShadCN Component Generator

To add a new component (e.g., Button):

```bash
npx shadcn-ui@latest add button

```

You can also configure default settings in `components.json`.

###  Example Usage

In `src/App.tsx`:

```tsx
import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="p-4">
      <Button variant="default">Click Me</Button>
    </div>
  );
}

```

----------

## 🧩 Tailwind CSS Configuration

### `tailwind.config.js`

```js
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

```

### `postcss.config.cjs`

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

```

----------

## 🏗️ Build for Production

```bash
npm run build

```

Preview the built app:

```bash
npm run preview

```

----------

## 💡 Tips

-   Customize ShadCN themes in `tailwind.config.js` and `components.json`
    
-   All components are stored in `src/components/ui`
    
-   You can extend with your own components using ShadCN CLI
    

----------
