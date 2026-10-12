import React, { useState } from 'react';
import { GenerateOutput, CreativeBrief } from '../types';

interface GenerationViewProps {
  generation: GenerateOutput;
  brief: CreativeBrief;
  attemptNumber: number;
  onProceedToEvaluate: () => void;
  loading: boolean;
  onBack: () => void;
}

export const GenerationView: React.FC<GenerationViewProps> = ({
  generation,
  brief,
  attemptNumber,
  onProceedToEvaluate,
  loading,
  onBack,
}) => {
  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const [previewScale, setPreviewScale] = useState<'normal' | 'mobile'>('normal');

  const imageSrc = generation.imageBase64.startsWith('data:')
    ? generation.imageBase64
    : `data:${generation.imageMimeType || 'image/png'};base64,${generation.imageBase64}`;

  return (
    <div className="card generation-view">
      <div className="card-header">
        <div>
          <div className="stage-indicator">
            Step 4: Candidate Generation (Attempt #{attemptNumber})
          </div>
          <h2>Thumbnail Candidate Rendered</h2>
          <p className="card-desc">
            Rendered using Cloudflare Workers AI ({generation.modelIdentifier}). Governed by Image
            Generator Constitution v1.0.
          </p>
        </div>
        <div className="attempt-badge">Attempt {attemptNumber} of 3</div>
      </div>

      <div className="preview-controls-bar">
        <div className="toggle-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showOverlay}
              onChange={(e) => setShowOverlay(e.target.checked)}
              disabled={!brief.exactOnImageWording}
            />
            <span>Exact Text Overlay {brief.exactOnImageWording ? `("${brief.exactOnImageWording}")` : '(None)'}</span>
          </label>
        </div>

        <div className="scale-selector">
          <span className="scale-label">Preview Scale:</span>
          <button
            type="button"
            className={`btn-scale ${previewScale === 'normal' ? 'active' : ''}`}
            onClick={() => setPreviewScale('normal')}
          >
            Desktop (Full 16:9)
          </button>
          <button
            type="button"
            className={`btn-scale ${previewScale === 'mobile' ? 'active' : ''}`}
            onClick={() => setPreviewScale('mobile')}
          >
            Mobile Card (150px)
          </button>
        </div>
      </div>

      {/* 16:9 Thumbnail Display Container */}
      <div className={`thumbnail-stage-wrapper ${previewScale === 'mobile' ? 'mobile-mode' : ''}`}>
        <div className="thumbnail-frame 16-9-ratio">
          <img src={imageSrc} alt="Generated Candidate" className="thumbnail-image" />

          {/* Deterministic text overlay layer */}
          {showOverlay && brief.exactOnImageWording && (
            <div className={`text-overlay-layer ${brief.textPlacement || 'top-left'}`}>
              <div className="overlay-pill">
                <span>{brief.exactOnImageWording.toUpperCase()}</span>
              </div>
            </div>
          )}

          {/* YouTube UI Simulation: Timestamp chip in bottom-right */}
          <div className="youtube-timestamp-simulation">14:28</div>
        </div>

        {previewScale === 'mobile' && (
          <p className="mobile-hint">
            Simulated Mobile Browse Feed Card (150 × 84 px). Check if the focal subject and idea are
            instantly clear.
          </p>
        )}
      </div>

      {/* Technical Metadata & Compiled Prompt */}
      <div className="generation-meta-box">
        <div className="meta-row">
          <span className="meta-label">Compiled Prompt (Prompt Compiler):</span>
          <code className="prompt-display">{generation.promptUsed}</code>
        </div>
        <div className="meta-grid">
          <div>
            <span className="meta-label">Format:</span> 16:9 Aspect Ratio ({generation.width} × {generation.height} px)
          </div>
          <div>
            <span className="meta-label">Model:</span> {generation.modelIdentifier}
          </div>
          <div>
            <span className="meta-label">Deterministic Overlay:</span>{' '}
            {brief.exactOnImageWording ? 'Applied in Safe Zone' : 'None (Text-free concept)'}
          </div>
        </div>
      </div>

      <div className="view-actions">
        <button onClick={onBack} className="btn-secondary" disabled={loading}>
          ← Revise Brief / Strategy
        </button>

        <button onClick={onProceedToEvaluate} className="btn-primary" disabled={loading}>
          {loading ? (
            <span className="btn-loading">
              <span className="spinner"></span> Running Independent Evaluator Multimodal Inspection...
            </span>
          ) : (
            'Run Independent Evaluator (Separate Gemini Inspection) →'
          )}
        </button>
      </div>
    </div>
  );
};
