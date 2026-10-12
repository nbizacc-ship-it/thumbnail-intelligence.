import React, { useState, useEffect } from 'react';
import { ApiService } from './services/api';
import {
  SystemHealth,
  ResearchResult,
  DirectorOutput,
  GenerateOutput,
  EvaluationResult,
  CreativeBrief,
} from './types';
import { Header } from './components/Header';
import { IntakeForm, IntakeFormData } from './components/IntakeForm';
import { ResearchView } from './components/ResearchView';
import { DirectorView } from './components/DirectorView';
import { GenerationView } from './components/GenerationView';
import { EvaluationView } from './components/EvaluationView';
import { FinalReviewView } from './components/FinalReviewView';

type Stage = 'input' | 'research' | 'director' | 'generate' | 'evaluate' | 'review';

export const App: React.FC = () => {
  const [stage, setStage] = useState<Stage>('input');
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [accessCode, setAccessCode] = useState<string>(() => localStorage.getItem('app_access_code') || '');
  const [demoMode, setDemoMode] = useState<boolean>(() => localStorage.getItem('app_demo_mode') === 'true');

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Workflow state
  const [formData, setFormData] = useState<IntakeFormData | null>(null);
  const [researchData, setResearchData] = useState<ResearchResult | null>(null);
  const [directorData, setDirectorData] = useState<DirectorOutput | null>(null);
  const [currentBrief, setCurrentBrief] = useState<CreativeBrief | null>(null);
  const [generation, setGeneration] = useState<GenerateOutput | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const [attemptCount, setAttemptCount] = useState<number>(1);
  const maxAttempts = 2;

  const [api] = useState<ApiService>(() => new ApiService(accessCode, demoMode));

  // Update ApiService when accessCode or demoMode changes
  useEffect(() => {
    api.setAccessCode(accessCode);
    localStorage.setItem('app_access_code', accessCode);
  }, [accessCode, api]);

  useEffect(() => {
    api.setDemoMode(demoMode);
    localStorage.setItem('app_demo_mode', String(demoMode));
  }, [demoMode, api]);

  // Initial health check
  useEffect(() => {
    api.checkHealth().then((h) => {
      setHealth(h);
      // Auto-enable demo mode if neither Gemini nor Cloudflare are configured
      if (!h.configured.gemini && !h.configured.cloudflare) {
        setDemoMode(true);
      }
    });
  }, [api]);

  const handleReset = () => {
    if (confirm('Start a new project? Current progress will be cleared.')) {
      setStage('input');
      setFormData(null);
      setResearchData(null);
      setDirectorData(null);
      setCurrentBrief(null);
      setGeneration(null);
      setEvaluation(null);
      setAttemptCount(1);
      setErrorMessage('');
    }
  };

  // 1. Submit Intake Form -> Research
  const handleIntakeSubmit = async (data: IntakeFormData) => {
    setFormData(data);
    setLoading(true);
    setErrorMessage('');

    try {
      const research = await api.runResearch({
        topic: data.videoTitle,
        channelUrl: data.channelUrl,
        competitorUrls: data.competitorUrls,
        targetAudience: data.targetAudience,
      });

      setResearchData(research);
      setStage('research');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to conduct competitive research.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Research View -> AI Director
  const handleProceedToDirector = async () => {
    if (!formData) return;
    setLoading(true);
    setErrorMessage('');

    try {
      const director = await api.runDirector({
        videoTitle: formData.videoTitle,
        videoDescription: formData.videoDescription,
        targetAudience: formData.targetAudience,
        channelName: formData.channelName,
        brandColors: formData.brandColors,
        visualsToAvoid: formData.visualsToAvoid,
        preferredTone: formData.preferredTone,
        exactThumbnailText: formData.exactThumbnailText,
        researchResult: researchData || undefined,
      });

      setDirectorData(director);
      setCurrentBrief(director.creativeBrief);
      setStage('director');
    } catch (err: any) {
      setErrorMessage(err.message || 'AI Director concept formulation failed.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Director View -> Image Generation
  const handleApproveAndGenerate = async (selectedConceptId: string) => {
    if (!directorData) return;
    setLoading(true);
    setErrorMessage('');

    const chosenConcept =
      directorData.concepts.find((c) => c.id === selectedConceptId) || directorData.concepts[0];

    // Ensure brief matches the chosen concept
    const briefToUse: CreativeBrief = {
      ...directorData.creativeBrief,
      conceptId: chosenConcept.id,
      conceptName: chosenConcept.conceptName,
      mainVisualIdea: chosenConcept.visualMetaphorOrEvent,
    };
    setCurrentBrief(briefToUse);

    try {
      const genResult = await api.runGenerate({
        creativeBrief: briefToUse,
      });

      setGeneration(genResult);
      setAttemptCount(1);
      setStage('generate');
    } catch (err: any) {
      setErrorMessage(err.message || 'Image generation failed.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Generation View -> Independent Evaluation
  const handleProceedToEvaluate = async () => {
    if (!generation || !currentBrief || !formData) return;
    setLoading(true);
    setErrorMessage('');

    try {
      const evalResult = await api.runEvaluate({
        imageBase64: generation.imageBase64,
        creativeBrief: currentBrief,
        videoInfo: {
          title: formData.videoTitle,
          description: formData.videoDescription,
          targetAudience: formData.targetAudience,
          exactText: formData.exactThumbnailText,
        },
      });

      setEvaluation(evalResult);
      setStage('evaluate');
    } catch (err: any) {
      setErrorMessage(err.message || 'Independent evaluation failed.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Revision Controller: Trigger Targeted Revision
  const handleTriggerRevision = async () => {
    if (!evaluation || !currentBrief) return;
    setLoading(true);
    setErrorMessage('');

    try {
      // Step A: Request Revision Controller to adjust brief specifically for defects
      const reviseResult = await api.runRevise({
        evaluationResult: evaluation,
        creativeBrief: currentBrief,
        attemptNumber: attemptCount,
        maxAttempts,
      });

      const updatedBrief: CreativeBrief = reviseResult.revisedBrief || currentBrief;
      setCurrentBrief(updatedBrief);

      // Step B: Re-generate candidate with revised brief
      const newGen = await api.runGenerate({
        creativeBrief: updatedBrief,
        previousAttempts: [
          {
            attemptNumber: attemptCount,
            promptUsed: generation?.promptUsed || '',
            defectsReported: evaluation.findings,
          },
        ],
      });
      setGeneration(newGen);

      // Step C: Re-evaluate the new candidate from scratch
      const newEval = await api.runEvaluate({
        imageBase64: newGen.imageBase64,
        creativeBrief: updatedBrief,
        videoInfo: {
          title: formData?.videoTitle || '',
          description: formData?.videoDescription,
          targetAudience: formData?.targetAudience,
          exactText: formData?.exactThumbnailText,
        },
      });
      setEvaluation(newEval);

      const nextAttempt = attemptCount + 1;
      setAttemptCount(nextAttempt);
      // Stay on evaluation view to display the new audit report
      setStage('evaluate');
    } catch (err: any) {
      setErrorMessage(err.message || 'Targeted revision failed.');
    } finally {
      setLoading(false);
    }
  };

  // 6. Evaluation -> Final Review & Export
  const handleProceedToReview = () => {
    setStage('review');
  };

  const stagesList = [
    { id: 'input', label: '1. Intake' },
    { id: 'research', label: '2. Research' },
    { id: 'director', label: '3. Director' },
    { id: 'generate', label: '4. Generation' },
    { id: 'evaluate', label: '5. Evaluation' },
    { id: 'review', label: '6. Review & Export' },
  ];

  return (
    <div className="app-layout">
      <Header
        health={health}
        accessCode={accessCode}
        onAccessCodeChange={setAccessCode}
        demoMode={demoMode}
        onDemoModeToggle={setDemoMode}
        currentStage={stage}
        onReset={handleReset}
      />

      {/* Stepper Navigation */}
      <nav className="stepper-bar">
        {stagesList.map((st, i) => {
          const isActive = stage === st.id;
          const isPassed =
            stagesList.findIndex((x) => x.id === stage) > i;

          return (
            <div
              key={st.id}
              className={`stepper-step ${isActive ? 'active' : ''} ${isPassed ? 'completed' : ''}`}
            >
              <span className="step-circle">{isPassed ? '✓' : i + 1}</span>
              <span className="step-text">{st.label}</span>
            </div>
          );
        })}
      </nav>

      <main className="main-content">
        {errorMessage && (
          <div className="error-banner global-error">
            <div className="error-header">
              <strong>System Error:</strong> {errorMessage}
            </div>
            <div className="error-hint">
              {demoMode
                ? 'Check browser console or restart the session.'
                : 'Ensure credentials in your .env or Netlify settings are active and configured correctly. Or enable "Demo Mode" in the header to test UI flows.'}
            </div>
          </div>
        )}

        {stage === 'input' && (
          <IntakeForm onSubmit={handleIntakeSubmit} loading={loading} />
        )}

        {stage === 'research' && researchData && (
          <ResearchView
            research={researchData}
            onProceedToDirector={handleProceedToDirector}
            loading={loading}
            onBack={() => setStage('input')}
          />
        )}

        {stage === 'director' && directorData && (
          <DirectorView
            directorData={directorData}
            onApproveAndGenerate={handleApproveAndGenerate}
            loading={loading}
            onBack={() => setStage('research')}
          />
        )}

        {stage === 'generate' && generation && currentBrief && (
          <GenerationView
            generation={generation}
            brief={currentBrief}
            attemptNumber={attemptCount}
            onProceedToEvaluate={handleProceedToEvaluate}
            loading={loading}
            onBack={() => setStage('director')}
          />
        )}

        {stage === 'evaluate' && evaluation && currentBrief && (
          <EvaluationView
            evaluation={evaluation}
            brief={currentBrief}
            attemptNumber={attemptCount}
            maxAttempts={maxAttempts}
            onTriggerRevision={handleTriggerRevision}
            onProceedToReview={handleProceedToReview}
            revisionLoading={loading}
            onBack={() => setStage('generate')}
          />
        )}

        {stage === 'review' && generation && evaluation && directorData && currentBrief && (
          <FinalReviewView
            generation={generation}
            evaluation={evaluation}
            directorData={directorData}
            researchData={researchData || undefined}
            brief={currentBrief}
            attemptCount={attemptCount}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="system-footer">
        <div className="footer-content">
          <span>AI Thumbnail Intelligence System · Netlify Serverless Architecture</span>
          <span>
            Research → Director (Gemini) → Prompt Compiler → Image Gen (Cloudflare Workers AI) → Evaluator (Gemini) → Revision Controller
          </span>
        </div>
      </footer>
    </div>
  );
};
