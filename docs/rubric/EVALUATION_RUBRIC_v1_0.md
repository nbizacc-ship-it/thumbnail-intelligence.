# AI THUMBNAIL INTELLIGENCE SYSTEM
## Independent Evaluation Rubric — Version 1.0
### Initial operational framework

A separate evaluation artefact for the Thumbnail Intelligence System. This rubric is provisional and requires calibration against human judgments and real audience experiments.

**Status**: Initial operational rubric; provisional and requiring calibration against human judgments and real audience experiments.

---

### 1. Purpose and boundaries
This rubric evaluates a generated thumbnail against its intended video, approved creative brief, supplied references, and observable rendering quality. It does not predict CTR, views, or watch time with scientific certainty. A high score means the candidate appears to satisfy the defined design and integrity requirements; it does not prove that viewers will choose it.

The evaluator must inspect the actual rendered image—not only the prompt or the generator's description. It must distinguish observable defects from uncertain interpretations and request human review when important evidence is unavailable.

The rubric is a separate backend artefact. The Director must not receive the complete rubric, its weights, or its acceptance thresholds. The evaluator receives the rubric and returns a score, gate status, evidence-based findings, and targeted corrections. Only a short defect summary may be passed to the Director for revision.

### 2. Evaluation sequence
1. Confirm the expected video promise, audience, approved creative brief, exact required text, brand/reference requirements, and output dimensions.
2. Inspect the actual image at full size and at a reduced thumbnail size.
3. Apply the hard gates in Section 3 before calculating the weighted score.
4. Score each quality dimension from 0 to 5 using the anchors in Section 4 and the dimension-specific guidance in Section 5.
5. Calculate the weighted score and assign the provisional decision band.
6. Return severity-labelled defects, evidence, confidence, and specific corrective actions.
7. If revision is allowed, evaluate the revised image from scratch against the same rubric version. Do not automatically increase scores merely because an attempt is newer.

### 3. Hard gates (override the aggregate score)
Use one status per gate: **PASS**, **FAIL**, or **UNCERTAIN**. A FAIL prevents ordinary acceptance regardless of numeric score. UNCERTAIN on a material issue routes the candidate to **HUMAN_REVIEW**.

| Gate | Fail when |
|---|---|
| **G1 — Truth and promise** | The image materially implies an event, result, claim, or subject that conflicts with the supplied video information, or creates a deceptive promise. |
| **G2 — Subject and relevance** | The main subject is materially wrong, unrelated, or impossible to reconcile with the actual video. |
| **G3 — Required text** | Exact user-required text is missing, materially misspelled, or altered in a way that changes its meaning. Ignore this gate when no exact text was required. |
| **G4 — Reference and brand integrity** | A required person, product, logo, or brand reference is materially misrepresented, or an explicitly required reference is omitted. If the selected model cannot preserve identity reliably, mark uncertainty or request human review rather than pretending fidelity. |
| **G5 — Technical validity** | The output is corrupt, undecodable, unusable, or materially outside the requested format/dimensions and cannot be corrected by deterministic post-processing. |
| **G6 — Originality** | The candidate directly reproduces a competitor's distinctive composition or signature design rather than using references to understand broader patterns. |
| **G7 — Material safety/compliance** | The image contains a serious safety, privacy, rights, or platform-compliance issue that makes it unsuitable to deliver. |

#### Gate outcomes:
- **PASS**: all applicable gates pass.
- **REVISE**: a correctable gate fails and a bounded revision is appropriate.
- **REJECT**: the concept or source material is fundamentally unsuitable, or a serious issue cannot responsibly be corrected by automatic revision.
- **HUMAN_REVIEW**: a material gate cannot be resolved reliably from the available evidence.

The system must record which gate failed and why. A high weighted score never cancels a hard-gate failure.

### 4. Common 0–5 scoring anchors

| Score | Anchor | General interpretation |
|---|---|---|
| **0** | Failed / absent | The dimension is absent, broken, or fundamentally contradicts the brief. |
| **1** | Severe deficiency | Major defect that prevents the dimension from serving its purpose. |
| **2** | Weak | Noticeable weakness; it partially works but materially limits the result. |
| **3** | Acceptable | Meets a usable baseline with identifiable but non-fatal shortcomings. |
| **4** | Strong | Clearly effective for the specific brief, with only minor defects. |
| **5** | Excellent | Exceptionally well executed for this particular brief; no meaningful defect is evident in this dimension. |

