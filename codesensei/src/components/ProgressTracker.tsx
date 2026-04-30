import styles from "./ProgressTracker.module.css";

interface ProgressData {
  problems_solved?: number;
  current_streak?: number;
  total_attempts?: number;
}

export default function ProgressTracker({ data }: { data?: ProgressData }) {
  const problemsSolved = data?.problems_solved ?? 0;
  const currentStreak = data?.current_streak ?? 0;
  const totalAttempts = data?.total_attempts ?? 0;
  const missed = totalAttempts - problemsSolved;
  const progressPercent = Math.min(Math.round((problemsSolved / 100) * 100), 100);

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressHeader}>
        <span className={styles.progressValue}>{problemsSolved} Problems Solved</span>
        <span className={styles.progressTimeRemaining}>{currentStreak} day streak</span>
      </div>
      
      <div className={styles.progressBarWrapper}>
        <div 
          className={styles.progressBarFill} 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statBox}>
          <span className={styles.statValue}>{problemsSolved}</span>
          <span className={styles.statLabel}>Completed</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statValue}>{missed > 0 ? missed : 0}</span>
          <span className={styles.statLabel}>Missed</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statValue}>{currentStreak}</span>
          <span className={styles.statLabel}>Current Streak</span>
        </div>
      </div>
    </div>
  );
}
