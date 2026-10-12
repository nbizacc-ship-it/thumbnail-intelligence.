import React from 'react';
import { ResearchResult } from '../types';

interface ResearchViewProps {
  research: ResearchResult;
  onProceedToDirector: () => void;
  loading: boolean;
  onBack: () => void;
}

export const ResearchView: React.FC<ResearchViewProps> = ({
  research,
  onProceedToDirector,
  loading,
  onBack,
}) => {
  return (
    <div className="card research-view">
      <div className="card-header">
        <div>
          <div className="stage-indicator">Step 2: Competitive Research & Pattern Analysis</div>
          <h2>Evidence Landscape: "{research.topic}"</h2>
          <p className="card-desc">
            The system examines observable category conventions to learn what viewers expect, which
            tactics are overused, and how this video can establish a differentiated, credible angle.
          </p>
        </div>

        <div className="mode-badge-box">
          <span
            className={`badge ${
              research.mode === 'youtube_api' ? 'badge-primary' : 'badge-warning'
            }`}
          >
            {research.mode === 'youtube_api'
              ? 'Official YouTube Data API'
              : 'Manual Research Fallback'}
          </span>
        </div>
      </div>

      {research.message && <div className="info-banner">{research.message}</div>}

      {/* Observed Competitor References */}
      <section className="section-block">
        <h3 className="section-title">
          Competitor & Performance References ({research.competitors.length})
        </h3>
        <p className="section-subtitle">
          Public views and subscriber counts are rough performance proxies, never private CTR data.
        </p>

        {research.competitors.length === 0 ? (
          <div className="empty-state">
            No specific competitor URLs provided. Heuristic niche patterns applied.
          </div>
        ) : (
          <div className="competitors-grid">
            {research.competitors.map((comp) => (
              <div key={comp.id} className="competitor-card">
                <div className="competitor-thumb-box">
                  {comp.thumbnailUrl ? (
                    <img
                      src={comp.thumbnailUrl}
                      alt={comp.title}
                      className="competitor-thumb-img"
                    />
                  ) : (
                    <div className="competitor-thumb-placeholder">
                      <span>No Thumbnail Image</span>
                    </div>
                  )}
                  <span className="category-tag">
                    {comp.category === 'relevant' ? 'Direct Competitor' : 'High Public View Proxy'}
                  </span>
                </div>

                <div className="competitor-info">
                  <h4 className="competitor-title" title={comp.title}>
                    {comp.title}
                  </h4>
                  <div className="competitor-meta">
                    <span className="channel-name">{comp.channelTitle}</span>
                    {comp.viewCount !== undefined && (
                      <span className="view-count">
                        ~{comp.viewCount.toLocaleString()} public views
                      </span>
                    )}
                  </div>
                  {comp.selectionRationale && (
                    <p className="selection-rationale">{comp.selectionRationale}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Observed Visual Patterns */}
      <section className="section-block">
        <h3 className="section-title">Observed Visual Category Conventions</h3>
        <div className="patterns-grid">
          {research.patterns.map((pat, idx) => (
            <div key={idx} className="pattern-card">
              <div className="pattern-header">
                <span className="pattern-name">{pat.name}</span>
                <span className={`frequency-pill ${pat.frequency}`}>{pat.frequency}</span>
              </div>
              <p className="pattern-desc">{pat.description}</p>
              <div className="pattern-analysis">
                <strong>Mechanism:</strong> {pat.effectivenessAnalysis}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Strict Evidence Categorization Grid (Mandated by Director Constitution v1.1) */}
      <section className="section-block">
        <h3 className="section-title">Strict Evidence Labeling</h3>
        <div className="evidence-grid">
          <div className="evidence-box fact-box">
            <h4>VERIFIED FACTS</h4>
            <ul>
              {research.observedFacts.map((fact, i) => (
                <li key={i}>{fact}</li>
              ))}
            </ul>
          </div>

          <div className="evidence-box metric-box">
            <h4>CALCULATED METRICS (Proxies)</h4>
            <ul>
              {research.calculatedMetrics.map((met, i) => (
                <li key={i}>{met}</li>
              ))}
            </ul>
          </div>

          <div className="evidence-box inference-box">
            <h4>INTERPRETATIONS</h4>
            <ul>
              {research.interpretations.map((interp, i) => (
                <li key={i}>{interp}</li>
              ))}
            </ul>
          </div>

          <div className="evidence-box hypothesis-box">
            <h4>TESTABLE HYPOTHESES</h4>
            <ul>
              {research.hypotheses.map((hyp, i) => (
                <li key={i}>{hyp}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Research Limitations & Safeguards */}
      <section className="section-block limitations-box">
        <h4>Methodological Limitations & Safeguards</h4>
        <ul>
          {research.limitations.map((lim, i) => (
            <li key={i}>{lim}</li>
          ))}
        </ul>
      </section>

      <div className="view-actions">
        <button onClick={onBack} className="btn-secondary" disabled={loading}>
          ← Edit Project Inputs
        </button>

        <button onClick={onProceedToDirector} className="btn-primary" disabled={loading}>
          {loading ? (
            <span className="btn-loading">
              <span className="spinner"></span> AI Director Synthesizing 3 Concepts...
            </span>
          ) : (
            'Formulate 3 Strategic Concepts with AI Director →'
          )}
        </button>
      </div>
    </div>
  );
};
