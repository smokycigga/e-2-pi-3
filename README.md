# BodhAi

An AI-powered web application that generates JEE-style mock tests from PDF study material. Built with Flask, MongoDB, and modern frontend technologies, the platform lets users upload academic PDFs, extract meaningful questions, and attempt timed, auto-evaluated tests.

---


##  Features

- Extracts text and images from academic PDFs using **PyMuPDF**
- Captions diagrams using nearby text to provide **semantic context**
- Generates original MCQs from image-caption pairs using **Groq's LLaMA-3**
- Measures similarity with real JEE questions using **Sentence-BERT**
- Stores vector embeddings in **FAISS** for fast semantic search and evaluation
- Allows test generation, custom curation, and automatic evaluation
- Test history and results are stored in **MongoDB**
- Modern frontend with project dashboard, test view, and retry feature

---

## Tech Stack

| Frontend      | Backend         | AI/ML & NLP              | Storage          |
| ------------- | --------------- | ------------------------ | ---------------- |
| React + Tailwind CSS | Flask (Python) | Groq API (LLaMA-3) <br> PyMuPDF (image + caption extraction) <br> Sentence-BERT (cosine similarity) <br> FAISS (semantic vector store) | MongoDB |

---

