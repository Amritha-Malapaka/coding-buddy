import { useState } from "react";
import styles from "./ThoughtProcessReplay.module.css";

export default function ThoughtProcessReplay() {
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

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>Thought Process Replay</h2>
        <span className={styles.tag}>AI Inferred</span>
      </div>

      <div className={styles.steps}>
        <div className={styles.step}>
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepContent}>
            <h4>Pattern Matching</h4>
            <p>You recognized this as a combination problem and immediately thought of using two nested loops to check all pairs.</p>
          </div>
        </div>
        <div className={styles.step}>
          <div className={styles.stepNumber}>2</div>
          <div className={styles.stepContent}>
            <h4>Brute Force Implementation</h4>
            <p>You implemented the loop correctly but didn't consider the O(N²) time penalty for larger inputs.</p>
          </div>
        </div>
      </div>

      {!submitted ? (
        <div className={styles.feedbackSection}>
          <p className={styles.feedbackPrompt}>Does this match how you approached it?</p>
          <div className={styles.buttons}>
            <button 
              className={`${styles.btn} ${feedback === "yes" ? styles.activeYes : ""}`}
              onClick={() => handleFeedback("yes")}
            >
              ✓ Yes, exactly
            </button>
            <button 
              className={`${styles.btn} ${feedback === "no" ? styles.activeNo : ""}`}
              onClick={() => handleFeedback("no")}
            >
              ✕ No, it's incorrect
            </button>
          </div>

          {feedback === "no" && (
            <div className={styles.correctionForm}>
              <p>Help me understand your actual thinking:</p>
              <textarea 
                className={styles.textarea}
                placeholder="I actually tried to use a hashmap but got stuck on..."
                value={userReasoning}
                onChange={(e) => setUserReasoning(e.target.value)}
              />
              <button className={styles.submitBtn} onClick={handleSubmitReasoning}>
                Update My DNA Profile
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.successMessage}>
          Thanks! Your Code DNA profile has been updated.
        </div>
      )}
    </div>
  );
}
