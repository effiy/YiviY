# rui-ui · React Stack

> React-specific design guidance. Last reviewed: YYYY-MM-DD.

## Performance

- **Avoid**: `useEffect` for derived state → use `useMemo` / direct render
- **Prefer**: `React.memo` for pure components receiving object/array props
- **Avoid**: Inline object/array literals in props (causes re-renders)
- **Use**: `useCallback` for handlers passed to memoized children
- **Use**: `useMemo` for expensive computations
- **Avoid**: Context for high-frequency updates → split context or use external store
- **Use**: `Suspense` + lazy() for route-level code splitting
- **Use**: `<link rel="preload">` for above-the-fold images
- **Avoid**: Importing entire libraries (`import _ from 'lodash'`) → tree-shake
- **Measure**: Use React DevTools Profiler before optimizing

## State Management

| Pattern | Use For | Avoid For |
|---------|---------|-----------|
| `useState` | Local UI state | Shared state across components |
| `useReducer` | Complex local state machines | Simple toggles |
| Context | Low-frequency shared values | High-frequency updates |
| Zustand / Jotai | Medium-complexity app state | Single-component state |
| Redux Toolkit | Large app, complex async, time-travel | Simple CRUD |
| TanStack Query | Server state | Pure UI state |

## Component Patterns

### Compound Components

```jsx
<Menu>
    <Menu.Trigger />
    <Menu.List>
        <Menu.Item>Edit</Menu.Item>
        <Menu.Item>Delete</Menu.Item>
    </Menu.List>
</Menu>
```

### Render Props / Children-as-function

```jsx
<DataFetcher url="/api/users">
    {({ data, loading, error }) => (
        loading ? <Spinner /> : <UserList users={data} />
    )}
</DataFetcher>
```

### Custom Hooks

- One hook = one concern
- Prefix with `use`
- Return named values, not arrays (for >2 values)

## Accessibility

- All interactive elements keyboard-accessible
- Use semantic HTML (`<button>`, `<nav>`, `<main>`)
- `aria-label` for icon-only buttons
- Focus management for modals / drawers
- `prefers-reduced-motion` for animations
- Test with screen readers (VoiceOver / NVDA)

## Common Pitfalls

| Pitfall | Fix |
|---------|-----|
| `useEffect(() => { setX(fetchX()) }, [])` | Use TanStack Query |
| Passing new objects in `value={}` | Memoize with `useMemo` |
| Index as `key` prop | Use stable IDs |
| `dangerouslySetInnerHTML` | Sanitize with DOMPurify |
| Direct DOM manipulation | Use refs sparingly, prefer React |

## Recommended Libraries

- **Forms**: react-hook-form + zod
- **Tables**: TanStack Table
- **Charts**: Recharts / Visx
- **Routing**: TanStack Router / Next.js App Router
- **Animation**: Framer Motion
- **Icons**: Lucide React / Heroicons
- **Dates**: date-fns
- **i18n**: react-i18next / next-intl