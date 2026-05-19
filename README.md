# NoteGenius — AI-Powered Study Assistant

NoteGenius is a modern, AI-first note-taking app that turns raw notes into learning superpowers. It generates smart summaries, extracts key concepts, creates MCQ quizzes, and even processes raw math equations using state-of-the-art vision and reasoning models—all in a polished, responsive UI.

Made by: **Amit Singh Rajput**  
Contact: **amitsinghrajput263@gmail.com**

---

## ✨ Features

- **Smart Summaries**  
  Create comprehensive and structured summaries from your study notes instantly.

- **Keyword Extraction**  
  Identify and visualize key concepts with a clean, copy-to-clipboard grid.

- **MCQ Quiz Generator**  
  Turn notes into multiple-choice questions with dynamic scoring, explanations, and plausible distractors.

- **Math Practice Lab & Image OCR**  
  Upload images (PNG/JPG/WebP) or PDFs containing math problems. The app uses advanced AI Vision and an intelligent text-unwrapping algorithm that aggressively crushes whitespace while preserving paragraph breaks before questions to extract the raw math text seamlessly.
  
- **Review and Generate Variations**  
  In the Math Lab, you can review the smartly compressed text extracted from documents before sending it to the AI. Instantly generate limitless variations of extracted math problems to create complete, tailored practice sets.

- **Document Extraction**  
  Seamlessly upload and extract text from PDF, DOCX, and PPTX files to instantly create study notes.

- **Offline Resilience**  
  Graceful local fallback algorithms take over if the AI API is unavailable or rate-limited.

- **Smooth, Modern UI**  
  Gradient theming, glass-morphism panels, smooth micro-interactions, and a responsive dark-mode design.

---

## 🧠 Tech Stack

- **Framework**: Next.js 15 (App Router), React 19, JavaScript  
- **Styling**: Tailwind CSS, shadcn/ui primitives  
- **AI Integration**: Vercel AI SDK powered by **OpenRouter**  
- **AI Models**: NVIDIA Nemotron-3 Reasoning (`nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free`) for advanced logic and OCR capabilities.  
- **Data**: Lightweight JSON storage via Next.js Route Handlers  

---

## 🚀 Getting Started

### 1) Clone and install

```bash
git clone https://github.com/amitioholics/NoteGenius.git
cd NoteGenius
npm install
```

### 2) Environment variables

Create a `.env.local` file in the root of the project to enable the live AI features:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```
*(Note: If the key is omitted or exhausted, the app falls back to local algorithms).*

### 3) Run the dev server

```bash
npm run dev
```

Visit http://localhost:3000 to access your Neural Laboratory.

---

## 🧪 How to Use

1. **Create a Note**: Click “New Note” and add your content to the Editor tab.
2. **AI Tab System**: 
   - **Summary**: Generate a detailed, structured summary.
   - **Keywords**: Extract and copy key concepts.
   - **Quiz**: Generate MCQs, select your answers, and view your score.
3. **Math Lab**: 
   - Navigate to Math Practice.
   - Upload an image or PDF of math questions. The AI Vision model will extract the questions automatically.
   - View generated AI variations of your math questions.
   - Click **Generate More Variations** to continuously create new, unique practice questions.
4. **Document Upload**: Use "Upload File" to parse text directly from PDF, DOCX, or PPTX.

---

## 🔌 API

Base path: `/api/notes`

- `GET /api/notes` — fetch all notes  
- `POST /api/notes` — create a note  
- `PUT /api/notes` — update a note  
- `DELETE /api/notes?id=<noteId>` — delete a note
- `POST /api/extract-text` — handles complex OCR, PPTX, DOCX, and PDF text extraction.

---

## 🤖 AI Details & Architecture

The app is deeply integrated with the Vercel AI SDK and routes requests through the `@ai-sdk/openai` compatible provider directly to **OpenRouter**. 
- It uses reasoning-focused models to ensure logical mathematical generation and accurate image OCR.
- **Fallbacks**: If the API is missing or encounters a `429 Rate Limit`, local heuristic algorithms provide sentence-scoring summaries, frequency-based keyword extraction, and rule-based quiz generation to ensure the app never breaks during demos.

---

## 👤 Author

**Amit Singh Rajput**  
Email: `amitsinghrajput263@gmail.com`  
LinkedIn: [Amit Kumar](https://www.linkedin.com/in/amit-kumar-0a6617258)  
GitHub: [amitioholics](https://github.com/amitioholics/NoteGenius)

---

## 📝 License

MIT License — © Amit Singh Rajput

You are free to use, modify, and distribute this software with attribution.
