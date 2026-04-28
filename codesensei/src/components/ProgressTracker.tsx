import styles from "./ProgressTracker.module.css";

export default function ProgressTracker() {
  const progressPercent = 65;

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressHeader}>
        <span className={styles.progressValue}>{progressPercent}% Complete</span>
        <span className={styles.progressTimeRemaining}>3 months left</span>
      </div>
      
      <div className={styles.progressBarWrapper}>
        <div 
          className={styles.progressBarFill} 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statBox}>
          <span className={styles.statValue}>42</span>
          <span className={styles.statLabel}>Completed</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statValue}>12</span>
          <span className={styles.statLabel}>Missed</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statValue}>8</span>
          <span className={styles.statLabel}>Current Streak</span>
        </div>
      </div>
    </div>
  );
}
