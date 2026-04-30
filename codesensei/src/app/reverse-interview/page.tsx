"use client";

import { useState, useCallback, useEffect } from "react";
import styles from "./page.module.css";
import { interviewApi } from "@/lib/api";

interface Problem {
  problem_id: number;
  title: string;
  difficulty: string;
  language: string;
  code: string;
  issues_count: number;
}

interface EvaluationResult {
  score: number;
  feedback: {
    detected_issues: number;
    total_issues: number;
    missed_issues: Array<{ type: string; description: string; keywords: string[]; fix: string }>;
  };
  optimal_solution: string | null;
}

export default function ReverseInterviewPage() {
  const [userSuggestion, setUserSuggestion] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isLoadingProblem, setIsLoadingProblem] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);

  // Load problem from API
  const loadProblem = useCallback(async () => {
    setIsLoadingProblem(true);
    setError(null);
    
    try {
      const data = await interviewApi.getProblem();
      setProblem(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load problem");
    } finally {
      setIsLoadingProblem(false);
    }
  }, []);

  useEffect(() => {
    loadProblem();
  }, [loadProblem]);

  const handleEvaluate = useCallback(async () => {
    if (!userSuggestion.trim() || !problem) return;
    
    setError(null);
    setIsEvaluating(true);
    
    try {
      const result = await interviewApi.submitReview(problem.problem_id, userSuggestion);
      setEvaluation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Evaluation failed. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  }, [userSuggestion, problem]);

  const handleNext = useCallback(() => {
    setEvaluation(null);
    setUserSuggestion("");
    setError(null);
    loadProblem();
  }, [loadProblem]);

  const getScoreLabel = (score: number): string => {
    if (score < 50) return "Beginner";
    if (score < 80) return "Intermediate";
    return "Advanced";
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Reverse Interview</h1>
          <p className={styles.subtitle}>
            Review code snippets and identify bugs, inefficiencies, and scalability issues.
          </p>
        </div>
      </header>

      {isLoadingProblem ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Loading problem...</p>
        </div>
      ) : error && !problem ? (
        <div className={styles.errorState}>
          <p>{error}</p>
          <button className={styles.retryBtn} onClick={loadProblem}>Retry</button>
        </div>
      ) : problem ? (
      <div className={styles.layout}>
        <div className={styles.codePanel}>
          <div className={styles.cardHeader}>
            <h3>{problem.title}</h3>
            <span className={styles[problem.difficulty.toLowerCase()]}>{problem.difficulty}</span>
          </div>
          <pre className={styles.codeBlock}>
            <code>{problem.code}</code>
          </pre>
          <div className={styles.hintSection}>
            <span className={styles.hintLabel}>Hint:</span>
            <span className={styles.hintText}>Look for boundary conditions and termination guarantees. ({problem.issues_count} issues to find)</span>
          </div>
        </div>

        <div className={styles.actionPanel}>
          {!evaluation ? (
            <div className={styles.evaluationInput}>
              <h3>Your Analysis</h3>
              <p className={styles.helpText}>Identify the bugs and suggest fixes.</p>
              {error && <p className={styles.errorText}>{error}</p>}
              <textarea
                className={styles.textarea}
                placeholder="Describe the issues you found..."
                value={userSuggestion}
                onChange={(e) => setUserSuggestion(e.target.value)}
                disabled={isEvaluating}
              />
              <button
                className={styles.submitBtn}
                onClick={handleEvaluate}
                disabled={isEvaluating || !userSuggestion.trim()}
              >
                {isEvaluating ? (
                  <span className={styles.loadingContent}>
                    <span className={styles.spinner} />
                    Evaluating...
                  </span>
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          ) : (
            <div className={styles.evaluationResult}>
              <div className={styles.scoreHeader}>
                <h3>Evaluation</h3>
                <span className={`${styles.scoreBadge} ${styles[getScoreLabel(evaluation.score).toLowerCase()]}`}>
                  {getScoreLabel(evaluation.score)}
                </span>
              </div>
              
              <div className={styles.metrics}>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Accuracy</span>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${evaluation.score}%` }}
                    />
                  </div>
                  <span className={styles.metricValue}>{evaluation.score}%</span>
                </div>
              </div>

              <div className={styles.feedbackSection}>
                <p className={styles.feedbackText}>
                  Detected {evaluation.feedback.detected_issues} of {evaluation.feedback.total_issues} issues
                </p>
                
                {evaluation.feedback.missed_issues.length > 0 && (
                  <div className={styles.missedIssues}>
                    <h4>Missed Issues:</h4>
                    {evaluation.feedback.missed_issues.map((issue, idx) => (
                      <div key={idx} className={styles.missedIssue}>
                        <strong>{issue.description}</strong>
                        <p>Fix: {issue.fix}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {evaluation.optimal_solution && (
                  <div className={styles.optimalSolution}>
                    <h4>Optimal Solution:</h4>
                    <pre><code>{evaluation.optimal_solution}</code></pre>
                  </div>
                )}
              </div>

              <button className={styles.nextBtn} onClick={handleNext}>
                Next Challenge
              </button>
            </div>
          )}
        </div>
      </div>
      ) : null}
    </div>
  );
}
