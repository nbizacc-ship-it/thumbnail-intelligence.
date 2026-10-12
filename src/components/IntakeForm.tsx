import React, { useState } from 'react';

export interface IntakeFormData {
  videoTitle: string;
  videoDescription: string;
  targetAudience: string;
  channelName: string;
  channelUrl: string;
  competitorUrls: string[];
  exactThumbnailText: string;
  brandColors: string;
  typography: string;
  visualsToAvoid: string;
  preferredTone: string;
  aspectRatio: string;
}

interface IntakeFormProps {
  onSubmit: (data: IntakeFormData) => void;
  loading: boolean;
}

export const IntakeForm: React.FC<IntakeFormProps> = ({ onSubmit, loading }) => {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [channelName, setChannelName] = useState('');
  const [channelUrl, setChannelUrl] = useState('');
  const [competitorUrlsText, setCompetitorUrlsText] = useState('');
  const [exactThumbnailText, setExactThumbnailText] = useState('');
  const [brandColors, setBrandColors] = useState('');
  const [typography, setTypography] = useState('');
  const [visualsToAvoid, setVisualsToAvoid] = useState('');
  const [preferredTone, setPreferredTone] = useState('Credible, curious, high-contrast');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [validationError, setValidationError] = useState('');

  const handlePreloadExample = () => {
    setVideoTitle('Building a Local AI Coding Agent That Actually Works');
    setVideoDescription(
      'A deep dive into building an autonomous local coding agent with tool use, test-driven execution, and separation of concerns. Demonstrating real terminal commands, error recovery, and why toy agent demos fail in production.'
    );
    setTargetAudience('Software engineers, AI builders, and tech enthusiasts');
    setChannelName('Autonomous Engineering');
    setExactThumbnailText('REAL AGENTS');
    setPreferredTone('Focused, technical, authoritative');
    setBrandColors('#0F172A (Deep Slate), #0284C7 (Cyan Accent)');
    setVisualsToAvoid('Generic robot illustrations, glowing brain holograms, cartoonish shocked faces');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim()) {
      setValidationError('Video Title or Topic is required to initiate research.');
      return;
    }
    setValidationError('');

    const competitorUrls = competitorUrlsText
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    onSubmit({
      videoTitle,
      videoDescription,
      targetAudience,
      channelName,
      channelUrl,
      competitorUrls,
      exactThumbnailText,
      brandColors,
      typography,
      visualsToAvoid,
      preferredTone,
      aspectRatio,
    });
  };

  return (
    <div className="card intake-card">
      <div className="card-header">
        <div>
          <h2>Step 1: Project Information & Evidence Intake</h2>
          <p className="card-desc">
            Provide the real video information. The Director uses this to research competitors, develop an
            honest creative argument, and ensure the thumbnail faithfully reflects the actual video.
          </p>
        </div>
        <button
          type="button"
          onClick={handlePreloadExample}
          className="btn-text"
          disabled={loading}
        >
          Load Example Project
        </button>
      </div>

      {validationError && <div className="error-banner">{validationError}</div>}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="videoTitle">
            Video Title or Working Topic <span className="required-mark">*</span>
          </label>
          <input
            id="videoTitle"
            type="text"
            className="form-input"
            placeholder="e.g., Why We Replaced Postgres with SQLite in Production"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            disabled={loading}
            required
          />
          <span className="input-hint">The primary topic used for competitive research and visual argument.</span>
        </div>

        <div className="form-group full-width">
          <label htmlFor="videoDescription">
            Video Description, Outline, or Script Summary <span className="optional-tag">(Recommended)</span>
          </label>
          <textarea
            id="videoDescription"
            className="form-textarea"
            rows={3}
            placeholder="Summarize what the video actually demonstrates, proves, or shows. Crucial for the Director to formulate a truthful promise."
            value={videoDescription}
            onChange={(e) => setVideoDescription(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="targetAudience">Target Audience & Niche</label>
          <input
            id="targetAudience"
            type="text"
            className="form-input"
            placeholder="e.g., Senior backend developers, self-hosters"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="channelName">Channel Name or Creator</label>
          <input
            id="channelName"
            type="text"
            className="form-input"
            placeholder="e.g., Tech Craft Lab"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="exactText">
            Exact On-Thumbnail Text <span className="optional-tag">(Optional, 1–3 words)</span>
          </label>
          <input
            id="exactText"
            type="text"
            className="form-input"
            placeholder="e.g., NO SERVER (leave blank if no text preferred)"
            value={exactThumbnailText}
            onChange={(e) => setExactThumbnailText(e.target.value)}
            disabled={loading}
          />
          <span className="input-hint">Rendered deterministically via SVG/Canvas to prevent AI spelling errors.</span>
        </div>

        <div className="form-group">
          <label htmlFor="preferredTone">Preferred Visual Tone</label>
          <input
            id="preferredTone"
            type="text"
            className="form-input"
            placeholder="e.g., Authentic, editorial, cinematic, documentary"
            value={preferredTone}
            onChange={(e) => setPreferredTone(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="brandColors">Brand Colors & Style</label>
          <input
            id="brandColors"
            type="text"
            className="form-input"
            placeholder="e.g., Deep navy (#0A192F) with vibrant amber accents"
            value={brandColors}
            onChange={(e) => setBrandColors(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="visualsToAvoid">Visual Elements to Avoid</label>
          <input
            id="visualsToAvoid"
            type="text"
            className="form-input"
            placeholder="e.g., Cartoon faces, red arrows, generic stock photos"
            value={visualsToAvoid}
            onChange={(e) => setVisualsToAvoid(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="competitorUrls">
            Competitor Video URLs <span className="optional-tag">(Optional, one per line)</span>
          </label>
          <textarea
            id="competitorUrls"
            className="form-textarea"
            rows={2}
            placeholder="https://www.youtube.com/watch?v=... (Optional specific references to analyze)"
            value={competitorUrlsText}
            onChange={(e) => setCompetitorUrlsText(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-footer full-width">
          <div className="aspect-ratio-selector">
            <span className="aspect-label">Format:</span>
            <span className="aspect-pill active">16:9 Standard (1280 × 720)</span>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <span className="btn-loading">
                <span className="spinner"></span> Gathering Research & Analyzing Market...
              </span>
            ) : (
              'Start Research & Director Reasoning →'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
