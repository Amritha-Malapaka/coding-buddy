"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function ReverseInterviewPage() {
  const [userSuggestion, setUserSuggestion] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);

  const snippet = `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length; // Bug 1

  while (left <= right) {
    let mid = Math.floor((left + right) / 2); // Bug 2 (overflow risk)
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid; // Bug 3 (infinite loop)
    else right = mid - 1;
  }
  return -1;
}`;

  const handleEvaluate = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      setEvaluation({
        score: "Intermediate",
        feedback: "Great job spotting the infinite loop risk. However, you missed the off-by-one error with `arr.length` and the potential integer overflow in calculating `mid`.",
        accuracy: 65
      });
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Reverse Interview Mode</h1>
        <p className={styles.subtitle}>Play the interviewer. Identify the bugs, inefficiencies, and scalability issues in this code.</p>
      </header>

      <div className={styles.layout}>
        <div className={styles.codePanel}>
          <div className={styles.cardHeader}>
            <h3>Target Code Snippet: Binary Search</h3>
            <span className={styles.difficulty}>Medium</span>
          </div>
          <pre className={styles.codeBlock}>
            <code>{snippet}</code>
          </pre>
        </div>

        <div className={styles.actionPanel}>
          {!evaluation ? (
            <div className={styles.evaluationInput}>
              <h3>Your Review</h3>
              <p className={styles.helpText}>Explain the bugs and suggest how you would fix them.</p>
              <textarea 
                className={styles.textarea}
                placeholder="E.g. The first bug is on line 3, it should be arr.length - 1..."
                value={userSuggestion}
                onChange={(e) => setUserSuggestion(e.target.value)}
              />
              <button 
                className={styles.submitBtn} 
                onClick={handleEvaluate}
                disabled={isEvaluating || !userSuggestion.trim()}
              >
                {isEvaluating ? "Evaluating..." : "Submit My Review"}
              </button>
            </div>
          ) : (
            <div className={styles.evaluationResult}>
              <div className={styles.scoreHeader}>
                <h3>Evaluation Complete</h3>
                <span className={styles.scoreBadge}>{evaluation.score}</span>
              </div>
              <p className={styles.feedbackText}>{evaluation.feedback}</p>
              
              <div className={styles.metrics}>
                <div className={styles.metric}>
                  <span>Accuracy Tracking</span>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${evaluation.accuracy}%` }}></div>
                  </div>
                </div>
              </div>

              <button className={styles.nextBtn} onClick={() => {
                setEvaluation(null);
                setUserSuggestion("");
              }}>
                Next Snippet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
