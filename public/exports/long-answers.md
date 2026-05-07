# Modular Revision Long-Answer Sheet

4 answer templates grouped by module.

## M01 · Module 01 — Learning Science Foundations

### Explain how learning-science principles shape the revision system design.

**Keywords:** spaced repetition · active recall · cognitive load · metacognition · mistake book

1. Start from the problem of passive revision.
2. Explain spaced repetition as scheduled review.
3. Explain active recall as try-first practice.
4. Explain cognitive load reduction through modular cards.
5. Connect mistake records to metacognitive review.

**Full answer:** The system is designed to move students from passive reading to active, scheduled review. Spaced repetition motivates a due review queue, active recall motivates quizzes and long-answer prompts, cognitive load reduction motivates modular cards and focused pages, and metacognitive review motivates mistake tracking and weak-area reflection.

**Common mistakes:** Only listing features without linking them to learning principles. | Treating spaced repetition as a simple reminder rather than a review strategy.


## M02 · Module 02 — Cognitive Diagnosis and Learning Records

### Describe how user learning records can support cognitive diagnosis.

**Keywords:** knowledge component · mastery estimate · mistake pattern · confidence · learning log

1. Define knowledge components.
2. Map quiz items and mistakes to concepts.
3. Use repeated attempts as evidence.
4. Add confidence calibration as a future signal.
5. Use the result to recommend review priorities.

**Full answer:** Learning records become useful when raw attempts are connected to knowledge components. Correctness, repeated errors, review ratings, and confidence can be combined into tentative mastery estimates. These estimates should not be treated as fixed labels, but as evidence for ranking weak areas and choosing what to review next.

**Common mistakes:** Equating one quiz score with mastery. | Ignoring which concept a wrong answer belongs to.


## M03 · Module 03 — AI-Ready Content Ingestion

### Outline a future AI/RAG extension for the revision hub.

**Keywords:** upload · chunking · retrieval · generation · grounding · human review

1. Start with user-provided materials.
2. Parse and chunk materials into retrievable units.
3. Use retrieval to ground generated outputs.
4. Generate concepts, quizzes, traps, and summaries as structured objects.
5. Apply guardrails before adding items to a course pack.

**Full answer:** A future AI extension can allow users to upload course notes or slides, extract structured chunks, retrieve relevant context, and generate review objects such as concept cards and quizzes. The safest design is RAG-based rather than claiming to train a new model. Generated content should include source grounding, editable structured output, and optional human review.

**Common mistakes:** Saying the system trains an LLM without explaining data, cost, or privacy. | Generating quiz text without linking it to source material.


## M04 · Module 04 — Prototype System and Evaluation

### How can the prototype be evaluated as a functional and research-ready system?

**Keywords:** MVP · modular schema · learning log · dashboard · deployment · future backend

1. Describe the current MVP scope.
2. Explain the modular course schema.
3. Explain the local learning log and review queue.
4. Discuss deployment as shareable demo evidence.
5. Describe future evaluation with real user logs.

**Full answer:** The rough prototype can be evaluated by whether it loads course packs, displays modular review units, records quiz/review interactions locally, and produces meaningful review pages. It is research-ready in the sense that the data model can later support learning analytics, knowledge tracing, and adaptive recommendation, while the current version remains a synthetic-data demonstration.

**Common mistakes:** Overclaiming production readiness. | Ignoring the difference between local MVP storage and backend data infrastructure.
