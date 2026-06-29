#!/usr/bin/env python3
"""
Deterministic graph builder for rui-graph.

Reads card-analysis.json and produces graph-data.json with Cytoscape.js-compatible
elements (nodes + edges). Handles node creation, edge construction, deduplication,
mode-specific filtering, and incremental merges.

Usage:
    python build-graph.py <card-analysis.json> <output-graph-data.json> [--mode <mode>] [--focal-card <id>] [--existing <path>]

Modes: full (default), simple, ego, compare, embed, generic, incremental
"""

import json
import sys
import os
from pathlib import Path
from datetime import datetime, timezone

# ---------------------------------------------------------------------------
# Canonical sets
# ---------------------------------------------------------------------------

VALID_BADGES = {"Core", "Report", "Guide", "OSS", "Agent", "Beta",
                "核心", "报告", "指南"}

VALID_MODIFIERS = {"warn", "accent", "info", "red", "purple", "cyan", "pass", "green"}

BADGE_COLORS = {
    "Core": "#34d399", "核心": "#34d399",
    "Report": "#fb7185", "报告": "#fb7185",
    "Guide": "#38bdf8", "指南": "#38bdf8",
    "OSS": "#fbbf24",
    "Agent": "#a78bfa",
    "Beta": "#fb923c",
}

MODIFIER_COLORS = {
    "warn": "#f59e0b", "accent": "#eab308", "info": "#3b82f6",
    "red": "#ef4444", "purple": "#8b5cf6", "cyan": "#06b6d4",
    "pass": "#22c55e", "green": "#22c55e",
}

# ---------------------------------------------------------------------------
# Node size helpers
# ---------------------------------------------------------------------------

def card_size(richness: int) -> dict:
    """Map richness score to width/height for Cytoscape node styling."""
    w = 100 + richness * 15
    h = 44 + richness * 8
    return {"width": min(w, 220), "height": min(h, 100)}


def tag_size(cooccurrence: int) -> dict:
    """Map tag co-occurrence count to width/height."""
    w = 70 + cooccurrence * 5
    h = 30 + cooccurrence * 3
    return {"width": min(w, 150), "height": min(h, 60)}


# ---------------------------------------------------------------------------
# Node builders
# ---------------------------------------------------------------------------

def build_card_nodes(cards: list) -> list:
    """Build card node elements."""
    nodes = []
    for card in cards:
        node = {
            "data": {
                "id": card["id"],
                "type": "card",
                "label": card["name"],
                "badge": card.get("badge"),
                "badgeNormalized": card.get("badgeNormalized", card.get("badge", "").lower()),
                "desc": card.get("desc", ""),
                "tags": card.get("tags", []),
                "meta": card.get("meta"),
                "richness": card.get("richness", 1),
                "tier": card.get("tier", "standard"),
                "category": card.get("category", ""),
                "href": card.get("href"),
                "links": card.get("links") or [],
                "semanticTags": card.get("semanticTags", []),
            }
        }
        nodes.append(node)
    return nodes


def build_tag_nodes(tag_cooccurrence: dict) -> list:
    """Build tag node elements from co-occurrence data."""
    nodes = []
    for text, info in tag_cooccurrence.items():
        # Determine modifier — use the first card's tag modifier for this tag
        modifier = "info"
        if info.get("cards"):
            # We don't have the modifier per-card here; we'll infer from card analysis
            # The card-analysis.json should have modifier info on individual tags
            pass

        nodes.append({
            "data": {
                "id": f"tag:{text}",
                "type": "tag",
                "label": text,
                "modifier": info.get("modifier", "info"),
                "cooccurrence": info.get("count", 1),
            }
        })
    return nodes


