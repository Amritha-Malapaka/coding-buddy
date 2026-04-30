"use client";

import { useState } from "react";
import styles from "./CodeInput.module.css";

interface CodeInputProps {
  onAnalyze: (problem: string, code: string) => void;
  isAnalyzing: boolean;
}

export default function CodeInput({ onAnalyze, isAnalyzing }: CodeInputProps) {
  const [problem, setProblem] = useState("");
  const [code, setCode] = useState("");

  const handleAnalyze = () => {
    if (code.trim()) {
      onAnalyze(problem, code);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.fieldGroup}>
        <label htmlFor="problem" className={styles.label}>
          <span className={styles.labelNumber}>01</span>
          Problem Description
        </label>
        <textarea
          id="problem"
          className={styles.textarea}
          placeholder="Describe the problem or paste a LeetCode URL..."
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          rows={3}
          disabled={isAnalyzing}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="code" className={styles.label}>
          <span className={styles.labelNumber}>02</span>
          Your Solution
        </label>
        <textarea
          id="code"
          className={`${styles.textarea} ${styles.codeArea}`}
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={isAnalyzing}
        />
      </div>

      <button
        className={styles.analyzeBtn}
        onClick={handleAnalyze}
        disabled={isAnalyzing || !code.trim()}
      >
        {isAnalyzing ? (
          <span className={styles.loadingText}>
            <span className={styles.spinner} />
            Analyzing...
          </span>
        ) : (
          "Analyze Solution"
        )}
      </button>
    </div>
  );
}
