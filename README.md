# Hermes
*A local-first language learning system based on sentence-centered learning*

---

## 1. Overall Concept

Hermes is a **local-first learning platform** that converts Anki decks into an interactive web-based language learning experience.

The system consists of:

- A **Python-based local server**
- An **extraction and transformation tool** for Anki decks
- A **local SQLite database** for normalized deck data
- A **static Angular SPA** served by the Python server
- **Client-side progress storage** (IndexedDB)
- Optional **server-side speech processing**

The guiding principle is:
> *One sentence is the atomic learning unit.*

All learning modes are different cognitive perspectives on the same sentence data.

---

## 2. Python Server (Core Backend)

### 2.1 Responsibilities

The Python server is responsible for:

- Serving the Angular application over HTTP
- Providing REST APIs for deck access
- Importing and extracting Anki decks (`.apkg`)
- Managing media (audio)
- Maintaining a normalized SQLite database
- (Optional) Speech-to-text processing
- Acting as a local orchestration layer (no cloud dependency)

### 2.2 Technology Choice

Recommended stack:

- **FastAPI** (preferred) or Flask
- SQLite (embedded, local)
- SQLAlchemy (optional ORM)
- Uvicorn (development server)

---

## 3. API Design

### 3.1 Static App Serving

```http
GET /
GET /index.html
GET /assets/*
