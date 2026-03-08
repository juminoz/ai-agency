# AI Agency

Monorepo powered by [Turborepo](https://turbo.build/repo), [Next.js 15](https://nextjs.org/), and [React 19](https://react.dev/).

## Structure

```
ai-agency/
├── apps/
│   └── web/                 # Next.js 15 (App Router + Turbopack)
├── packages/
│   ├── ui/                  # Shared component library (shadcn/ui + Tailwind)
│   ├── typescript-config/   # Shared TypeScript configs
│   └── eslint-config/       # Shared ESLint configs
```

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9

### Install

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Lint & Format

```bash
pnpm lint
pnpm format
```

## Adding a Shared UI Component

1. Create component in `packages/ui/src/components/`
2. Import in apps: `import { Component } from "@repo/ui/components/component-name"`
