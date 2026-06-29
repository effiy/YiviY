# rui-ui · Svelte Stack

> Svelte / SvelteKit design guidance. Last reviewed: YYYY-MM-DD.

## Reactivity (built-in, no hooks)

```svelte
<script>
    let count = 0;
    $: doubled = count * 2;
    $: console.log(`count changed to ${count}`);
</script>

<button on:click={() => count++}>
    {count} × 2 = {doubled}
</button>
```

## Stores (shared state)

```javascript
// stores/counter.js
import { writable, derived } from 'svelte/store';

export const count = writable(0);
export const doubled = derived(count, ($c) => $c * 2);
```

```svelte
<script>
    import { count, doubled } from './stores/counter.js';
</script>

<button on:click={() => count.update((n) => n + 1)}>
    {$count} × 2 = {$doubled}
</button>
```

## Component Patterns

### Slots (default + named)

```svelte
<!-- Card.svelte -->
<div class="card">
    <header><slot name="header" /></header>
    <main><slot /></main>
    <footer><slot name="footer" /></footer>
</div>
```

### Events (createEventDispatcher)

```svelte
<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
</script>

<button on:click={() => dispatch('submit', { id: 1 })}>Submit</button>
```

## Performance

- Svelte compiles away the framework → smaller bundles than React/Vue
- Use `{#key}` block for forced re-render
- `svelte:component this={DynamicComponent}` for dynamic components
- `tick()` for post-DOM-update code

## SvelteKit Specifics

- File-based routing: `src/routes/+page.svelte`
- Server load: `+page.server.js` exports `load`
- Client load: `+page.js` exports `load`
- Forms: progressive enhancement via `use:enhance`
- `$app/navigation` for SPA-style routing

## Accessibility

- Same general rules as React/Vue
- `use:focusTrap` for modals
- `aria-*` attributes supported directly

## Common Pitfalls

| Pitfall | Fix |
|---------|-----|
| `let` instead of `const` for non-reactive | Use `const` |
| Missing `$` prefix on store values | `$store` auto-subscribes |
| Mutating store without method | Use `store.set()` or `store.update()` |
| Forgetting `bind:this` | Use `bind:this={element}` |

## Recommended Libraries

- **UI**: shadcn-svelte / Skeleton UI
- **Forms**: Felte / Superforms (SvelteKit)
- **Charts**: LayerCake / Chart.js (svelte wrapper)
- **i18n**: svelte-i18n
- **Animations**: svelte/transition / svelte/motion