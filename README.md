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
````

Serves the Angular `dist/` output.

---

### 3.2 Deck Management

```http
GET /api/decks
```

Returns a list of available decks and metadata.

```http
GET /api/decks/{deck_id}
```

Returns deck structure:

* lessons
* cards
* sentence text
* tokenized form
* audio references

---

### 3.3 Media Access

```http
GET /media/{audio_id}.mp3
```

Serves audio files with range support.

---

### 3.4 Deck Import

```http
POST /api/import/anki
```

* Accepts `.apkg` upload
* Triggers extraction pipeline
* Populates SQLite
* Copies and normalizes media
* Generates internal IDs

---

### 3.5 (Optional) Speech-to-Text

```http
POST /api/speech/transcribe
```

* Accepts audio blob
* Returns recognized text
* Implementation may use Whisper locally

This endpoint is optional and can be disabled for v1.

---

## 4. Anki Extraction Tool

### 4.1 Input

* `.apkg` file (ZIP archive)
* Contains:

  * SQLite database (`collection.anki2`)
  * Media files
  * Note and card templates

---

### 4.2 Extraction Steps

1. Unzip `.apkg`
2. Read `collection.anki2`
3. Extract:

   * Deck hierarchy
   * Notes
   * Cards
   * Fields (front/back)
4. Resolve `[sound:xyz.mp3]` references
5. Copy and rename media files
6. Normalize data into Hermes schema
7. Store results in SQLite

---

### 4.3 Normalization Rules

* Each **card** becomes one learning sentence
* Sentence text is stored raw and normalized
* Tokenization separates:

  * words
  * punctuation
* Stable IDs are generated:

  * Based on Anki note ID + card ordinal
* Optional alternative correct sentences may be stored

---

## 5. SQLite Database Schema (Conceptual)

### Tables

* `decks`
* `lessons`
* `cards`
* `tokens`
* `audio`
* `card_audio_map`

### Notes

* SQLite stores **content only**
* Learning progress is **not** stored here (v1)
* Database is regenerated when importing decks

---

## 6. Angular Frontend (SPA)

### 6.1 Architecture

* Angular (standalone or module-based)
* Pure TypeScript, no server-side rendering
* Communicates with Python server via REST
* Stores progress in IndexedDB

---

### 6.2 Data Flow

1. App loads
2. Fetches available decks
3. User selects a deck and lesson
4. App fetches lesson JSON
5. Learning session starts
6. Progress saved locally

---

## 7. Learning Model

### 7.1 Core Principle

> Learning is based on **reconstruction, not recognition alone**.

Each task is a different cognitive operation on the same sentence.

---

## 8. Learning Task Clusters (v1)

### Task 1 – Sentence Reconstruction (Primary)

* Audio is played
* Words are shuffled
* User reconstructs sentence via drag & drop
* Token-based scoring (order-sensitive)
* If ≥80% correct → correction allowed
* Below threshold → marked incorrect

---

### Task 2 – Audio → Meaning (Recognition)

* Audio is played
* Multiple sentence or keyword options shown
* User selects the matching one
* No writing required

---

### Task 3 – Audio → Production

* Audio is played
* User:

  * types the sentence, or
  * speaks the sentence
* Result is compared tolerantly
* Minor errors allowed

---

### Task 4 – Error Detection

* A nearly-correct sentence is shown or spoken
* User decides:

  * correct / incorrect
* No explanation required
* Trains grammatical intuition

---

### Task 5 – Word ↔ Audio Matching

* Words that appear in only one card are auto-extracted
* Audio is played
* User matches word to audio or vice versa
* Reinforces auditory recall

---

## 9. Scoring and Evaluation

* Token-based comparison
* Normalization rules:

  * ignore casing
  * normalize punctuation
  * optional character normalization
* Use LCS (Longest Common Subsequence) on tokens
* Score = matched tokens / total tokens

---

## 10. Session Design (v1 Recommendation)

A single learning session lasts **5–7 minutes** and mixes tasks:

1. Sentence reconstruction
2. Audio recognition
3. Production attempt
4. Error detection

Interleaving is intentional to strengthen memory.

---

## 11. Progress Tracking

* Stored in **IndexedDB**
* Per:

  * card
  * lesson
  * deck
* Visualized as progress bars
* No streaks or gamification required

Optional:

* User self-assessment prompt:

  > “Did this feel confident?”

---

## 12. Non-Goals (v1)

* No global user accounts
* No cloud sync
* No heavy gamification
* No grammar explanations
* No spaced-repetition algorithm (yet)

---

## 13. Extensibility

Hermes is designed so that:

* New task types reuse existing data
* Server-side features remain optional
* Static deployment is still possible
* Advanced SRS can be added later

---

## 14. Summary

Hermes is a **sentence-first, audio-centric, local-first** language learning system.

It transforms existing Anki decks into a structured, modern learning experience without sacrificing user control, data ownership, or extensibility.

The system prioritizes:

* cognition over gamification
* reconstruction over recognition
* simplicity over abstraction
