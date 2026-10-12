import React, { useState, useEffect } from 'react';
import {
  GenerateOutput,
  EvaluationResult,
  DirectorOutput,
  ResearchResult,
  CreativeBrief,
} from '../types';
import { renderCompositeThumbnail } from './CanvasRenderer';

interface FinalReviewProps {
  generation: GenerateOutput;
  evaluation: EvaluationResult;
  directorData: DirectorOutput;
  researchData?: ResearchResult;
  brief: CreativeBrief;
  attemptCount: number;
  onReset: () => void;
}

export const FinalReviewView: React.FC<FinalReviewProps> = ({
  generation,
  evaluation,
  directorData,
  researchData,
  brief,
  attemptCount,
  onReset,
}) => {
  const [compositePng, setCompositePng] = useState<string>('');
  const [renderingComposite, setRenderingComposite] = useState<boolean>(true);

  const rawImageSrc = generation.imageBase64.startsWith('data:')
    ? generation.imageBase64
    : `data:${generation.imageMimeType || 'image/png'};base64,${generation.imageBase64}`;

  useEffect(() => {
    let isMounted = true;
    renderCompositeThumbnail(rawImageSrc, brief.exactOnImageWording, brief.textPlacement)
      .then((pngDataUrl) => {
        if (isMounted) {
          setCompositePng(pngDataUrl);
          setRenderingComposite(false);
        }
      })
      .catch((err) => {
        console.error('Failed to render composite thumbnail:', err);
        if (isMounted) {
          setCompositePng(rawImageSrc);
          setRenderingComposite(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [rawImageSrc, brief.exactOnImageWording, brief.textPlacement]);

  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.download = `thumbnail-${brief.conceptId || 'candidate'}-1280x720.png`;
    link.href = compositePng || rawImageSrc;
    link.click();
  };

  const handleDownloadReportJson = () => {
    const report = {
      system: 'AI Thumbnail Intelligence System',
      exportDate: new Date().toISOString(),
      status: 'Ready for Human Review',
      attemptsUsed: attemptCount,
      videoPromise: directorData.promiseStatement,
      selectedConcept: directorData.concepts.find((c) => c.id === directorData.selectedConceptId),
      creativeBrief: directorData.creativeBrief,
      evaluation: {
        rubricVersion: evaluation.rubricVersion,
        weightedScore: evaluation.weightedScore,
        decision: evaluation.decision,
        gateStatus: evaluation.gateStatus,
        gates: evaluation.gates,
        dimensionScores: evaluation.dimensionScores,
        findings: evaluation.findings,
        limitations: evaluation.limitations,
      },
      researchSummary: researchData
        ? {
            mode: researchData.mode,
            competitorsSampleCount: researchData.competitors.length,
            patternsIdentified: researchData.patterns.map((p) => p.name),
            observedFacts: researchData.observedFacts,
          }
        : null,
      disclaimer:
        'A passing result means "ready for human review" and brief compliance. Actual real-world CTR requires live audience testing (e.g., YouTube Test & Compare).',
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `thumbnail-intelligence-report.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card final-review-view">
      <div className="card-header">
        <div>
          <div className="stage-indicator">Step 6: Human Review & Final Export</div>
          <h2>Thumbnail Package Ready for Human Review</h2>
          <p className="card-desc">
            The full evidence-based cycle is complete. Review the final candidate, download the 1280 × 720
            export, and inspect the governance report.
          </p>
        </div>
        <div className="completion-badge">
          Status: {evaluation.decision === 'ELIGIBLE' ? 'Eligible for Review' : 'Borderline / Review'}
        </div>
      </div>

      <div className="final-grid">
        {/* Left Column: Visual Export */}
        <div className="final-visual-column">
          <div className="final-thumbnail-box 16-9-ratio">
            {renderingComposite ? (
              <div className="loading-composite">
                <span className="spinner"></span> Compositing 1280 × 720 Canvas...
              </div>
            ) : (
              <img
                src={compositePng || rawImageSrc}
                alt="Final Composite Thumbnail"
                className="final-thumbnail-img"
              />
            )}
          </div>

          <div className="export-actions">
            <button
              onClick={handleDownloadImage}
              className="btn-primary btn-large"
              disabled={renderingComposite}
            >
              📥 Download 1280 × 720 PNG
            </button>

            <button
              onClick={handleDownloadReportJson}
              className="btn-secondary"
              disabled={renderingComposite}
            >
              📄 Export Full Strategy & Audit Report (.json)
            </button>
          </div>

          <div className="export-specs">
            <span>Dimensions: 1280 × 720 (16:9)</span>
            <span>Format: PNG</span>
            <span>Revision Attempts: {attemptCount}</span>
          </div>
        </div>

        {/* Right Column: Strategic & Audit Summary */}
        <div className="final-details-column">
          <div className="detail-box">
            <h3>Selected Concept: {brief.conceptName}</h3>
            <p className="concept-pitch">
              <strong>Core Idea:</strong> {brief.mainVisualIdea}
            </p>
            <p className="promise-pitch">
              <strong>Promise:</strong> "{directorData.promiseStatement}"
            </p>
          </div>

          <div className="detail-box">
            <h3>Evaluation Audit Summary</h3>
            <div className="audit-metrics">
              <div className="audit-metric">
                <span className="m-label">Aggregate Rubric Score:</span>
                <span className="m-val">{evaluation.weightedScore} / 100</span>
              </div>
              <div className="audit-metric">
                <span className="m-label">Hard Gates:</span>
                <span className="m-val green">
                  {evaluation.gateStatus === 'PASS' ? 'Passed' : evaluation.gateStatus}
                </span>
              </div>
              <div className="audit-metric">
                <span className="m-label">Confidence:</span>
                <span className="m-val">{evaluation.confidence}</span>
              </div>
            </div>
            <p className="eval-note">{evaluation.qualitativeSummary}</p>
          </div>

          <div className="detail-box remaining-defects-box">
            <h3>Remaining Defects & Limitations</h3>
            {(!evaluation.findings || evaluation.findings.length === 0) ? (
              <p className="no-defects">No open defects identified.</p>
            ) : (
              <ul>
                {evaluation.findings.map((f, i) => (
                  <li key={i}>
                    <strong>[{f.severity}]</strong> {f.observation} ({f.correction})
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Transparent Integrity Disclaimer */}
          <div className="integrity-disclaimer-box">
            <h4>Mandatory System Safeguard & Disclaimer</h4>
            <p>
              This system does not claim an AI score guarantees high CTR or viral audience response. A
              passing evaluation confirms design compliance, visual hierarchy, small-size legibility, and
              alignment with the video's truthful promise. Always validate real-world audience performance
              using YouTube's native Test & Compare thumbnail feature.
            </p>
          </div>

          <div className="final-actions">
            <button onClick={onReset} className="btn-secondary">
              Start Another Thumbnail Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
