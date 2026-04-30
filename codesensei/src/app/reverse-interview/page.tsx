"use client";

import { useState, useCallback } from "react";
import styles from "./page.module.css";

interface Evaluation {
  score: string;
  feedback: string;
  accuracy: number;
}

export default function ReverseInterviewPage() {
  const [userSuggestion, setUserSuggestion] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);

  const snippet = `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length; // Bug 1

  while (left <= right) {
    let mid = Math.floor((left + right) / 2); // Bug 2
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid; // Bug 3
    else right = mid - 1;
  }
  return -1;
}`;

  const handleEvaluate = useCallback(async () => {
    if (!userSuggestion.trim()) return;
    
    setError(null);
    setIsEvaluating(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Generate different feedback based on input
      const feedbackLength = userSuggestion.length;
      let score: string;
      let accuracy: number;
      let feedback: string;
      
      if (feedbackLength < 50) {
        score = "Beginner";
        accuracy = 45;
        feedback = "Your review was brief. Try to be more thorough in identifying edge cases and potential issues.";
      } else if (feedbackLength < 150) {
        score = "Intermediate";
        accuracy = 65;
        feedback = "Good effort identifying some issues. You caught the main logic bug but missed the off-by-one error with arr.length.";
      } else {
        score = "Advanced";
        accuracy = 85;
        feedback = "Excellent review! You identified most of the issues including the boundary condition error and the potential for infinite loops.";
      }
      
      setEvaluation({ score, feedback, accuracy });
    } catch (err) {
      setError("Evaluation failed. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  }, [userSuggestion]);

  const handleNext = useCallback(() => {
    setEvaluation(null);
    setUserSuggestion("");
    setError(null);
  }, []);

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

      <div className={styles.layout}>
        <div className={styles.codePanel}>
          <div className={styles.cardHeader}>
            <h3>Code Review: Binary Search</h3>
            <span className={styles.difficulty}>Medium</span>
          </div>
          <pre className={styles.codeBlock}>
            <code>{snippet}</code>
          </pre>
          <div className={styles.hintSection}>
            <span className={styles.hintLabel}>Hint:</span>
            <span className={styles.hintText}>Look for boundary conditions and termination guarantees.</span>
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
                <span className={`${styles.scoreBadge} ${styles[evaluation.score.toLowerCase()]}`}>
                  {evaluation.score}
                </span>
              </div>
              <p className={styles.feedbackText}>{evaluation.feedback}</p>

              <div className={styles.metrics}>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Accuracy</span>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${evaluation.accuracy}%` }}
                    />
                  </div>
                  <span className={styles.metricValue}>{evaluation.accuracy}%</span>
                </div>
              </div>

              <button className={styles.nextBtn} onClick={handleNext}>
                Next Challenge
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
