
# Package Scripts

Add these scripts to your package.json:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest --coverage",
    "type-check": "tsc --noEmit"
  }
}
```

## Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint and fix issues automatically
- `npm run preview` - Preview production build
- `npm test` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage report
- `npm run type-check` - Check TypeScript types without building

## Testing

To run all checks before committing:
```bash
npm run type-check && npm run lint && npm run test:run
```
