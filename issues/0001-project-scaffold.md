# 0001 — Project scaffold (Next.js 15 + TS + Tailwind v4 + fonts)

**Status:** needs-triage
**Type:** infra
**Depends on:** —
**Blocks:** every other issue

## Problem

The repository is empty. Every other piece of work in this PRD presupposes a working Next.js + TypeScript + Tailwind v4 application that can be run locally and deployed to Vercel.

## Acceptance criteria

- [ ] Next.js 15 App Router project initialised at the repository root.
- [ ] TypeScript configured (`tsconfig.json` with `strict: true`).
- [ ] Tailwind v4 installed and wired via the `@tailwindcss/postcss` pipeline appropriate for Next.js 15.
- [ ] A global stylesheet contains a `@theme` block declaring every prototype token: navy, navy2, teal, teal-lt, gold, white, offwhite, text, muted, border, radius (14px), shadow, shadow-lg.
- [ ] `next/font` loads Plus Jakarta Sans (weights 400, 500, 600, 700, 800) and Lora (weights 500, 600, 700). Body uses Plus Jakarta Sans by default; a `font-display` utility uses Lora.
- [ ] Vitest installed and configured for unit testing.
- [ ] `pnpm dev` (or `npm run dev`) serves a placeholder home page successfully.
- [ ] `.env.example` checked in with every env var listed in `docs/research.md` §10.
- [ ] `.gitignore` excludes `.env`, `.env.local`, `node_modules`, `.next`, `out`.

## Implementation notes

- Confirm Tailwind v4 vs v3 at install time. v4 with `@theme` is preferred per the PRD.
- Token names should match the prototype's CSS custom properties so a global rename later isn't needed.
- Body `font-size: 17px` and `line-height: 1.6` per the prototype.

## References

- PRD §"Stack & framework"
- Research §2 (Stack decisions), §6.2 (Visual design system)
