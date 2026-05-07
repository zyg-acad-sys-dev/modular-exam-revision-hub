# Modular Exam Revision Hub

Live demo: [Modular Exam Revision Hub](https://modular-exam-revision-hub.vercel.app/)

**Modular Exam Revision Hub** is a self-initiated React/Vite prototype for modular online exam revision.

The idea is simple: revision materials are often scattered across notes, slides, screenshots, formulas, reminders, and previous mistakes. This prototype reorganises that kind of material into smaller interactive review units, including concept cards, quiz cards, common-trap cards, formula practice, figure-recognition prompts, long-answer practice, a mistake book, spaced review, a priority dashboard, search, and printable review sheets.

The public version uses **synthetic sample data only**. The first private version was built around my own revision materials for personal study use, but the public demo replaces those materials with synthetic content to avoid sharing private academic content or instructor-provided materials.

## Why I built this

I built this prototype to explore how exam revision can be made more structured and interactive. In many exam situations, the problem is not only whether students have enough materials, but whether those materials can be reviewed efficiently. Passive rereading can feel productive, but it does not always show which concepts are weak, which mistakes are repeated, or which topics should be reviewed first.

This project is a working prototype demonstrating one possible structure: a modular course pack, interactive review components, local progress records, and a frontend that can later be extended with AI-assisted content ingestion.

## Main design idea

The system is organised around a course pack. A course pack can contain several learning units, and each unit can include concepts, quizzes, traps, formulas, figures, long-answer prompts, and printable review content.

The current version is frontend-based, but the data structure is intentionally modular. In future versions, another course could be added by preparing another structured content pack, or by using an LLM/RAG workflow to help convert user-provided materials into structured review objects.

## Learning-science ideas behind the prototype

The prototype is loosely informed by several common learning-science ideas:

- **Spaced repetition**: items can be brought back for review instead of being read only once.
- **Active recall**: quiz-first and prompt-first practice is used instead of only passive reading.
- **Cognitive-load reduction**: content is split into smaller cards and focused review pages.
- **Metacognitive review**: the mistake book and priority dashboard help users notice weak areas.
- **Cognitive diagnosis**: a future version could use learning records to estimate which knowledge components need more review.

## Current MVP features

- Modular course/unit structure
- Concept cards and memory-unit cards
- Active-recall quiz cards
- Common-trap cards
- Formula practice with KaTeX rendering
- Figure-recognition cards
- Long-answer practice templates
- Mistake book and spaced-review queue using local browser storage
- Priority dashboard
- Search page
- Printable/exportable review sheets
- In-app project brief page at `/brief`

## Possible AI extension

The current demo does **not** train a large language model and does **not** contain real course materials.

A realistic next step would be an LLM/RAG-based content ingestion workflow:

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

This direction focuses on retrieval-grounded generation and structured learning support, rather than training a new large language model from scratch.

## Tech stack

- React + Vite
- React Router
- KaTeX / react-katex
- Modular JavaScript content packs
- LocalStorage-based prototype learning log
- Static deployment ready: GitHub Pages / Vercel / similar hosting

## Install and run

```bash
npm install
npm run validate:content
npm run dev
```

## Build

```bash
npm run build
```

## Useful scripts

```bash
npm run validate:content
npm run export:print
npm run build
```

## Deployment notes

For Vercel or a similar static hosting platform:

- Framework: Vite
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

## Additional documents

- `PROJECT_BRIEF.md`: project rationale, current scope, and possible AI/ML extension.
- `APPLICATION_SNIPPETS.md`: short wording that can be adapted for CV or email use.