def build_badge_nodes(badges: list, cards: list) -> list:
    """Build badge group nodes."""
    nodes = []
    badge_counts = {}
    for card in cards:
        b = card.get("badge")
        if b:
            badge_counts[b] = badge_counts.get(b, 0) + 1

    for badge in badges:
        nodes.append({
            "data": {
                "id": f"badge:{badge}",
                "type": "badge",
                "label": badge,
                "badgeColor": BADGE_COLORS.get(badge, "#22d3ee"),
                "cardCount": badge_counts.get(badge, 0),
            }
        })
    return nodes


def build_link_dest_nodes(cards: list) -> list:
    """Build link destination nodes (unique URLs)."""
    seen = {}
    for card in cards:
        for link in (card.get("links") or []):
            href = link.get("href", "")
            if href and href not in seen:
                label = link.get("label", href)
                seen[href] = label

    nodes = []
    for href, label in seen.items():
        slug = href.replace("https://", "").replace("http://", "").replace("/", "_")[:60]
        nodes.append({
            "data": {
                "id": f"link_dest:{slug}",
                "type": "link_dest",
                "label": label,
                "url": href,
            }
        })
    return nodes


def build_cluster_nodes(tag_clusters: list) -> list:
    """Build cluster nodes from tag co-occurrence clusters."""
    nodes = []
    for cluster in tag_clusters:
        name = cluster.get("name", "Cluster")
        slug = name.lower().replace(" ", "-")
        nodes.append({
            "data": {
                "id": f"cluster:{slug}",
                "type": "cluster",
                "label": name,
                "memberTags": cluster.get("tags", []),
                "memberCards": cluster.get("cards", []),
            }
        })
    return nodes


# ---------------------------------------------------------------------------
# Edge builders
# ---------------------------------------------------------------------------

def build_has_tag_edges(cards: list) -> list:
    """Build has_tag edges: card → tag."""
    edges = []
    seen = set()
    for card in cards:
        for tag in (card.get("tags") or []):
            if isinstance(tag, dict):
                tag_text = tag.get("text", tag)
            else:
                tag_text = str(tag)

            edge_id = f"edge:{card['id']}:tag:{tag_text}"
            if edge_id not in seen:
                seen.add(edge_id)
                edges.append({
                    "data": {
                        "id": edge_id,
                        "source": card["id"],
                        "target": f"tag:{tag_text}",
                        "type": "has_tag",
                    }
                })
    return edges


def build_has_badge_edges(cards: list) -> list:
    """Build has_badge edges: card → badge."""
    edges = []
    seen = set()
    for card in cards:
        badge = card.get("badge")
        if badge:
            edge_id = f"edge:{card['id']}:badge:{badge}"
            if edge_id not in seen:
                seen.add(edge_id)
                edges.append({
                    "data": {
                        "id": edge_id,
                        "source": card["id"],
                        "target": f"badge:{badge}",
                        "type": "has_badge",
                    }
                })
    return edges


def build_links_to_edges(cards: list) -> list:
    """Build links_to edges: card → link destination."""
    edges = []
    seen = set()
    for card in cards:
        for link in (card.get("links") or []):
            href = link.get("href", "")
            if href:
                slug = href.replace("https://", "").replace("http://", "").replace("/", "_")[:60]
                edge_id = f"edge:{card['id']}:link_dest:{slug}"
                if edge_id not in seen:
                    seen.add(edge_id)
                    edges.append({
                        "data": {
                            "id": edge_id,
                            "source": card["id"],
                            "target": f"link_dest:{slug}",
                            "type": "links_to",
                        }
                    })
    return edges


def build_shared_edges(cards: list, edge_type: str, key_fn) -> list:
    """Generic shared-edge builder for shares_tag, shares_badge, shares_link."""
    edges = []
    seen = set()

    for i in range(len(cards)):
        for j in range(i + 1, len(cards)):
            ci, cj = cards[i], cards[j]
            shared = key_fn(ci, cj)
            for item in shared:
                a, b = sorted([ci["id"], cj["id"]])
                edge_id = f"edge:{a}:{b}:{edge_type}:{item}"
                if edge_id not in seen:
                    seen.add(edge_id)
                    edges.append({
                        "data": {
                            "id": edge_id,
                            "source": a,
                            "target": b,
                            "type": edge_type,
                            "shared": item,
                        }
                    })
    return edges


