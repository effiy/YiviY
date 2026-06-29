# rui-ui · Vue 3 Stack

> Vue 3 (Composition API) design guidance. Last reviewed: YYYY-MM-DD.

## Composition API Patterns

### `<script setup>` (preferred)

```vue
<script setup>
import { ref, computed } from 'vue';

const count = ref(0);
const doubled = computed(() => count.value * 2);
</script>

<template>
    <button @click="count++">{{ count }} × 2 = {{ doubled }}</button>
</template>
```

### Composables (instead of mixins)

```javascript
// composables/useMouse.js
import { ref, onMounted, onUnmounted } from 'vue';

export function useMouse() {
    const x = ref(0);
    const y = ref(0);
    const update = (e) => { x.value = e.clientX; y.value = e.clientY; };
    onMounted(() => window.addEventListener('mousemove', update));
    onUnmounted(() => window.removeEventListener('mousemove', update));
    return { x, y };
}
```

## Reactivity Rules

| API | Use For | Avoid For |
|-----|---------|-----------|
| `ref` | Primitives + objects | Don't destructure (`const { x } = ref({x:1})` loses reactivity) |
| `reactive` | Objects (deep reactive) | Don't replace the whole object |
| `computed` | Derived values | Side effects (use `watch`) |
| `watch` | Side effects on changes | Simple derivations (use `computed`) |
| `watchEffect` | Auto-tracking side effects | When you need explicit deps |

## Performance

- `v-once` for static content
- `v-memo` for re-render optimization (Vue 3.2+)
- `shallowRef` for large immutable data
- `markRaw` for objects that should never be reactive (e.g., class instances)
- `<KeepAlive>` for tab/modal content preservation

## Component Patterns

### Props with Defaults + Validation

```javascript
const props = defineProps({
    size: { type: String, default: 'medium', validator: (v) => ['small','medium','large'].includes(v) },
    count: { type: Number, default: 0 }
});
```

### DefineModel (Vue 3.4+)

```vue
<script setup>
const model = defineModel();  // replaces :modelValue + @update:modelValue
</script>

<input v-model="model" />
```

## Accessibility

- Same rules as React stack (see stack-react.md)
- Use `<Transition>` and `<TransitionGroup>` for animated state changes
- Honor `prefers-reduced-motion`

## Common Pitfalls

| Pitfall | Fix |
|---------|-----|
| Destructuring reactive objects | Use `toRefs()` |
| Mutating prop directly | Emit events, parent owns state |
| Missing `key` in `v-for` | Use stable IDs |
| Side effects in `computed` | Use `watch` |
| Forgetting `.value` on refs | In template, auto-unwrapped; in script, manual |

## Recommended Libraries

- **Router**: Vue Router 4
- **State**: Pinia (official)
- **Forms**: VeeValidate + Yup / Zod
- **UI**: Headless UI / Radix Vue / shadcn-vue
- **Charts**: Vue-ChartJS / Apache ECharts
- **i18n**: vue-i18n