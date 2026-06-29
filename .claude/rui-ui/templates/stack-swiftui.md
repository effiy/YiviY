# rui-ui · SwiftUI Stack

> SwiftUI design guidance for Apple platforms (iOS, iPadOS, macOS, watchOS, tvOS). Last reviewed: YYYY-MM-DD.

## Core Principles

- **Declarative**: describe what the UI should look like, not how to build it
- **State-driven**: views re-render when `@State` / `@Observable` changes
- **Native first**: prefer system controls; customize only when brand requires
- **Dynamic Type**: support system text scaling
- **Reduced Motion**: honor user's motion preferences

## State Management

| Wrapper | Use For |
|---------|---------|
| `@State` | View-local mutable state |
| `@Binding` | Two-way binding to parent's state |
| `@Observable` (iOS 17+) | Observable model class (replaces ObservableObject) |
| `@Environment` | Shared values from environment |
| `@Bindable` | Bind to properties of `@Observable` instance |
| `@StateObject` | Own an `ObservableObject` (legacy, pre-iOS 17) |
| `@ObservedObject` | Reference to external `ObservableObject` (legacy) |

## Component Patterns

### ViewModifier

```swift
struct CardStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding()
            .background(.thinMaterial)
            .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}

extension View {
    func cardStyle() -> some View { modifier(CardStyle()) }
}
```

### ViewBuilder

```swift
@ViewBuilder
func toolbarItems() -> some View {
    if isEditing {
        Button("Done") { isEditing = false }
    } else {
        Button("Edit")   { isEditing = true  }
    }
}
```

## Navigation

| Pattern | Use For |
|---------|---------|
| `NavigationStack` | Hierarchical navigation (iOS 16+) |
| `NavigationSplitView` | Multi-column on iPad/Mac |
| `TabView` | Top-level tab navigation (≤5 tabs) |
| `Sheet` | Modal flows with completion |
| `.fullScreenCover` | Mandatory flows |
| `.popover` | Lightweight contextual UI |

## Lists & Collections

- `List` for native list behavior
- `LazyVStack` / `LazyVGrid` for large scrolling content
- `ScrollViewReader` for scroll-to behavior
- `.searchable()` for built-in search
- `.swipeActions()` for list row actions

## Animation

```swift
withAnimation(.easeInOut(duration: 0.2)) {
    isExpanded.toggle()
}
```

- Use `.transition()` for insertion/removal
- `matchedGeometryEffect` for hero transitions
- Respect `@Environment(\.accessibilityReduceMotion)`

## Accessibility (HIG)

- `accessibilityLabel("Delete")` for icon-only buttons
- `.accessibilityElement(children: .combine)` for compound labels
- Dynamic Type: use system fonts (`.body`, `.title`)
- VoiceOver: logical reading order
- Test with VoiceOver, Switch Control

## System Integration

- `UIApplication.shared.open(url)` for external links
- `PhotosPicker` for image selection
- `MapKit` for maps
- `Charts` framework (iOS 16+) for native charts
- `ShareLink` for sharing
- `SignInWithAppleButton`

## Common Pitfalls

| Pitfall | Fix |
|---------|-----|
| Heavy computation in view body | Move to `@State` / model |
| Forced unwrap (`!`) on user input | Use `if let` / `guard let` |
| NavigationLink in ForEach without id | Use `.id()` modifier |
| Image set without `.resizable()` | Always `.resizable()` first |
| Ignoring safe area | Use `.safeAreaPadding()` |

## Recommended Patterns

- **MVVM**: `@Observable` view models
- **TCA-like**: Composable Architecture (third-party)
- **Persistence**: SwiftData (iOS 17+) / Core Data
- **Networking**: async/await + URLSession