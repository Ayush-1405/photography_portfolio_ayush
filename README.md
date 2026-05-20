# Studio Noir — Photography portfolio

A single-page photography portfolio: dark theme, scroll reveals, hero parallax, horizontal gallery (drag + scroll), and a contact block. Built with **Vite**, **React 18**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

## Customize

- **Copy & branding:** edit `src/App.tsx` (footer, studio name) and `index.html` (`<title>`).
- **Images & projects:** edit `src/data.ts` — replace Unsplash URLs with your own assets (place files in `public/` and reference as `/your-photo.jpg`).
- **Accent color:** `tailwind.config.js` → `theme.extend.colors.accent`.

## Commands

```bash
cd photography-portfolio
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

```bash
npm run build   # production build to dist/
npm run preview # serve dist locally
```

## Accessibility

Animations respect `prefers-reduced-motion` via Framer Motion’s `useReducedMotion` and reduced hero motion.
