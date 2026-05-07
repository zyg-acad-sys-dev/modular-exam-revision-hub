# Modular Exam Revision Hub — Project Brief

## 1. Overview

**Modular Exam Revision Hub** is a self-initiated web prototype for online exam revision. It explores how course materials can be reorganised into smaller interactive components, such as concept cards, quiz cards, common traps, formula practice, figure-recognition prompts, long-answer practice, mistake tracking, spaced review, and printable review sheets.

The public demo uses **synthetic sample data only**. The first private version was created for my own revision use, but the public version replaces the original materials with synthetic content to avoid sharing private academic content, real lecture notes, slides, exam questions, or instructor-provided materials.

## 2. Motivation

A common problem in exam revision is not only the lack of materials, but the lack of structure. Students may have lecture slides, personal notes, screenshots, formulas, and previous mistakes, but these materials are usually scattered. Near the exam, passive reading can also become inefficient because it is hard to know which topics are already understood and which ones still need recall practice.

This prototype tries to provide a more structured review environment. Instead of treating revision as a long document, it breaks the content into reviewable units and connects them with quizzes, traps, mistake records, and spaced review.

## 3. Learning-science framing

The design is based on several general ideas from learning science and cognitive psychology:

- **Spaced repetition**: important items should return for review before they are forgotten too much.
- **Active recall**: students should try to retrieve answers, not only reread notes.
- **Cognitive-load reduction**: smaller cards and focused pages can make review less overwhelming.
- **Metacognitive review**: mistake tracking can help users notice repeated weak points.

These ideas also connect naturally with later machine-learning extensions. If the system records quiz attempts, confidence signals, review frequency, and mistake patterns, it can later support knowledge tracing or cognitive diagnosis.

## 4. Current prototype scope

The current rough MVP demonstrates the frontend and content structure. It includes:

- React/Vite single-page application structure;
- modular course-pack data model;
- concept cards and memory units;
- active-recall quizzes;
- common-trap cards;
- formula practice with KaTeX rendering;
- figure-recognition prompts;
- long-answer practice templates;
- local mistake book and spaced-review queue;
- priority dashboard;
- printable review exports.

At this stage, the project focuses on the interface, the data structure, and the review workflow. It is not yet a full backend system and does not yet include real AI ingestion, but the frontend structure is already prepared for these later extensions.

## 5. Possible AI/ML extension

The next step is to extend this prototype with an LLM/RAG-based ingestion workflow rather than training a new large language model from scratch:

```text
User-provided course materials
        ↓
Content parsing and chunking
        ↓
Retrieval-grounded explanation / quiz generation
        ↓
Structured concept, quiz, trap, formula, and figure objects
        ↓
Personalized review queue and weak-area diagnosis
```

Possible next modules include:

1. **Course Material Upload** — allow users to upload notes, slides, or text summaries.
2. **Knowledge Extraction** — convert materials into concepts, formulas, traps, figures, and long-answer prompts.
3. **Interactive AI Tutor** — answer questions with retrieval support from the uploaded materials.
4. **Weak-area Diagnosis** — use quiz attempts, confidence signals, and mistake patterns to prioritise review.
5. **Backend Persistence** — store learning records across devices and courses.

## 6. Why this direction is useful

The useful part of this prototype is that the learning content is separated from the interface. In future versions, the synthetic content pack could be replaced by user-provided course packs or AI-generated structured content, while the same review workflow remains usable.

It also gives a small but practical base for exploring how learning-science ideas, machine learning, and frontend prototyping can work together in a student-facing revision tool.
