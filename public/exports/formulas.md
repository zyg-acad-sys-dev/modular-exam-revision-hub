# Modular Revision Formula Sheet

4 formulas grouped by module.

## M01 · Module 01 — Learning Science Foundations

### Simplified Forgetting Curve

`R(t)=e^{-t/S}`

**Variables:**
- R(t): estimated retention after time t
- S: memory strength or stability parameter

**Example:** If the memory strength S increases after successful recall, the next review can be scheduled later.

**Exam note:** Use it as a conceptual anchor for spaced review, not as a precise user model in this rough demo.


## M02 · Module 02 — Cognitive Diagnosis and Learning Records

### Toy Mastery Update

`p_{next}=p+\alpha(r-p)`

**Variables:**
- p: current mastery estimate
- r: new response signal, such as 0 or 1
- \alpha: update rate

**Example:** A correct answer can move p upward, while a wrong answer can move it downward.

**Exam note:** This is a simplified placeholder for explaining adaptive review logic.


## M03 · Module 03 — AI-Ready Content Ingestion

### Retrieval Similarity

`\cos(\theta)=\frac{a\cdot b}{\lVert a\rVert\lVert b\rVert}`

**Variables:**
- a,b: embedding vectors for query and document chunk
- \cos(\theta): similarity score

**Example:** A RAG system may retrieve chunks whose embeddings are close to the question embedding.

**Exam note:** Useful as a simple technical explanation for retrieval-based course-content ingestion.


## M04 · Module 04 — Prototype System and Evaluation

### Prototype Review Priority Score

`score=w_1M+w_2D+w_3E+w_4C`

**Variables:**
- M: mistake frequency
- D: due-review signal
- E: exam or instructor priority
- C: confidence mismatch signal

**Example:** An item with repeated mistakes and an upcoming due date should appear higher on the dashboard.

**Exam note:** This formula is a transparent design placeholder before using learned recommendation models.
