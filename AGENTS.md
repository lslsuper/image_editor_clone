# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router pages, layouts, and server actions.
- `components/`: Reusable UI components (prefer PascalCase per component).
- `hooks/`: Reusable React hooks (prefix with `use` and colocate types).
- `lib/`: Utilities, schemas, and shared logic.
- `styles/`: Global styles and Tailwind layers.
- `public/`: Static assets (images, icons, fonts).
- Config: `next.config.mjs`, `tsconfig.json`, `postcss.config.mjs`, `components.json`.

## Build, Test, and Development Commands
- `npm run dev`: Run the app locally with hot reload.
- `npm run build`: Production build (`.next/`).
- `npm run start`: Start the production server locally.
- `npm run lint`: Lint the codebase with ESLint (Next.js defaults).
- `npm test`: Run unit tests with Vitest.
Tip: Use `npm` in this repo. If you prefer pnpm, ensure lockfile consistency.

## Coding Style & Naming Conventions
- Language: TypeScript, React (function components), Next.js App Router.
- Indentation: 2 spaces; keep lines focused and readable.
- Naming: Components `PascalCase`, files in `components/` match export; hooks `useX`; utilities `camelCase`.
- Styling: Tailwind CSS (v4). Prefer utility classes and `class-variance-authority` patterns where relevant.
- Linting: Use `pnpm lint` and fix warnings before PRs. Follow idiomatic Next.js patterns (server vs client components).

## Testing Guidelines
- Frameworks: Vitest + React Testing Library; JSDOM environment.
- File naming: `*.test.ts` or `*.test.tsx`; colocate near source or in `__tests__/`.
- Setup: See `vitest.config.ts` and `setupTests.ts` (extends `jest-dom`).
- Coverage: `npm run coverage` to collect coverage.

## Commit & Pull Request Guidelines
- Commits: Prefer Conventional Commits e.g. `feat: add crop tool`, `fix: correct canvas scaling`, `chore: bump deps`.
- Branches: `feature/<short-name>` or `fix/<short-name>`.
- PRs: Provide a clear description, screenshots for UI changes, steps to reproduce/test, and link any issues. Ensure `pnpm lint` and a local build pass.

## Security & Configuration Tips
- Secrets/keys: Use `.env.local` (not committed). Access via `process.env.*` and document required vars in the PR.
- Assets: Put static images in `public/`; import via `/path`.
- Performance: Prefer server components for data-heavy paths; memoize expensive client renders; avoid large images in the bundle.
