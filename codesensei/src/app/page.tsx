import styles from "./page.module.css";
import SkillHeatmap from "@/components/SkillHeatmap";
import ProgressTracker from "@/components/ProgressTracker";

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Welcome back, Upcoming Dev</h1>
          <p className={styles.subtitle}>Here is your Code DNA and Progress.</p>
        </div>
        <button className={styles.primaryAction}>Start Next Challenge</button>
      </header>

      <div className={styles.gridContainer}>
        {/* Skill Heatmap section */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Skill Heatmap</h2>
            <p className={styles.insightText}>You struggle most with <strong>Graphs & DP</strong></p>
          </div>
          <div className={styles.cardBody}>
            <SkillHeatmap />
          </div>
        </section>

        {/* Progress Tracking section */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Goals & Milestones</h2>
            <p>Target: Crack interviews in 3 months</p>
          </div>
          <div className={styles.cardBody}>
            <ProgressTracker />
          </div>
        </section>

        {/* DNA Profile Insights */}
        <section className={`${styles.card} ${styles.fullWidthCard}`}>
          <div className={styles.cardHeader}>
            <h2>Code DNA Insights</h2>
          </div>
          <div className={styles.dnaInsights}>
            <div className={styles.insightItem}>
              <span className={styles.insightIcon}>🧠</span>
              <p>You tend to rely on <strong>brute force solutions</strong> for arrays.</p>
            </div>
            <div className={styles.insightItem}>
              <span className={styles.insightIcon}>⚠️</span>
              <p>You struggle with <strong>graph traversal problems</strong> under time pressure.</p>
            </div>
            <div className={styles.insightItem}>
              <span className={styles.insightIcon}>📈</span>
              <p>Great improvement in <strong>Dynamic Programming</strong> this week and consistency!</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
