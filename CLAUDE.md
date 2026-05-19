# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server on http://localhost:3000
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## Architecture Overview

**NoteGenius** is an AI-powered note-taking app built with:

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS with custom dark theme (`#0c0c1f` background), shadcn/ui components
- **AI**: Vercel AI SDK with OpenAI (GPT-4o), with local fallback algorithms when API unavailable
- **Storage**: LocalStorage for client-side persistence, JSON file for demo API

### Key Directories

```
app/
  page.tsx          # Main UI: dashboard, notes list, editor with tabs (Summary/Keywords/Quiz)
  layout.tsx        # Root layout with theme provider
  api/
    notes/
      route.ts      # CRUD API: GET/POST/PUT/DELETE notes (stores in data/notes.json)
    extract-text/
      route.ts      # File upload: extracts text from PDF/DOCX/PPTX
lib/
  ai-helpers.ts     # AI functions: summarizeNote, extractKeywords, generateQuiz + fallbacks
components/
  ui/               # shadcn/ui primitives (button, card, dialog, tabs, etc.)
  note-editor.tsx   # Textarea editor with word count
  notes-list.tsx    # Note list with search/filter
  sidebar.tsx       # Navigation sidebar
  keyword-card.tsx  # Keyword display with copy-to-clipboard
  file-upload-dialog.tsx  # Drag-drop file upload for PDF/DOCX/PPTX
types/
  note.ts           # Note interface: id, title, content, tags, createdAt, updatedAt
```

### AI Integration

The `lib/ai-helpers.ts` module provides three main functions:
- `summarizeNote(content)` - Creates structured summaries
- `extractKeywords(content)` - Extracts key concepts (returns string array)
- `generateQuiz(content)` - Generates MCQ questions with explanations

Each function has a fallback that works without OpenAI API using heuristic algorithms.

### Environment Variables

- `OPENAI_API_KEY` - Required for AI features (app works with fallbacks if missing)

### Data Flow

1. Notes are stored in **LocalStorage** on client (`notegenius-notes` key)
2. API routes read/write to `data/notes.json` for demo purposes
3. File uploads extract text via `mammoth` (DOCX), `pdf-parse` (PDF), `pptx-content-extractor` (PPTX)
