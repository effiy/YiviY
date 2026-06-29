# Edge Type Reference — rui-graph

> Complete edge type catalog with semantic meaning, visual styling, weight conventions, and creation rules.

## Edge Type Catalog

### Structural Edges (deterministic — always created)

| Edge Type | Source → Target | Line Style | Width | Weight | Category |
|-----------|----------------|------------|-------|--------|----------|
| `has_tag` | Card → Tag | Solid, `#475569` | 1 | 0.8 | Deterministic |
| `has_badge` | Card → Badge | Solid, badge color | 2 | 0.9 | Deterministic |
| `links_to` | Card → Link Dest | Dotted, `#475569` | 1 | 0.6 | Deterministic |

### Shared Edges (deterministic — computed from overlap)

| Edge Type | Source → Target | Line Style | Width | Weight | Category |
|-----------|----------------|------------|-------|--------|----------|
| `shares_tag` | Card ↔ Card | Dashed, `#94a3b8` | 0.5 | 0.4 | Deterministic |
| `shares_badge` | Card ↔ Card | Dashed, badge color | 1 | 0.5 | Deterministic |
| `shares_link` | Card ↔ Card | Dotted, `#334155` | 0.5 | 0.3 | Deterministic |

### Semantic Edges (LLM-inferred from card analysis)

| Edge Type | Source → Target | Line Style | Width | Weight | Category |
|-----------|----------------|------------|-------|--------|----------|
| `depends_on` | Card → Card | Solid, `#22d3ee` | 1.5 | 0.7 | LLM-inferred |
| `related_to` | Card → Card | Dashed, `#64748b` | 0.8 | 0.4 | LLM-inferred |
| `extends` | Card → Card | Solid, `#a78bfa` | 1.5 | 0.8 | LLM-inferred |
| `implements` | Card → Card | Dotted, `#34d399` | 1.2 | 0.7 | LLM-inferred |

### Mode-Specific Edges

| Edge Type | Source → Target | Line Style | Width | Weight | Mode |
|-----------|----------------|------------|-------|--------|------|
| `translates_to` | Card (lang A) → Card (lang B) | Dashed, language color | 1 | 0.6 | Mode D |
| `belongs_to` | Card → Card Group | Solid, group color | 1 | 0.9 | Mode D |

## Edge Creation Rules

### has_tag

**When**: A card's `tags[]` array contains a tag.
**Direction**: Card → Tag.
**ID format**: `edge:<cardId>:tag:<tagText>`.
**Prevention**: Check for duplicate (card, tag) pairs. Emit exactly one edge per (card, tag).

```javascript
for (const card of cards) {
  for (const tag of card.tags) {
    const tagId = `tag:${tag.text}`;
    edges.push({
      data: {
        id: `edge:${card.id}:${tagId}`,
        source: card.id,
        target: tagId,
        type: 'has_tag'
      }
    });
  }
}
```

### shares_tag

**When**: Two cards share ≥1 tag (same tag text).
**Direction**: Bidirectional (visual is undirected, Cytoscape stores as directed but rendered without arrow).
**ID format**: `edge:<cardAId>:<cardBId>:shares_tag:<tagText>`.
**Prevention**: Sort card IDs so (A, B) = (B, A). Emit exactly ONE edge per shared tag per card pair. Do NOT double emit.

```javascript
for (const [text, cooc] of Object.entries(tagCooccurrence)) {
  const cards = cooc.cards;
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      const [a, b] = [cards[i], cards[j]].sort();
      edges.push({
        data: {
          id: `edge:${a}:${b}:shares_tag:${text}`,
          source: a,
          target: b,
          type: 'shares_tag',
          shared: text
        }
      });
    }
  }
}
```

### shares_badge

**When**: Two cards have the same badge value.
**Direction**: Bidirectional.
**ID format**: `edge:<cardAId>:<cardBId>:shares_badge:<badge>`.

### shares_link

**When**: Two cards link to the same URL (exact href match).
**Direction**: Bidirectional.
**ID format**: `edge:<cardAId>:<cardBId>:shares_link:<urlSlug>`.

### depends_on

**When**: LLM analysis determines Card A's subject depends on Card B's subject.
**Signals**: A's description mentions B; A is a consumer of B's output; A wraps/integrates B.
**Weight**: 0.7 (stronger than `related_to`, weaker than `extends`).
**Evidence required**: Always include a `reason` field.

```json
{
  "data": {
    "id": "edge:card:3:card:0:depends_on",
    "source": "card:3",
    "target": "card:0",
    "type": "depends_on",
    "reason": "WhisperX consumes yt-dlp output as its audio source",
    "weight": 0.7
  }
}
```

### related_to

**When**: Two cards are topically related but no clear dependency.
**Signals**: Same domain, complementary tools, often co-mentioned.
**Weight**: 0.4 (weakest LLM-inferred edge).

### extends

**When**: Card A's subject extends/builds on Card B's subject.
**Signals**: "fork of", "wrapper around", "based on", "plugin for".
**Weight**: 0.8 (strongest LLM-inferred edge — indicates inheritance chain).

### implements

**When**: Card A's subject implements a specification or protocol described by Card B.
**Signals**: "implements <protocol>", "client library for <API>".
**Weight**: 0.7.

## Edge ID Collision Prevention

Edge IDs must be unique across ALL edge types. The format `edge:<source>:<target>:<type>[:<discriminator>]` ensures this. The build script enforces uniqueness with a `Set` check.

**Problem case**: `shares_tag` for cards that share MULTIPLE tags.
**Solution**: Include the tag text as a discriminator: `edge:card0:card1:shares_tag:Python`.

## Visual Distinction Rules

All edge types must be VISUALLY distinguishable in the graph:

- **Structural** (has_tag, has_badge, links_to) → **solid** lines. Thicker for stronger bonds.
- **Shared** (shares_tag, shares_badge, shares_link) → **dashed** lines. Thinner, lower opacity.
- **Inferred** (depends_on, related_to, extends, implements) → **colored** lines. Cyan for dependency, purple for extension, green for implementation.

Opacity defaults and interaction states are defined in the graph-system.css template.
