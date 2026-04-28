import styles from "./AnalysisResults.module.css";

export default function AnalysisResults() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>Analysis Results</h2>
        <span className={styles.statusBadge}>Works, but inefficient</span>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Time Complexity</span>
          <span className={styles.metricValueLine}>
            <span className={styles.complexityWarning}>O(N²)</span>
          </span>
          <p className={styles.metricDesc}>Nested loops iterate over the array twice.</p>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Space Complexity</span>
          <span className={styles.metricValueLine}>
            <span className={styles.complexityGood}>O(1)</span>
          </span>
          <p className={styles.metricDesc}>No extra scalable memory is used.</p>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Scalability Issues</h3>
        <p>This approach will time out for inputs larger than 10^4 elements. It represents a brute-force approach.</p>
      </div>

      <div className={styles.section}>
        <h3>Optimal Approach</h3>
        <p><strong>Hash Map (O(N) Time)</strong></p>
        <p>Store the differences (target - current) in a hash map as you iterate. You can find the complement in O(1) time.</p>
      </div>
    </div>
  );
}
