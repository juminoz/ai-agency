---
description: Add a new shared UI component to the packages/ui library
---

1. Create the component file at `packages/ui/src/components/<component-name>.tsx`
2. Use the shadcn/ui pattern with `cva` for variants and `cn()` for class merging
3. Export the component with proper TypeScript types
4. Update `packages/ui/package.json` exports if needed
5. Import in apps using `import { Component } from "@repo/ui/components/<component-name>"`
