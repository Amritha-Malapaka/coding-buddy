"use client";

import styles from "./AnalysisResults.module.css";

interface AnalysisData {
  time_complexity: { complexity: string; confidence: string; reason: string };
  space_complexity: { complexity: string; confidence: string; reason: string };
  patterns: Array<{ name: string; type: string }>;
  bottlenecks: Array<{ type: string; issue: string; impact: string; fix: string }>;
  suggestions: Array<{ priority: string; category: string; suggestion: string; reason: string }>;
  metrics: { total_lines: number; code_lines: number; functions: number; loops: number; conditionals: number };
}

interface AnalysisResultsProps {
  code: string;
  problem?: string;
  analysis?: AnalysisData;
}

function getComplexityType(complexity: string): "good" | "warning" | "error" {
  if (complexity.includes("N²") || complexity.includes("2^N") || complexity.includes("N!")) {
    return "error";
  }
  if (complexity.includes("N log N") || complexity.includes("log N")) {
    return "warning";
  }
  return "good";
}

function getStatusFromAnalysis(analysis: AnalysisData): { status: string; statusType: "good" | "warning" | "error" } {
  const timeType = getComplexityType(analysis.time_complexity.complexity);
  if (timeType === "error") {
    return { status: "Needs Optimization", statusType: "error" };
  }
  if (analysis.bottlenecks.length > 0) {
    return { status: "Could Be Improved", statusType: "warning" };
  }
  if (timeType === "warning") {
    return { status: "Good Approach", statusType: "warning" };
  }
  return { status: "Optimal Solution", statusType: "good" };
}

export default function AnalysisResults({ code, problem, analysis }: AnalysisResultsProps) {
  // Fallback to local analysis if no API data provided
  if (!analysis) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Analysis Results</h2>
          <span className={styles.statusBadge}>No analysis available</span>
        </div>
        <p className={styles.noData}>Submit code to see analysis results.</p>
      </div>
    );
  }

  const { status, statusType } = getStatusFromAnalysis(analysis);
  const timeType = getComplexityType(analysis.time_complexity.complexity);
  const spaceType = getComplexityType(analysis.space_complexity.complexity);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Analysis Results</h2>
        <span className={`${styles.statusBadge} ${styles[statusType]}`}>
          {status}
        </span>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Time Complexity</span>
          <span className={styles.metricValueLine}>
            <span className={styles[timeType]}>{analysis.time_complexity.complexity}</span>
          </span>
          <p className={styles.metricDesc}>{analysis.time_complexity.reason}</p>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Space Complexity</span>
          <span className={styles.metricValueLine}>
            <span className={styles[spaceType]}>{analysis.space_complexity.complexity}</span>
          </span>
          <p className={styles.metricDesc}>{analysis.space_complexity.reason}</p>
        </div>
      </div>

      {analysis.patterns.length > 0 && (
        <div className={styles.section}>
          <h3>Detected Patterns</h3>
          <div className={styles.tags}>
            {analysis.patterns.map((pattern, idx) => (
              <span key={idx} className={styles.tag}>{pattern.name}</span>
            ))}
          </div>
        </div>
      )}

      {analysis.bottlenecks.length > 0 && (
        <div className={styles.section}>
          <h3>Potential Bottlenecks</h3>
          {analysis.bottlenecks.map((b, idx) => (
            <div key={idx} className={styles.bottleneck}>
              <strong>{b.issue}</strong>
              <p>{b.impact}</p>
              <span className={styles.fix}>Fix: {b.fix}</span>
            </div>
          ))}
        </div>
      )}

      {analysis.suggestions.length > 0 && (
        <div className={styles.section}>
          <h3>Suggestions</h3>
          {analysis.suggestions.map((s, idx) => (
            <div key={idx} className={`${styles.suggestion} ${styles[s.priority]}`}>
              <strong>{s.suggestion}</strong>
              <p>{s.reason}</p>
            </div>
          ))}
        </div>
      )}

      <div className={styles.section}>
        <h3>Code Metrics</h3>
        <div className={styles.metricsRow}>
          <span>{analysis.metrics.code_lines} lines</span>
          <span>{analysis.metrics.functions} functions</span>
          <span>{analysis.metrics.loops} loops</span>
          <span>{analysis.metrics.conditionals} conditionals</span>
        </div>
      </div>
    </div>
  );
}
