import React, { useState } from 'react';
import { DirectorOutput, ThumbnailConcept } from '../types';

interface DirectorViewProps {
  directorData: DirectorOutput;
  onApproveAndGenerate: (selectedConceptId: string) => void;
  loading: boolean;
  onBack: () => void;
}

export const DirectorView: React.FC<DirectorViewProps> = ({
  directorData,
  onApproveAndGenerate,
  loading,
  onBack,
}) => {
  const [selectedConceptId, setSelectedConceptId] = useState<string>(
    directorData.selectedConceptId || directorData.concepts[0]?.id || ''
  );
  const [showFullBrief, setShowFullBrief] = useState<boolean>(true);

  const selectedConcept =
    directorData.concepts.find((c) => c.id === selectedConceptId) || directorData.concepts[0];

  return (
    <div className="card director-view">
      <div className="card-header">
        <div>
          <div className="stage-indicator">Step 3: Strategic Creative Direction</div>
          <h2>AI Director Concept Selection & Creative Brief</h2>
          <p className="card-desc">
            Governed by Constitution v1.1. The Director optimizes for the specific creative problem,
            formulating 3 distinct visual arguments rather than cosmetic variations.
          </p>
        </div>
        <div className="version-pill">
          {directorData.versionIdentifiers?.constitution || 'Constitution v1.1'}
        </div>
      </div>

      {/* Promise & Audience Context */}
      <div className="director-promise-box">
        <div className="promise-item">
          <span className="promise-label">Core Video Promise:</span>
          <span className="promise-text">"{directorData.promiseStatement}"</span>
        </div>
        <div className="promise-item">
          <span className="promise-label">Audience Mental Model:</span>
          <span className="promise-text">{directorData.audienceModel}</span>
        </div>
      </div>

      {/* 3 Materially Different Concepts */}
      <section className="section-block">
        <div className="section-header-flex">
          <h3 className="section-title">3 Distinct Concept Directions</h3>
          <span className="subtle-note">Select a concept to inspect or override recommendation</span>
        </div>

        <div className="concepts-grid">
          {directorData.concepts.map((concept: ThumbnailConcept) => {
            const isSelected = concept.id === selectedConceptId;
            const isDirectorChoice = concept.id === directorData.selectedConceptId;

            return (
              <div
                key={concept.id}
                className={`concept-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedConceptId(concept.id)}
              >
                <div className="concept-card-header">
                  <div className="concept-title-box">
                    <span className="concept-num">{concept.id.toUpperCase()}</span>
                    <h4>{concept.conceptName}</h4>
                  </div>
                  {isDirectorChoice && (
                    <span className="recommended-badge">Director Pick</span>
                  )}
                </div>

                <div className="concept-body">
                  <div className="concept-field">
                    <span className="field-name">Visual Metaphor:</span>
                    <p>{concept.visualMetaphorOrEvent}</p>
                  </div>

                  <div className="concept-field">
                    <span className="field-name">First-Read Element (0.5s):</span>
                    <p>{concept.firstReadElement}</p>
                  </div>

                  <div className="concept-field">
                    <span className="field-name">Viewer Promise:</span>
                    <p>{concept.viewerPromise}</p>
                  </div>

                  <div className="concept-field">
                    <span className="field-name">Evidence Rationale:</span>
                    <p className="evidence-text">{concept.evidenceSupportingChoice}</p>
                  </div>

                  <div className="concept-field risks-box">
                    <span className="field-name">Key Risks & Uncertainty:</span>
                    <ul>
                      {concept.keyRisks.map((risk, idx) => (
                        <li key={idx}>{risk}</li>
                      ))}
                      {concept.uncertainty && <li>Uncertain: {concept.uncertainty}</li>}
                    </ul>
                  </div>
                </div>

                <div className="concept-footer">
                  <button
                    type="button"
                    className={`btn-select ${isSelected ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedConceptId(concept.id);
                    }}
                  >
                    {isSelected ? '✓ Approved for Generation' : 'Select This Concept'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Selection Rationale & Trade-offs */}
      <section className="section-block rationale-block">
        <h3 className="section-title">Director Selection Reasoning & Trade-offs</h3>
        <p className="rationale-text">
          <strong>Why this concept:</strong> {directorData.selectionRationale}
        </p>
        <p className="tradeoffs-text">
          <strong>Explicit Trade-offs:</strong> {directorData.tradeOffs}
        </p>
      </section>

      {/* The Approved Creative Brief (The handoff contract to the image generator) */}
      <section className="section-block">
        <div className="section-header-flex">
          <h3 className="section-title">Approved Creative Brief (The Handoff Contract)</h3>
          <button
            type="button"
            className="btn-toggle"
            onClick={() => setShowFullBrief(!showFullBrief)}
          >
            {showFullBrief ? 'Collapse Brief' : 'Expand Full Brief'}
          </button>
        </div>

        {showFullBrief && (
          <div className="brief-card">
            <div className="brief-grid">
              <div className="brief-item">
                <span className="brief-key">Primary Subject & Action</span>
                <span className="brief-val">
                  {directorData.creativeBrief.primarySubjectAndAction}
                </span>
              </div>
              <div className="brief-item">
                <span className="brief-key">Setting & Secondary Objects</span>
                <span className="brief-val">
                  {directorData.creativeBrief.secondaryObjectsAndSetting}
                </span>
              </div>
              <div className="brief-item">
                <span className="brief-key">Composition & Framing</span>
                <span className="brief-val">
                  {directorData.creativeBrief.compositionAndFraming}
                </span>
              </div>
              <div className="brief-item">
                <span className="brief-key">Reserved Negative Space / Safe Area</span>
                <span className="brief-val highlight">
                  {directorData.creativeBrief.negativeSpaceAndSafeTextArea}
                </span>
              </div>
              <div className="brief-item">
                <span className="brief-key">Lighting Instructions</span>
                <span className="brief-val">
                  {directorData.creativeBrief.lightingInstructions}
                </span>
              </div>
              <div className="brief-item">
                <span className="brief-key">Materials & Textures</span>
                <span className="brief-val">
                  {directorData.creativeBrief.materialAndTexture}
                </span>
              </div>
              <div className="brief-item">
                <span className="brief-key">Palette & Contrast</span>
                <span className="brief-val">
                  {directorData.creativeBrief.colorPalette?.join(', ') || 'High contrast palette'}
                </span>
              </div>
              <div className="brief-item">
                <span className="brief-key">Exact Text Overlay (Post-processed)</span>
                <span className="brief-val">
                  {directorData.creativeBrief.exactOnImageWording || 'None requested'}
                </span>
              </div>
            </div>

            <div className="truth-constraints-box">
              <span className="truth-title">Non-negotiable Truth Constraints:</span>
              <ul>
                {directorData.creativeBrief.truthConstraints?.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      <div className="view-actions">
        <button onClick={onBack} className="btn-secondary" disabled={loading}>
          ← Back to Research
        </button>

        <button
          onClick={() => onApproveAndGenerate(selectedConceptId)}
          className="btn-primary"
          disabled={loading}
        >
          {loading ? (
            <span className="btn-loading">
              <span className="spinner"></span> Compiling Prompt & Generating Candidate...
            </span>
          ) : (
            `Approve "${selectedConcept?.conceptName}" & Render Candidate →`
          )}
        </button>
      </div>
    </div>
  );
};
