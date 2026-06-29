---
name: rui-file
description: Intelligently organizes your files and folders across your computer by understanding context, finding duplicates, suggesting better structures, and automating cleanup tasks. Reduces cognitive load and keeps your digital workspace tidy without manual effort.
lifecycle: default-pipeline
---

# Rui File

> **Restoration note (2026-06-29):** This file was rebuilt after the directory was wiped from `.claude/rui-file/`. The pre-amble (Borders / Invocation sections) below matches the original structure; the body ("## How to Use" through "## Pro Tips" through "## Best Practices") is a faithful rewrite of the typical file-organizer skill content. Please review and correct any drift from the original by checking git history (`git log --all -- .claude/rui-file/SKILL.md`).

This skill acts as your personal organization assistant, helping you maintain a clean, logical file structure across your computer without the mental overhead of constant manual organization.

## When to Use This Skill

- Your Downloads folder is a chaotic mess
- You can't find files because they're scattered everywhere
- You have duplicate files taking up space
- Your folder structure doesn't make sense anymore
- You want to establish better organization habits
- You're starting a new project and need a good structure
- You're cleaning up before archiving old projects

## What This Skill Does

1. **Analyzes Current Structure**: Reviews your folders and files to understand what you have
2. **Finds Duplicates**: Identifies duplicate files across your system
3. **Suggests Organization**: Proposes logical folder structures based on your content
4. **Automates Cleanup**: Moves, renames, and organizes files with your approval
5. **Maintains Context**: Makes smart decisions based on file types, dates, and content
6. **Reduces Clutter**: Identifies old files you probably don't need anymore

## How to Use

### From Your Home Directory

```
cd ~
```

Then run Claude Code and ask for help:

```
Help me organize my Downloads folder
```

```
Find duplicate files in my Documents folder
```

```
Review my project directories and suggest improvements
```

### Specific Organization Tasks

```
Organize these downloads into proper folders based on what they are
```

```
Find duplicate files and help me decide which to keep
```

```
Clean up old files I haven't touched in 6+ months
```

```
Create a better folder structure for my [work/projects/photos/etc]
```

## Instructions

When a user requests file organization help:

1. **Understand the Scope**

   Ask clarifying questions:
   - Which directory needs organization? (Downloads, Documents, entire home folder?)
   - What's the main problem? (Can't find things, duplicates, too messy, no structure?)
   - Any files or folders to avoid? (Current projects, sensitive data?)
   - How aggressively to organize? (Conservative vs. comprehensive cleanup)

2. **Analyze Current State**

   Review the target directory:
   ```bash
   # Get overview of current structure
   ls -la [target_directory]

   # Check file types and sizes
   find [target_directory] -type f -exec file {} \; | head -20

   # Identify largest files
   du -sh [target_directory]/* | sort -rh | head -20

   # Count file types
   find [target_directory] -type f | sed 's/.*\.//' | sort | uniq -c | sort -rn
   ```

   Summarize findings:
   - Total files and folders
   - File type breakdown
   - Size distribution
   - Date ranges
   - Obvious organization issues

3. **Identify Organization Patterns**

   Based on the files, determine logical groupings:

   **By Type**:
   - Documents (PDFs, DOCX, TXT)
   - Images (JPG, PNG, SVG)
   - Videos (MP4, MOV)
   - Archives (ZIP, TAR, DMG)
   - Code/Projects (directories with code)
   - Spreadsheets (XLSX, CSV)
   - Presentations (PPTX, KEY)

   **By Purpose**:
   - Work vs. Personal
   - Active vs. Archive
   - Project-specific
   - Reference materials
   - Temporary/scratch files

   **By Date**:
   - Current year/month
   - Previous years
   - Very old (archive candidates)

4. **Find Duplicates**

   When requested, search for duplicates:
   ```bash
   # Find exact duplicates by hash
   find [directory] -type f -exec md5 {} \; | sort | uniq -d

   # Find files with same name
   find [directory] -type f -printf '%f\n' | sort | uniq -d

   # Find similar-sized files
   find [directory] -type f -printf '%s %p\n' | sort -n
   ```

   For each set of duplicates:
   - Show all file paths
   - Display sizes and modification dates
   - Recommend which to keep (usually newest or best-named)
   - **Important**: Always ask for confirmation before deleting

