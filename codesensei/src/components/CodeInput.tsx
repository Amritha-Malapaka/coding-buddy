import { useState } from "react";
import styles from "./CodeInput.module.css";

interface CodeInputProps {
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export default function CodeInput({ onAnalyze, isAnalyzing }: CodeInputProps) {
  const [problem, setProblem] = useState("");
  const [code, setCode] = useState("");

  return (
    <div className={styles.container}>
      <div className={styles.fieldGroup}>
        <label htmlFor="problem" className={styles.label}>1. Problem Description or URL</label>
        <textarea
          id="problem"
          className={styles.textarea}
          placeholder="e.g. Find the two numbers in an array that add up to a target sum."
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          rows={3}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="code" className={styles.label}>2. Your Code</label>
        <textarea
          id="code"
          className={`${styles.textarea} ${styles.codeArea}`}
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      <button 
        className={styles.analyzeBtn} 
        onClick={onAnalyze}
        disabled={isAnalyzing || !code.trim()}
      >
        {isAnalyzing ? "Analyzing Code..." : "Analyze My Solution"}
      </button>
    </div>
  );
}
