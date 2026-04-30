import styles from "./page.module.css";
import SkillHeatmap from "@/components/SkillHeatmap";
import ProgressTracker from "@/components/ProgressTracker";

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Track your progress and identify areas for improvement.</p>
        </div>
        <button className={styles.primaryAction}>Start Next Challenge</button>
      </header>

      <div className={styles.gridContainer}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Skill Heatmap</h2>
              <p className={styles.cardSubtitle}>Focus areas: Graphs, Dynamic Programming</p>
            </div>
          </div>
          <div className={styles.cardBody}>
            <SkillHeatmap />
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Progress Overview</h2>
              <p className={styles.cardSubtitle}>Goal: Interview ready in 3 months</p>
            </div>
          </div>
          <div className={styles.cardBodySmall}>
            <ProgressTracker />
          </div>
        </section>

        <section className={`${styles.card} ${styles.fullWidthCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Analysis Insights</h2>
          </div>
          <div className={styles.dnaInsights}>
            <div className={`${styles.insightItem} ${styles.insightWarning}`}>
              <div className={styles.insightIndicator} />
              <div className={styles.insightContent}>
                <span className={styles.insightLabel}>Pattern Recognition</span>
                <p>You tend to rely on <strong>brute force solutions</strong> for array problems.</p>
              </div>
            </div>
            <div className={`${styles.insightItem} ${styles.insightError}`}>
              <div className={styles.insightIndicator} />
              <div className={styles.insightContent}>
                <span className={styles.insightLabel}>Time Pressure</span>
                <p>You struggle with <strong>graph traversal problems</strong> under time pressure.</p>
              </div>
            </div>
            <div className={`${styles.insightItem} ${styles.insightSuccess}`}>
              <div className={styles.insightIndicator} />
              <div className={styles.insightContent}>
                <span className={styles.insightLabel}>Improvement</span>
                <p>Great progress in <strong>Dynamic Programming</strong> this week.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