5. **Propose Organization Plan**

   Present a clear plan before making changes:

   ```markdown
   # Organization Plan for [Directory]

   ## Current State
   - X files across Y folders
   - [Size] total
   - File types: [breakdown]
   - Issues: [list problems]

   ## Proposed Structure

   ```
   [Directory]/
   ├── Work/
   │   ├── Projects/
   │   ├── Documents/
   │   └── Archive/
   ├── Personal/
   │   ├── Photos/
   │   ├── Documents/
   │   └── Media/
   └── Downloads/
       ├── To-Sort/
       └── Archive/
   ```

   ## Changes I'll Make

   1. **Create new folders**: [list]
   2. **Move files**:
      - X PDFs → Work/Documents/
      - Y images → Personal/Photos/
      - Z old files → Archive/
   3. **Rename files**: [any renaming patterns]
   4. **Delete**: [duplicates or trash files]

   ## Files Needing Your Decision

   - [List any files you're unsure about]

   Ready to proceed? (yes/no/modify)
   ```

6. **Execute Organization**

   After approval, organize systematically:
   - Create new folder structure
   - Move files in batches
   - Show progress as you go
   - Verify nothing is lost
   - Generate summary of changes

## Pro Tips

1. **Start Small**: Begin with one messy folder (like Downloads) to build trust
2. **Regular Maintenance**: Run weekly cleanup on Downloads
3. **Consistent Naming**: Use "YYYY-MM-DD - Description" format for important files
4. **Archive Aggressively**: Move old projects to Archive instead of deleting
5. **Keep Active Separate**: Maintain clear boundaries between active and archived work
6. **Trust the Process**: Let Claude handle the cognitive load of where things go

## Best Practices

### Folder Naming
- Use clear, descriptive names
- Avoid spaces (use hyphens or underscores)
- Be specific: "client-proposals" not "docs"
- Use prefixes for ordering: "01-current", "02-archive"

### File Naming
- Include dates: "2024-10-17-meeting-notes.md"
- Be descriptive: "q3-financial-report.xlsx"
- Avoid version numbers in names (use version control instead)
- Remove download artifacts: "document-final-v2 (1).pdf" → "document.pdf"

### When to Archive
- Projects not touched in 6+ months
- Completed work that might be referenced later
- Old versions after migration to new systems
- Files you're hesitant to delete (archive first)

## Related Use Cases

- Setting up organization for a new computer
- Preparing files for backup/archiving
- Cleaning up before storage cleanup
- Organizing shared team folders
- Structuring new project directories

## 规则

- [filesystem-boundaries.md](./rules/filesystem-boundaries.md) — 文件系统操作的安全边界、确认级别、风险分级与自我隔离硬规则。

## 专业代理

- [pattern-detector.md](./agents/pattern-detector.md) — 识别目录的主导组织模式，输出"仅方案"。
- [safety-auditor.md](./agents/safety-auditor.md) — 在每一次 move / rename / delete 前做安全预检。

## Borders

### What this skill does

- Analyze a directory's structure (file types, sizes, dates, duplicates by hash/name)
- Propose an organization plan (folders, naming conventions, archive candidates)
- Execute moves/renames after explicit user approval
- Identify duplicates and recommend which copy to keep

### What this skill does NOT do

- **Touch files outside the user-specified scope** — operates only inside the analyzed directory
- **Bulk delete without confirmation** — every irreversible action requires yes/no/modify
- **Sync to cloud / backup services** — local filesystem operations only
- **Understand file content (semantic)** — heuristics are by type, name, date, and hash; not by contents

### Coordinated with

| Skill | Direction | See |
|-------|-----------|-----|
| (standalone) | — | No cross-skill contract; invoked manually when files need cleanup |

### Output ownership

| Path | Permission |
|------|-----------|
| User-specified target directory | **propose then write** (after explicit approval) |
| Home / system directories | never touch |
| Anywhere else | no write |

### Invocation

rui-file has **no CLI entry** — it is invoked through conversation. The user typically says "Help me organize Downloads" or "Find duplicate files in Documents"; the skill then audits, plans, and waits for approval before mutating anything.
