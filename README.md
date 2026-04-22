# 🧠 ThinkStack

**A local-first, RAG-powered AI chat platform — chat with your documents using a private LLM.**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector_Store-E44C2C?style=flat)](https://www.trychroma.com/)
[![Ollama](https://img.shields.io/badge/Ollama-Local_LLM-000000?style=flat)](https://ollama.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat)](https://opensource.org/licenses/MIT)

---

## 🤔 What Problem Does ThinkStack Solve?

Most AI chat tools send your documents to third-party servers, making them unsuitable for private or sensitive data. ThinkStack runs entirely on your machine — your documents never leave your environment.

Beyond privacy, generic AI chat lacks **context memory**. ThinkStack organises your work into **Projects**, each with its own persistent knowledge base built from the documents you upload. When you ask a question, it doesn't just query an LLM blindly — it first retrieves the most relevant chunks from your documents and past conversations, then feeds that context to the model. This is Retrieval-Augmented Generation (RAG) in action.

---

## ✨ What ThinkStack Does

| Feature | Description |
|---|---|
| 📁 **Project-based Knowledge** | Organise your work into projects. Each project has its own isolated document store and chat history. |
| 📄 **Document Ingestion** | Upload PDFs and text files to a project. They are parsed, chunked, embedded, and stored in a local vector database. |
| 🔍 **RAG-Powered Chat** | Every query retrieves the most semantically relevant document chunks before the LLM responds — answers are grounded in your actual files. |
| 🧵 **Persistent Chat Memory** | Past conversations are also embedded and retrieved, giving the AI long-term context within a project. |
| 🔒 **Fully Local LLM** | Uses Ollama to run language and embedding models on your own machine. No data leaves your environment. |
| 🔐 **User Authentication** | Google OAuth via Firebase Authentication with secure session management. |
| 📊 **Streaming Responses** | LLM responses stream token-by-token to the UI for a real-time chat feel. |
| 🎯 **Career Coach Mode** | Detects CV/resume-related queries and switches to a specialised Career Coach prompt with structured output. |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (User)                      │
│              Next.js App (React + TypeScript)           │
└──────────────┬──────────────────────────────────────────┘
               │  API Routes (Next.js Server)
               │
       ┌───────▼────────┐
       │   RAG Pipeline  │
       │                 │
       │  1. Embed Query │──────────────▶ Ollama
       │  2. Retrieve    │──────────────▶ ChromaDB (Vector Store)
       │  3. Build Prompt│
       │  4. Stream LLM  │──────────────▶ Ollama (LLM)
       │  5. Store Memory│──────────────▶ ChromaDB + Firestore
       └─────────────────┘
               │
       ┌───────▼────────┐
       │    Firebase     │
       │  Auth, Firestore│
       │  (Cloud)        │
       └─────────────────┘
```

### RAG Pipeline (step by step)

1. **Ingestion** — When you upload a file, it is parsed (`pdf-parse`), split into overlapping chunks, embedded via `nomic-embed-text` on Ollama, and stored in ChromaDB tagged with project and file metadata.

2. **Inference** — When you send a message:
   - The query is embedded using the same model.
   - ChromaDB performs a nearest-neighbour search to retrieve the top-8 relevant document chunks (project memory) and top-5 relevant past conversation snippets (chat memory).
   - A structured prompt is assembled with both memory types and recent chat history.
   - The prompt is streamed to the Ollama LLM.
   - The full response is stored back into ChromaDB as a new chat memory entry.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui |
| **State Management** | Zustand |
| **Backend** | Next.js API Routes (serverless functions) |
| **Auth** | Firebase Authentication (Google OAuth) |
| **Database** | Firebase Firestore (projects, chats, file metadata) |
| **Vector Store** | ChromaDB (local Docker container) |
| **LLM** | Ollama (local — any compatible model) |
| **Embeddings** | Ollama (`nomic-embed-text`) |
| **File Parsing** | `pdf-parse` for PDFs, plain text support |
| **Markdown Rendering** | `react-markdown` + `rehype-raw` |

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Run the Next.js app |
| Docker | Latest | Run ChromaDB |
| Ollama | Latest | Run the LLM and embedding model locally |
| Firebase project | — | Auth and Firestore |

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/thinkstack.git
cd thinkstack
npm install
```

### 2. Start ChromaDB

```bash
docker run -p 8000:8000 chromadb/chroma
```

### 3. Start Ollama and Pull Models

```bash
# Pull the embedding model
ollama pull nomic-embed-text

# Pull a chat model (example)
ollama pull qwen2.5-coder:7b
```

### 4. Configure Environment

Create a `.env.local` file at the project root and fill in your Firebase credentials:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.region.firebasedatabase.app

# Services
OLLAMA_URL=http://localhost:11434
CHROMA_URL=http://localhost:8000
```

### 5. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📂 Project Structure

```
thinkstack/
├── app/
│   ├── (auth)/                 # Login and Register pages
│   │   ├── login/
│   │   └── register/
│   ├── api/                    # Next.js API Routes
│   │   ├── chat/               # RAG pipeline + Ollama streaming
│   │   ├── project_files/      # File upload, chunking, embedding, storage
│   │   ├── parse-file/         # File text extraction
│   │   └── upload/             # Firebase Storage upload
│   ├── components/
│   │   ├── chat/               # Chat interface with streaming support
│   │   ├── layout/             # Dashboard layout, sidebar, header
│   │   ├── project/            # Project CRUD, file management, overview
│   │   └── prompt/             # Custom input, prompt helpers
│   ├── dashboard/
│   │   └── [projectId]/
│   │       └── [chat]/         # Dynamic chat route per project/session
│   ├── hooks/
│   │   └── useChat.ts          # Chat state + streaming logic
│   ├── lib/
│   │   ├── chroma/             # ChromaDB client
│   │   ├── embeddings/         # Ollama embedding functions
│   │   ├── firebase/           # Firestore services (projects, chats, files)
│   │   ├── utils/
│   │   │   └── chunkText.ts    # Sliding-window text chunker
│   │   ├── file-parser.ts      # PDF + text parsing
│   │   ├── prompt.ts           # Prompt builder (RAG + chat history)
│   │   └── rag.ts              # Vector retrieval and context assembly
│   └── services/
│       └── chat.service.ts     # Chat message persistence + memory storage
├── components/
│   └── ui/                     # shadcn/ui base components
├── store/
│   └── store.ts                # Zustand global store
├── types/
│   └── memory.ts               # TypeScript types for memory/chat
├── config/
│   └── env.ts                  # Environment variable helpers
└── middleware.ts               # Auth route protection
```

---

## ⚙️ Key Configuration

### Chunking Strategy

Text is split using a sliding-window chunker in `app/lib/utils/chunkText.ts`:
- **Chunk size**: 1000 characters (default)
- **Overlap**: 200 characters

Overlap ensures that sentences near chunk boundaries appear in adjacent chunks, preventing context loss during retrieval.

### Retrieval Settings

Configured in `app/lib/rag.ts`:
- **Project memory** (document chunks): top 8 results
- **Chat memory** (past conversations): top 5 results
- Ranked by cosine distance — lower is better.

### Changing the LLM Model

Update the model name in `app/api/chat/route.ts`:

```ts
model: "qwen2.5-coder:7b",  // replace with any model available via `ollama list`
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat` | Send a message; returns a streaming RAG response |
| `POST` | `/api/project_files` | Upload and index a file into a project |
| `DELETE` | `/api/project_files?fileId=&projectId=` | Remove a file from Firestore and ChromaDB |
| `POST` | `/api/parse-file` | Parse a file and return raw text |
| `POST` | `/api/upload` | Upload a file to Firebase Storage |
| `GET` | `/api/debug-chroma` | Debug endpoint to inspect ChromaDB collections |

---

## 🐳 Docker (Coming Soon)

A full Docker Compose setup is in progress that will containerise the Next.js app alongside ChromaDB and Ollama, eliminating the need for any local native installs. See `analysis_results.md` for the planned architecture.

---

## 🗺️ Roadmap

- [ ] Full Docker Compose setup (Next.js + ChromaDB + Ollama)
- [ ] Support for more file types (DOCX, TXT, Markdown)
- [ ] Configurable chunking strategy per project
- [ ] Model selection UI per project
- [ ] Export chat history

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

**Built for developers who want AI that respects their privacy.** 🔒