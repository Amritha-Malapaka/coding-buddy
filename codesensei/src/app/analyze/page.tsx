"use client";

import { useState } from "react";
import styles from "./page.module.css";
import CodeInput from "@/components/CodeInput";
import AnalysisResults from "@/components/AnalysisResults";
import ThoughtProcessReplay from "@/components/ThoughtProcessReplay";

export default function AnalyzePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasResults, setHasResults] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Mock API call delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasResults(true);
    }, 1500);
  };

  return (
    <div className={styles.analyzeContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Code Analysis Engine</h1>
        <p className={styles.subtitle}>Submit your solution and understand its strengths and weaknesses.</p>
      </header>
      
      <div className={styles.layout}>
        <div className={styles.inputSection}>
          <CodeInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        </div>
        
        {hasResults && (
          <div className={styles.resultsSection}>
            <AnalysisResults />
            <ThoughtProcessReplay />
          </div>
        )}

        {!hasResults && !isAnalyzing && (
          <div className={styles.placeholderSection}>
            <div className={styles.placeholderIcon}>✨</div>
            <h2>Ready to analyze</h2>
            <p>Paste your code on the left to see runtime complexity, optimal approaches, and a breakdown of your likely thought process.</p>
          </div>
        )}
      </div>
    </div>
  );
}
