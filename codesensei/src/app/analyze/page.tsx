"use client";

import { useState, useCallback } from "react";
import styles from "./page.module.css";
import CodeInput from "@/components/CodeInput";
import AnalysisResults from "@/components/AnalysisResults";
import ThoughtProcessReplay from "@/components/ThoughtProcessReplay";

interface AnalysisData {
  problem: string;
  code: string;
  timestamp: number;
}

export default function AnalyzePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async (problem: string, code: string) => {
    setError(null);
    setIsAnalyzing(true);
    setAnalysisData(null);

    try {
      // Simulate API analysis with unique data per input
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Store the unique analysis data based on input
      setAnalysisData({
        problem,
        code,
        timestamp: Date.now(),
      });
    } catch (err) {
      setError("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setAnalysisData(null);
    setError(null);
  }, []);

  const hasResults = !!analysisData;

  return (
    <div className={styles.analyzeContainer}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Code Analysis</h1>
          <p className={styles.subtitle}>
            Submit your solution for complexity analysis and improvement suggestions.
          </p>
        </div>
        {hasResults && (
          <button className={styles.resetBtn} onClick={handleReset}>
            New Analysis
          </button>
        )}
      </header>

      <div className={styles.layout}>
        <div className={styles.inputSection}>
          <CodeInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        </div>

        {error && (
          <div className={styles.errorSection}>
            <div className={styles.errorIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" x2="9" y1="9" y2="15" />
                <line x1="9" x2="15" y1="9" y2="15" />
              </svg>
            </div>
            <p className={styles.errorText}>{error}</p>
          </div>
        )}

        {isAnalyzing && (
          <div className={styles.loadingSection}>
            <div className={styles.loadingSpinner} />
            <p className={styles.loadingText}>Analyzing your code...</p>
          </div>
        )}

        {hasResults && !isAnalyzing && (
          <div className={styles.resultsSection}>
            <AnalysisResults code={analysisData.code} problem={analysisData.problem} />
            <ThoughtProcessReplay code={analysisData.code} />
          </div>
        )}

        {!hasResults && !isAnalyzing && !error && (
          <div className={styles.placeholderSection}>
            <div className={styles.placeholderIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="m21 21-4.35-4.35" />
                <circle cx="11" cy="11" r="8" />
              </svg>
            </div>
            <h2>Ready to analyze</h2>
            <p>Paste your code to receive complexity analysis and improvement suggestions.</p>
          </div>
        )}
      </div>
    </div>
  );
}
