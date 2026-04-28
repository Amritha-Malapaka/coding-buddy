"use client";

import styles from "./page.module.css";
import ProgressTracker from "@/components/ProgressTracker";
import SkillHeatmap from "@/components/SkillHeatmap";

export default function ProgressPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Code DNA & Progress</h1>
        <p className={styles.subtitle}>Your personalized learning path and skill overview.</p>
      </header>

      <div className={styles.layout}>
        <div className={styles.leftColumn}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Goal: Interview Ready in 3 Months</h2>
              <button className={styles.editBtn}>Edit Goal</button>
            </div>
            <ProgressTracker />
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Skill Heatmap</h2>
            </div>
            <div className={styles.heatmapWrapper}>
              <SkillHeatmap />
            </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Recommended Resources</h2>
            </div>
            <div className={styles.resourceList}>
              <a href="#" className={styles.resourceItem}>
                <span className={styles.resourceIcon}>📖</span>
                <div className={styles.resourceContent}>
                  <h4>Graph Traversal Masterclass</h4>
                  <p>Interactive guide to BFS & DFS (Recommended based on heatmap)</p>
                </div>
              </a>
              <a href="#" className={styles.resourceItem}>
                <span className={styles.resourceIcon}>💻</span>
                <div className={styles.resourceContent}>
                  <h4>Practice: Number of Islands</h4>
                  <p>Medium problem to test your BFS skills</p>
                </div>
              </a>
              <a href="#" className={styles.resourceItem}>
                <span className={styles.resourceIcon}>🎥</span>
                <div className={styles.resourceContent}>
                  <h4>Dynamic Programming Walkthrough</h4>
                  <p>Video explanation of bottom-up approaches</p>
                </div>
              </a>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Code DNA Profile</h2>
              <span className={styles.badge}>Continuously Tracking</span>
            </div>
            <ul className={styles.dnaList}>
              <li>Preferred Approach: <strong className={styles.danger}>Brute Force ➔ Optimization</strong></li>
              <li>Weakness: <strong>Top-Down DP with Memoization</strong></li>
              <li>Strength: <strong>Array/String Manipulation (O(N) Time)</strong></li>
              <li>Time Management: <strong className={styles.warning}>Spends too much time on edge cases early on</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