def shared_tags(ci, cj):
    ti = {t.get("text", t) if isinstance(t, dict) else str(t) for t in (ci.get("tags") or [])}
    tj = {t.get("text", t) if isinstance(t, dict) else str(t) for t in (cj.get("tags") or [])}
    return ti & tj


def shared_badges(ci, cj):
    bi = ci.get("badge")
    bj = cj.get("badge")
    if bi and bj and bi == bj:
        return {bi}
    return set()


def shared_links(ci, cj):
    li = {l.get("href", "") for l in (ci.get("links") or []) if l.get("href")}
    lj = {l.get("href", "") for l in (cj.get("links") or []) if l.get("href")}
    return li & lj


def build_llm_edges(cards: list) -> list:
    """Build LLM-inferred edges from card relationships."""
    edges = []
    seen = set()
    edge_types = {"depends_on", "related_to", "extends", "implements"}

    for card in cards:
        for rel in card.get("relationships", []):
            etype = rel.get("type", "")
            if etype not in edge_types:
                continue
            target = rel.get("target", "")
            if not target:
                continue

            edge_id = f"edge:{card['id']}:{target}:{etype}"
            if edge_id not in seen:
                seen.add(edge_id)
                edges.append({
                    "data": {
                        "id": edge_id,
                        "source": card["id"],
                        "target": target,
                        "type": etype,
                        "reason": rel.get("reason", ""),
                        "weight": rel.get("weight", 0.5),
                    }
                })
    return edges


# ---------------------------------------------------------------------------
# Deduplication
# ---------------------------------------------------------------------------

def deduplicate_nodes(nodes: list) -> list:
    """Deduplicate nodes by ID, keeping last occurrence."""
    seen = {}
    for n in nodes:
        seen[n["data"]["id"]] = n
    return list(seen.values())


def deduplicate_edges(edges: list) -> list:
    """Deduplicate edges by ID and by (source, target, type) key."""
    by_id = {}
    by_key = set()
    result = []
    for e in edges:
        eid = e["data"]["id"]
        key = (e["data"]["source"], e["data"]["target"], e["data"]["type"])
        if key not in by_key:
            by_key.add(key)
            by_id[eid] = e
            result.append(e)
    return result


def drop_dangling_edges(edges: list, node_ids: set) -> list:
    """Remove edges whose source or target doesn't exist in node_ids."""
    dropped = 0
    result = []
    for e in edges:
        src = e["data"]["source"]
        tgt = e["data"]["target"]
        if src in node_ids and tgt in node_ids:
            result.append(e)
        else:
            dropped += 1
    if dropped:
        print(f"[build-graph] Dropped {dropped} dangling edges", file=sys.stderr)
    return result


# ---------------------------------------------------------------------------
# Mode-specific filtering
# ---------------------------------------------------------------------------

def apply_mode_b(nodes: list, edges: list) -> tuple:
    """Mode B: card-only nodes + shares edges. Remove tag/link_dest/badge/cluster nodes."""
    card_ids = {n["data"]["id"] for n in nodes if n["data"]["type"] == "card"}
    nodes = [n for n in nodes if n["data"]["type"] == "card"]
    edges = [e for e in edges
             if e["data"]["type"] in ("shares_tag", "shares_badge", "shares_link",
                                       "depends_on", "related_to", "extends", "implements")]
    edges = [e for e in edges
             if e["data"]["source"] in card_ids and e["data"]["target"] in card_ids]
    return nodes, edges