Do not award a 5 simply because the image looks polished or aesthetically pleasing. Score against the dimension's purpose and the actual brief. When evidence is insufficient, state that limitation rather than inventing certainty.

### 5. Weighted dimensions
The total is 100 points. For each dimension, compute: **weight × (score ÷ 5)**.

| Dimension | Weight | What to inspect |
|---|---:|---|
| **D1 — Truthfulness and video-promise alignment** | 18 | Does the image accurately represent the actual video's subject, stakes, result, and promise without fabricating a claim? |
| **D2 — Immediate comprehension and focal hierarchy** | 15 | Can a viewer quickly identify the main subject and visual idea? Is attention directed intentionally rather than scattered? |
| **D3 — Audience and niche fit** | 13 | Does the concept fit the target audience's knowledge, expectations, tone, and viewing context? Is the creative choice appropriate for this niche rather than a generic formula? |
| **D4 — Small-size legibility and text correctness** | 12 | Does the image remain understandable at typical small display size? Is any required text readable, correctly spelled, and not needlessly dense? If no text is needed, assess whether its absence supports clarity. |
| **D5 — Distinctiveness and competitive differentiation** | 10 | Does the candidate have a recognizable central idea that is not a generic clone of competing thumbnails? |
| **D6 — Composition and visual clarity** | 10 | Are framing, spacing, contrast, foreground/background separation, and visual balance serving the concept? |
| **D7 — Relevant curiosity and emotional appeal** | 8 | Does the image create a relevant reason to watch without misleading viewers? Are emotional cues appropriate rather than gratuitous? |
| **D8 — Brand and reference fidelity** | 6 | Are supplied branding, required products/people, palette, and reference constraints followed? Score only requirements that actually apply. |
| **D9 — Technical rendering quality** | 5 | Are anatomy, object geometry, edges, lighting, texture, resolution, artifacts, and compositing sufficiently clean for the intended style? Stylization itself is not a defect. |
| **D10 — Adherence to the approved creative brief** | 3 | Does the rendered image materially implement the approved concept, subject, composition, and constraints? Do not penalize deliberate, justified deviations that improve fidelity to the brief's intent. |
| **Total** | **100** | |

### 6. Dimension-specific interpretation rules
- **Truthfulness**: Compare against the video title, description/script summary, and confirmed facts. Dramatic presentation is acceptable; inventing a result, prize, event, product, or outcome is not. If the input itself is contradictory, route the question to the user.
- **Comprehension**: Inspect the thumbnail at full size and reduced size. Identify the first-read focal point and the main idea. Multiple subjects, text, or layers are not automatically bad; score whether their relationship is understandable.
- **Audience fit**: Evaluate against the supplied niche and target audience. Do not assume that all audiences prefer faces, exaggerated expressions, bright colors, minimal text, realism, or cinematic styling.
- **Legibility**: Required exact text must be correct. Evaluate its size, contrast, placement, and readability. If the image concept benefits from no text, do not penalize it for lacking text that the user did not require.
- **Distinctiveness**: Compare against the retrieved references. Reusing broad genre conventions is acceptable; reproducing a competitor's distinctive visual arrangement is not. Do not reward novelty that damages truthfulness or comprehension.
- **Composition**: Consider the intended display size and crop. Check whether the main subject competes with background clutter, whether the edges crop important details, and whether contrast directs attention appropriately.
- **Curiosity and emotion**: Judge whether the visual tension or question is relevant to the actual content. Do not claim that a specific color, expression, or visual cue universally triggers a particular psychological response.
- **Brand/reference fidelity**: Separate reference analysis from identity preservation. If the image model cannot faithfully reproduce a supplied face or product, use a supported image-editing path or route for manual compositing; do not falsely mark fidelity as verified.
- **Technical quality**: Judge defects relative to the chosen style. Grain, surrealism, distortion, or painterly treatment may be intentional. Only count them as defects when they undermine the brief or appear accidental.
- **Brief adherence**: The approved brief is the baseline. The evaluator should not penalize the image for failing to follow an unrequested personal preference or a generic design rule.

