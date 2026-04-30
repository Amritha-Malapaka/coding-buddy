"use client";

import { useState } from "react";
import styles from "./ThoughtProcessReplay.module.css";

interface ThoughtProcessReplayProps {
  code?: string;
}

export default function ThoughtProcessReplay({ code }: ThoughtProcessReplayProps) {
  const [feedback, setFeedback] = useState<"yes" | "no" | null>(null);
  const [userReasoning, setUserReasoning] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = (type: "yes" | "no") => {
    setFeedback(type);
    if (type === "yes") {
      setSubmitted(true);
    }
  };

  const handleSubmitReasoning = () => {
    if (userReasoning.trim()) {
      setSubmitted(true);
    }
  };

  // Generate different thought process based on code characteristics
  const getThoughtProcess = () => {
    const codeLower = code?.toLowerCase() || "";
    
    if (codeLower.includes("sort")) {
      return [
        { title: "Pattern Recognition", desc: "You identified this as a sorting-based problem and selected an appropriate comparison sort." },
        { title: "Implementation Strategy", desc: "You chose a built-in sort method, leveraging optimized native implementations." },
      ];
    }
    
    if (codeLower.includes("map") || codeLower.includes("object") || codeLower.includes("set")) {
      return [
        { title: "Algorithm Selection", desc: "You recognized the potential for O(1) lookups and chose a hash-based approach." },
        { title: "Trade-off Awareness", desc: "You accepted the space-time trade-off, prioritizing speed over memory efficiency." },
      ];
    }
    
    if ((code?.match(/for/g) || []).length >= 2) {
      return [
        { title: "Pattern Matching", desc: "You recognized this as an enumeration problem requiring checking all combinations." },
        { title: "Implementation", desc: "You used nested loops for exhaustive search, prioritizing correctness over optimization." },
      ];
    }
    
    return [
      { title: "Initial Approach", desc: "You analyzed the problem and identified the core requirements and constraints." },
      { title: "Solution Design", desc: "You implemented a clean, iterative solution with careful attention to edge cases." },
    ];
  };

  const steps = getThoughtProcess();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Thought Process</h2>
        <span className={styles.tag}>Inferred</span>
      </div>

      <div className={styles.steps}>
        {steps.map((step, index) => (
          <div key={index} className={styles.step}>
            <div className={styles.stepNumber}>{index + 1}</div>
            <div className={styles.stepContent}>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {!submitted ? (
        <div className={styles.feedbackSection}>
          <p className={styles.feedbackPrompt}>Does this match your approach?</p>
          <div className={styles.buttons}>
            <button
              className={`${styles.btn} ${feedback === "yes" ? styles.activeYes : ""}`}
              onClick={() => handleFeedback("yes")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Yes, correct
            </button>
            <button
              className={`${styles.btn} ${feedback === "no" ? styles.activeNo : ""}`}
              onClick={() => handleFeedback("no")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" x2="6" y1="6" y2="18" />
                <line x1="6" x2="18" y1="6" y2="18" />
              </svg>
              No, incorrect
            </button>
          </div>

          {feedback === "no" && (
            <div className={styles.correctionForm}>
              <p className={styles.correctionLabel}>Describe your actual approach:</p>
              <textarea
                className={styles.textarea}
                placeholder="Explain your thinking..."
                value={userReasoning}
                onChange={(e) => setUserReasoning(e.target.value)}
              />
              <button
                className={styles.submitBtn}
                onClick={handleSubmitReasoning}
                disabled={!userReasoning.trim()}
              >
                Update Profile
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.successMessage}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Profile updated successfully
        </div>
      )}
    </div>
  );
}