def apply_mode_c(nodes: list, edges: list, focal_card_id: str) -> tuple:
    """Mode C: ego graph — focal card + 1-hop neighborhood."""
    card_ids = {n["data"]["id"] for n in nodes if n["data"]["type"] == "card"}
    tag_ids = {n["data"]["id"] for n in nodes if n["data"]["type"] == "tag"}
    link_ids = {n["data"]["id"] for n in nodes if n["data"]["type"] == "link_dest"}

    # Find 1-hop neighbors
    neighborhood = {focal_card_id}
    for e in edges:
        src, tgt = e["data"]["source"], e["data"]["target"]
        if src == focal_card_id:
            neighborhood.add(tgt)
        if tgt == focal_card_id:
            neighborhood.add(src)

    nodes = [n for n in nodes if n["data"]["id"] in neighborhood]
    valid_ids = {n["data"]["id"] for n in nodes}
    edges = [e for e in edges
             if e["data"]["source"] in valid_ids and e["data"]["target"] in valid_ids]

    print(f"[build-graph] Mode C: ego graph for {focal_card_id} — {len(nodes)} nodes, {len(edges)} edges (1-hop)",
          file=sys.stderr)
    return nodes, edges


def apply_mode_g(new_nodes: list, new_edges: list, existing_path: str) -> tuple:
    """Mode G: merge new data into existing graph-data.json."""
    if not os.path.exists(existing_path):
        print(f"[build-graph] Warning: existing graph not found at {existing_path}, using new data only",
              file=sys.stderr)
        return new_nodes, new_edges

    existing = json.loads(Path(existing_path).read_text(encoding="utf-8"))
    old_nodes = existing.get("nodes", [])
    old_edges = existing.get("edges", [])

    # Build lookup
    old_node_ids = {n["data"]["id"]: n for n in old_nodes}
    new_node_ids = {n["data"]["id"]: n for n in new_nodes}

    # Remove nodes that changed (new version replaces old)
    for nid in new_node_ids:
        old_node_ids.pop(nid, None)

    # Merge: keep unchanged old nodes + all new nodes
    merged_nodes = list(old_node_ids.values()) + new_nodes

    # Keep old edges for unchanged cards, add all new edges
    merged_card_ids = {n["data"]["id"] for n in merged_nodes if n["data"]["type"] == "card"}
    merged_edges = new_edges  # all new edges

    # Add old edges that involve at least one unchanged card
    old_edge_set = {(e["data"]["source"], e["data"]["target"], e["data"]["type"]) for e in new_edges}
    for e in old_edges:
        src, tgt = e["data"]["source"], e["data"]["target"]
        # Keep LLM-inferred edges for unchanged cards
        if e["data"]["type"] in ("depends_on", "related_to", "extends", "implements"):
            if src in merged_card_ids and tgt in merged_card_ids:
                key = (src, tgt, e["data"]["type"])
                if key not in old_edge_set:
                    merged_edges.append(e)
                    old_edge_set.add(key)

    # Deduplicate
    merged_nodes = deduplicate_nodes(merged_nodes)
    all_ids = {n["data"]["id"] for n in merged_nodes}
    merged_edges = drop_dangling_edges(merged_edges, all_ids)

    print(f"[build-graph] Mode G: merged — {len(old_nodes)} old + {len(new_nodes)} new → {len(merged_nodes)} nodes",
          file=sys.stderr)
    return merged_nodes, merged_edges


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def build_graph(input_path: str, output_path: str, mode: str = "full",
                focal_card_id: str = None, existing_path: str = None):
    """Main entry point: read card analysis, produce graph data."""

    # Load card analysis
    analysis = json.loads(Path(input_path).read_text(encoding="utf-8"))
    cards = analysis.get("cards", [])
    tag_cooc = analysis.get("tagCooccurrence", {})
    badges = analysis.get("badges", [])
    tag_clusters = analysis.get("tagClusters", [])

    print(f"[build-graph] Input: {len(cards)} cards, {len(tag_cooc)} tags, {len(badges)} badges, "
          f"{len(tag_clusters)} clusters", file=sys.stderr)

    # Tag modifiers from card tags
    tag_modifiers = {}
    for card in cards:
        for tag in (card.get("tags") or []):
            if isinstance(tag, dict):
                text = tag.get("text", "")
                mod = tag.get("modifier", "info")
                if text:
                    tag_modifiers[text] = mod

    # Build nodes
    nodes = []
    nodes += build_card_nodes(cards)
    nodes += build_tag_nodes(tag_cooc)
    nodes += build_badge_nodes(badges, cards)
    nodes += build_link_dest_nodes(cards)
    nodes += build_cluster_nodes(tag_clusters)

    # Inject tag modifiers
    for n in nodes:
        if n["data"]["type"] == "tag":
            text = n["data"]["label"]
            if text in tag_modifiers:
                n["data"]["modifier"] = tag_modifiers[text]

    # Build edges
    edges = []
    edges += build_has_tag_edges(cards)
    edges += build_has_badge_edges(cards)
    edges += build_links_to_edges(cards)
    edges += build_shared_edges(cards, "shares_tag", shared_tags)
    edges += build_shared_edges(cards, "shares_badge", shared_badges)
    edges += build_shared_edges(cards, "shares_link", shared_links)
    edges += build_llm_edges(cards)

    # Deduplicate
    nodes = deduplicate_nodes(nodes)
    edges = deduplicate_edges(edges)

    # Drop dangling edges
    node_ids = {n["data"]["id"] for n in nodes}
    edges = drop_dangling_edges(edges, node_ids)

    # Apply mode
    if mode == "simple" or mode == "b":
        nodes, edges = apply_mode_b(nodes, edges)
    elif (mode == "ego" or mode == "c") and focal_card_id:
        nodes, edges = apply_mode_c(nodes, edges, focal_card_id)
    elif mode == "incremental" or mode == "g":
        nodes, edges = apply_mode_g(nodes, edges, existing_path)

    # Edge type counts
    edge_types = {}
    for e in edges:
        t = e["data"]["type"]
        edge_types[t] = edge_types.get(t, 0) + 1

    # Node type counts
    node_types = {}
    for n in nodes:
        t = n["data"]["type"]
        node_types[t] = node_types.get(t, 0) + 1

    # Assemble output
    output = {
        "nodes": nodes,
        "edges": edges,
        "meta": {
            "generatedAt": datetime.now(timezone.utc).isoformat(),
            "source": analysis.get("source", ""),
            "mode": mode,
            "cardCount": len(cards),
            "nodeCount": len(nodes),
            "edgeCount": len(edges),
            "nodeTypeCounts": node_types,
            "edgeTypeCounts": edge_types,
            "badges": badges,
        }
    }

    # Write
    out = Path(output_path)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(output, indent=2), encoding="utf-8")

    print(f"[build-graph] Output: {len(nodes)} nodes ({', '.join(f'{k}:{v}' for k,v in node_types.items())}), "
          f"{len(edges)} edges ({', '.join(f'{k}:{v}' for k,v in edge_types.items())})", file=sys.stderr)
    print(f"[build-graph] Written: {output_path}", file=sys.stderr)


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Build Cytoscape.js graph from card analysis")
    parser.add_argument("input", help="Path to card-analysis.json")
    parser.add_argument("output", help="Path for output graph-data.json")
    parser.add_argument("--mode", default="full",
                        choices=["full", "simple", "ego", "compare", "embed", "generic", "incremental",
                                 "b", "c", "d", "e", "f", "g"],
                        help="Graph mode (default: full)")
    parser.add_argument("--focal-card", help="Focal card ID for ego mode")
    parser.add_argument("--existing", help="Path to existing graph-data.json for incremental mode")
    parser.add_argument("--verbose", action="store_true", help="Verbose output")

    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"Error: {args.input} not found", file=sys.stderr)
        sys.exit(1)

    try:
        build_graph(args.input, args.output, args.mode, args.focal_card, args.existing)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        if args.verbose:
            import traceback
            traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
