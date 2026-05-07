# Modular Revision Printable Cheat Sheet

Generated from 1 modular content packs.

## System Evolution

Learning science → Cognitive diagnosis → AI ingestion → Prototype engineering → Personalized review → Research extension

## Last 30-Minute Lines

1. Position the project as a synthetic-data, AI-ready prototype, not as a real course-material release.
2. Learning-science principles: spaced repetition, active recall, cognitive load reduction, and metacognitive review.
3. Cognitive diagnosis: map quiz attempts and mistakes to knowledge components before recommending review.
4. AI extension: prefer RAG-based content ingestion and grounding over claiming to train a new LLM.
5. Prototype strength: modular schema, local learning log, interactive cards, printable exports, and deployable frontend.

## Core Concepts

### Spaced Repetition
A review strategy that schedules repeated practice after increasing intervals.

### Active Recall
A practice method where the learner retrieves an answer before seeing it.

### Knowledge Component
A small skill or concept that a learner is expected to master.

### Mastery Estimate
A tentative estimate of how well a learner understands a knowledge component.

### Course Content Ingestion
The process of turning user-provided materials into structured review items.

### RAG-Based Revision Assistant
An assistant that answers and generates study items using retrieved course-grounded context.

### Modular Course Schema
A reusable data structure for lectures/modules, concepts, quizzes, traps, formulas, figures, and answers.

### Priority Dashboard
A dashboard that ranks review items by priority, mistakes, and learning signals.

## Formula Anchors

### Simplified Forgetting Curve

`R(t)=e^{-t/S}`

Use it as a conceptual anchor for spaced review, not as a precise user model in this rough demo.

### Toy Mastery Update

`p_{next}=p+\alpha(r-p)`

This is a simplified placeholder for explaining adaptive review logic.

### Retrieval Similarity

`\cos(\theta)=\frac{a\cdot b}{\lVert a\rVert\lVert b\rVert}`

Useful as a simple technical explanation for retrieval-based course-content ingestion.

### Prototype Review Priority Score

`score=w_1M+w_2D+w_3E+w_4C`

This formula is a transparent design placeholder before using learned recommendation models.

## Common Traps

### Wrong: A revision system only needs to display notes clearly.
**Correct:** A strong revision system should create retrieval, feedback, and scheduled review actions.

**Why:** Clear notes help, but interactive recall produces more useful learning signals.

### Wrong: The latest quiz score is the same thing as mastery.
**Correct:** Mastery should be estimated from multiple signals such as repeated attempts, concept mapping, time gaps, and mistakes.

**Why:** A single answer can be lucky, stale, or affected by wording.

### Wrong: The next step is to train a large language model on every course.
**Correct:** A safer next step is LLM/RAG-based content ingestion using user-provided materials.

**Why:** Training or fine-tuning claims can sound unrealistic and raise privacy/copyright concerns.

### Wrong: Generated quizzes can be trusted as long as they sound fluent.
**Correct:** Generated quizzes should be grounded in source material and checked for ambiguity.

**Why:** Fluent output can still be wrong, unsupported, or misaligned with the course.

### Wrong: The demo should claim to be a complete adaptive AI tutor.
**Correct:** The demo should state that it is a rough, synthetic-data, AI-ready prototype.

**Why:** Clear product boundaries make the prototype easier to evaluate and improve.