### 7. Severity and correction format
Each finding must include:
- **Severity**: Critical, Major, Moderate, or Minor.
- **Location**: where the issue appears in the image, when possible.
- **Observation**: a concise description of what is visibly wrong.
- **Evidence/baseline**: the requirement or brief detail it violates.
- **Impact**: why it impairs truthfulness, comprehension, audience fit, or execution.
- **Correction**: one concrete, testable action.

#### Severity guidance:
- **Critical**: a hard-gate failure or a defect that makes the image materially deceptive, unsafe, or unusable.
- **Major**: a defect that substantially weakens comprehension, relevance, required text, or reference fidelity.
- **Moderate**: a meaningful but non-fatal problem with composition, clarity, distinctiveness, or technical execution.
- **Minor**: a small polish issue that does not materially impair the image's purpose.

Avoid vague feedback such as "make it pop," "more engaging," or "improve quality." Prefer actions such as "remove the unrelated object in the upper-right background," "increase separation between the subject and the background," or "replace the incorrect label with the exact supplied wording."

### 8. Provisional score bands and decisions

| Weighted score | Initial decision |
|---|---|
| **85–100** | Eligible for human review if all applicable hard gates pass and no unresolved critical/major issue remains. |
| **70–84** | Targeted revision recommended. |
| **50–69** | Substantial revision or a different concept recommended. |
| **0–49** | Reject the candidate and reconsider the concept. |

These thresholds are provisional engineering choices, not empirically validated predictors of audience behavior. Gate status takes precedence. An evaluator may return HUMAN_REVIEW when the score alone would conceal an important ambiguity.

### 9. Revision policy
Default maximum: two automatic revision attempts after the initial generation.

For each attempt:
1. Select the highest-severity correctable defects.
2. Create a concise correction brief that addresses those defects without rewriting unrelated parts.
3. Preserve requirements that already passed.
4. Regenerate or edit using capabilities actually supported by the selected image model.
5. Reinspect the resulting image and rescore from scratch.
6. Compare the new result with the prior candidate; do not assume improvement.
7. Stop when eligible for human review, when a hard gate requires rejection, or when the retry limit is reached.

Do not send the complete rubric, exact weights, or thresholds to the Director. Give it only the defect-specific correction brief. Do not repeat the same failed instruction without a meaningful change.

### 10. Required evaluator output
Return structured data conforming to the application's schema:
- `rubric_version`
- `gate_status`
- `gates`: each applicable gate, status, and reason
- `dimension_scores`: dimension identifier, 0–5 score, weight, and concise justification
- `weighted_score`
- `decision`
- `confidence`: High, Medium, or Low, with a short explanation
- `findings`: severity, observation, baseline/evidence, impact, and correction
- `revision_brief`: short actionable instructions, excluding hidden rubric details
- `human_review_required`
- `limitations`: evidence or capabilities that could not be verified

The evaluator must inspect the actual final rendered image. If the image cannot be accessed or decoded, it must return an evaluation failure rather than scoring from the prompt alone.

### 11. Calibration and governance
The rubric is not validated merely because its scores look consistent. Maintain a set of human-reviewed examples spanning niches, visual styles, image quality levels, and failure types.

Record:
- The image and its brief.
- Rubric version.
- Evaluator output.
- Human review and disagreement reasons.
- Whether the human reviewer agrees with gate outcomes and defect severity.
- Any later audience-test results that can legitimately be linked to the candidate.

Review systematic disagreements. Change the rubric only deliberately, increment its version, document the reason, and retest against the stable example set. Do not automatically alter weights from one result or treat YouTube performance as proof that one isolated design choice caused success.

Where possible, compare alternatives using YouTube's native thumbnail experiments and the metrics actually reported by the platform. Public competitor views are not CTR. A rubric score measures compliance and design judgments; real audience response requires real testing.

### 12. Non-negotiable safeguards
- Never claim guaranteed CTR, views, or watch-time improvement.
- Never treat psychological hypotheses as universal laws.
- Never reward misleading content because it appears attention-grabbing.
- Never let a high aggregate score override a hard gate.
- Never fabricate evidence, reference statistics, or model capabilities.
- Never expose the full rubric or exact thresholds to the Director or public frontend.
- Never call a candidate "proven" based only on an AI score.
- Report uncertainty and request human review when a material claim cannot be verified.

**Version 1.0 status**: A structured starting point for implementation and calibration. The dimensions, weights, and thresholds require empirical validation and must be revised when human-reviewed evidence reveals systematic errors.
