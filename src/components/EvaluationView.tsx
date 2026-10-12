import React from 'react';
import { EvaluationResult, CreativeBrief, EvaluationFinding } from '../types';

interface EvaluationViewProps {
  evaluation: EvaluationResult;
  brief: CreativeBrief;
  attemptNumber: number;
  maxAttempts: number;
  onTriggerRevision: () => void;
  onProceedToReview: () => void;
  revisionLoading: boolean;
  onBack: () => void;
}

export const EvaluationView: React.FC<EvaluationViewProps> = ({
  evaluation,
  brief,
  attemptNumber,
  maxAttempts,
  onTriggerRevision,
  onProceedToReview,
  revisionLoading,
  onBack,
}) => {
  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'ELIGIBLE':
        return <span className="decision-badge badge-eligible">ELIGIBLE FOR HUMAN REVIEW</span>;
      case 'REVISE':
        return <span className="decision-badge badge-revise">TARGETED REVISION RECOMMENDED</span>;
      case 'REJECT':
        return <span className="decision-badge badge-reject">REJECT (RETHINK CONCEPT)</span>;
      case 'HUMAN_REVIEW':
        return <span className="decision-badge badge-review">HUMAN REVIEW ESCALATION REQUIRED</span>;
      default:
        return <span className="decision-badge">{decision}</span>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <span className="severity-badge sev-critical">CRITICAL</span>;
      case 'Major':
        return <span className="severity-badge sev-major">MAJOR</span>;
      case 'Moderate':
        return <span className="severity-badge sev-moderate">MODERATE</span>;
      case 'Minor':
        return <span className="severity-badge sev-minor">MINOR</span>;
      default:
        return <span className="severity-badge">{severity}</span>;
    }
  };

  const canRevise = attemptNumber < maxAttempts && evaluation.decision !== 'REJECT';

  return (
    <div className="card evaluation-view">
      <div className="card-header">
        <div>
          <div className="stage-indicator">
            Step 5: Independent Evaluation & Rubric Scoring (Attempt #{attemptNumber})
          </div>
          <h2>Independent Quality & Truthfulness Audit</h2>
          <p className="card-desc">
            Evaluated by a separate Gemini multimodal inspection. Governed by Independent Evaluator
            Constitution v1.0 and Operational Rubric v1.0. Hard gates override numeric scores.
          </p>
        </div>
        <div className="rubric-version-tag">Rubric v{evaluation.rubricVersion}</div>
      </div>

      {/* Decision Summary Card */}
      <div className="decision-summary-card">
        <div className="decision-header-flex">
          <div>
            <span className="summary-label">Candidate Disposition:</span>
            <div className="decision-title-row">
              {getDecisionBadge(evaluation.decision)}
              <span className="gate-summary-tag">
                Hard Gates: {evaluation.gateStatus === 'PASS' ? '✓ ALL PASSED' : `⚠ ${evaluation.gateStatus}`}
              </span>
            </div>
          </div>

          <div className="score-circle-box">
            <div className="score-number">{evaluation.weightedScore}</div>
            <div className="score-denom">/ 100</div>
            <div className="score-label">Aggregate Score</div>
          </div>
        </div>

        <p className="qualitative-summary">{evaluation.qualitativeSummary}</p>

        {evaluation.initialVisualRead && (
          <div className="initial-read-box">
            <strong>Initial Visual Read:</strong> "{evaluation.initialVisualRead}"
          </div>
        )}
      </div>

      {/* Section 1: Hard Gates (Override Aggregate Score) */}
      <section className="section-block">
        <h3 className="section-title">Operational Hard Gates</h3>
        <p className="section-subtitle">
          Hard gates protect integrity, truthfulness, and safety. A single failure prevents ordinary acceptance.
        </p>

        <div className="gates-grid">
          {Object.entries(evaluation.gates || {}).map(([gateId, gate]) => (
            <div
              key={gateId}
              className={`gate-card ${
                gate.status === 'PASS' ? 'gate-pass' : gate.status === 'FAIL' ? 'gate-fail' : 'gate-uncertain'
              }`}
            >
              <div className="gate-header">
                <span className="gate-id">{gateId}</span>
                <span className={`gate-status-pill ${gate.status}`}>{gate.status}</span>
              </div>
              <p className="gate-reason">{gate.reason}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: 10 Quality Dimensions (Weights Hidden From User/Frontend) */}
      <section className="section-block">
        <h3 className="section-title">Evaluated Dimensions (0–5 Anchor Scale)</h3>
        <p className="section-subtitle">
          0 = Failed/Absent, 1 = Severe Deficiency, 2 = Weak, 3 = Acceptable, 4 = Strong, 5 = Excellent.
        </p>

        <div className="dimensions-grid">
          {evaluation.dimensionScores.map((dim) => (
            <div key={dim.id} className="dimension-row">
              <div className="dim-header">
                <span className="dim-id-name">
                  <strong>{dim.id}:</strong> {dim.name}
                </span>
                <div className="dim-score-pill">
                  <span className="dim-score-val">{dim.score}</span> / 5
                </div>
              </div>

              <div className="score-bar-bg">
                <div
                  className="score-bar-fill"
                  style={{ width: `${(dim.score / 5) * 100}%` }}
                ></div>
              </div>

              <p className="dim-rationale">{dim.rationale}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Diagnosed Defects & Actionable Corrections */}
      <section className="section-block">
        <h3 className="section-title">
          Diagnosed Defects & Targeted Corrections ({evaluation.findings?.length || 0})
        </h3>

        {(!evaluation.findings || evaluation.findings.length === 0) ? (
          <div className="empty-state success">
            No material defects diagnosed. Candidate meets design and truthfulness requirements.
          </div>
        ) : (
          <div className="findings-list">
            {evaluation.findings.map((f: EvaluationFinding, idx: number) => (
              <div key={idx} className="finding-card">
                <div className="finding-header">
                  {getSeverityBadge(f.severity)}
                  {f.location && <span className="location-tag">Location: {f.location}</span>}
                  <span className="baseline-tag">Baseline: {f.baseline}</span>
                </div>

                <div className="finding-body">
                  <div className="finding-obs">
                    <strong>Observation:</strong> {f.observation}
                  </div>
                  <div className="finding-impact">
                    <strong>Impact:</strong> {f.impact}
                  </div>
                  <div className="finding-corr">
                    <strong>Targeted Correction:</strong> {f.correction}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Revision Policy & Controller Actions */}
      <div className="revision-controller-box">
        <div className="rev-info">
          <h4>Revision Controller (Attempt {attemptNumber} of {maxAttempts} max)</h4>
          <p>
            {canRevise
              ? `You can automatically trigger a targeted revision pass. The Revision Controller will isolate diagnosed defects without rewriting passing elements.`
              : `Automatic revision limit reached or candidate rejected. Proceed with manual human review.`}
          </p>
        </div>

        <div className="rev-buttons">
          {canRevise && (
            <button
              onClick={onTriggerRevision}
              className="btn-warning"
              disabled={revisionLoading}
            >
              {revisionLoading ? (
                <span className="btn-loading">
                  <span className="spinner"></span> Applying Targeted Corrections & Re-rendering...
                </span>
              ) : (
                `Trigger Targeted Revision #${attemptNumber + 1} (Fix Defects) →`
              )}
            </button>
          )}

          <button onClick={onProceedToReview} className="btn-primary" disabled={revisionLoading}>
            {evaluation.decision === 'ELIGIBLE'
              ? 'Accept Candidate & Proceed to Final Review →'
              : 'Escalate to Human Review →'}
          </button>
        </div>
      </div>
    </div>
  );
};
