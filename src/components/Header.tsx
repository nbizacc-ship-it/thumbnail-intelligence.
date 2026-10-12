import React from 'react';
import { SystemHealth } from '../types';

interface HeaderProps {
  health: SystemHealth | null;
  accessCode: string;
  onAccessCodeChange: (code: string) => void;
  demoMode: boolean;
  onDemoModeToggle: (enabled: boolean) => void;
  currentStage: string;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  health,
  accessCode,
  onAccessCodeChange,
  demoMode,
  onDemoModeToggle,
  currentStage,
  onReset,
}) => {
  return (
    <header className="header-container">
      <div className="header-top">
        <div className="logo-group">
          <div className="system-badge">AI ARCHITECTURE</div>
          <h1 className="system-title">Thumbnail Intelligence System</h1>
          <p className="system-subtitle">
            Evidence-Driven YouTube Thumbnail Strategy, Generation & Independent Quality Evaluation
          </p>
        </div>

        <div className="controls-group">
          <div className="demo-toggle-card">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={demoMode}
                onChange={(e) => onDemoModeToggle(e.target.checked)}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-text">
                Demo Mode {demoMode ? '(Active)' : '(Off)'}
              </span>
            </label>
            <span className="demo-hint">
              {demoMode ? 'Testing with simulated providers' : 'Using live Netlify Functions & APIs'}
            </span>
          </div>

          <div className="access-code-box">
            <label htmlFor="accessCodeInput">Access Code:</label>
            <input
              id="accessCodeInput"
              type="password"
              placeholder="Optional APP_ACCESS_CODE"
              value={accessCode}
              onChange={(e) => onAccessCodeChange(e.target.value)}
              className="access-input"
            />
          </div>

          {currentStage !== 'input' && (
            <button onClick={onReset} className="btn-secondary btn-sm">
              New Project
            </button>
          )}
        </div>
      </div>

      <div className="status-bar">
        <div className="status-indicators">
          <span className="indicator-label">Provider Readiness:</span>

          <span
            className={`status-pill ${
              demoMode
                ? 'pill-simulated'
                : health?.configured.gemini
                ? 'pill-active'
                : 'pill-missing'
            }`}
          >
            Gemini API: {demoMode ? 'Simulated' : health?.configured.gemini ? 'Ready' : 'Not Configured'}
          </span>

          <span
            className={`status-pill ${
              demoMode
                ? 'pill-simulated'
                : health?.configured.cloudflare
                ? 'pill-active'
                : 'pill-missing'
            }`}
          >
            Cloudflare Workers AI:{' '}
            {demoMode ? 'Simulated' : health?.configured.cloudflare ? 'Ready' : 'Not Configured'}
          </span>

          <span
            className={`status-pill ${
              demoMode
                ? 'pill-simulated'
                : health?.configured.youtube
                ? 'pill-active'
                : 'pill-fallback'
            }`}
          >
            YouTube Data API:{' '}
            {demoMode
              ? 'Simulated'
              : health?.configured.youtube
              ? 'Ready'
              : 'Manual Fallback Mode'}
          </span>
        </div>

        <div className="constitution-badges">
          <span className="badge-pill">Director Constitution v1.1</span>
          <span className="badge-pill">Image Gen Constitution v1.0</span>
          <span className="badge-pill">Evaluator Rubric v1.0</span>
        </div>
      </div>
    </header>
  );
};
