"use client";

import styles from "./page.module.css";
import ProgressTracker from "@/components/ProgressTracker";
import SkillHeatmap from "@/components/SkillHeatmap";

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

const CodeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const VideoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m22 8-6 4 6 4V8Z" />
    <rect x="2" y="6" width="14" height="12" rx="2" />
  </svg>
);

export default function ProgressPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Progress Overview</h1>
          <p className={styles.subtitle}>Your learning path and skill development.</p>
        </div>
      </header>

      <div className={styles.layout}>
        <div className={styles.leftColumn}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>Learning Goal</h2>
                <p className={styles.cardSubtitle}>Interview ready in 3 months</p>
              </div>
              <button className={styles.editBtn}>Edit</button>
            </div>
            <ProgressTracker />
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Skill Distribution</h2>
            </div>
            <div className={styles.heatmapWrapper}>
              <SkillHeatmap />
            </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Recommended Resources</h2>
            </div>
            <div className={styles.resourceList}>
              <a href="#" className={styles.resourceItem}>
                <span className={styles.resourceIcon}><BookIcon /></span>
                <div className={styles.resourceContent}>
                  <h4>Graph Traversal Masterclass</h4>
                  <p>Interactive guide to BFS and DFS algorithms</p>
                </div>
              </a>
              <a href="#" className={styles.resourceItem}>
                <span className={styles.resourceIcon}><CodeIcon /></span>
                <div className={styles.resourceContent}>
                  <h4>Practice: Number of Islands</h4>
                  <p>Medium difficulty BFS problem</p>
                </div>
              </a>
              <a href="#" className={styles.resourceItem}>
                <span className={styles.resourceIcon}><VideoIcon /></span>
                <div className={styles.resourceContent}>
                  <h4>Dynamic Programming Walkthrough</h4>
                  <p>Bottom-up approach techniques</p>
                </div>
              </a>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Analysis Profile</h2>
              <span className={styles.badge}>Tracking</span>
            </div>
            <ul className={styles.dnaList}>
              <li>
                <span className={styles.dnaLabel}>Approach Pattern</span>
                <span className={styles.dnaValue}>Iterative refinement</span>
              </li>
              <li>
                <span className={styles.dnaLabel}>Focus Area</span>
                <span className={`${styles.dnaValue} ${styles.dnaWarning}`}>Graph algorithms</span>
              </li>
              <li>
                <span className={styles.dnaLabel}>Strength</span>
                <span className={`${styles.dnaValue} ${styles.dnaSuccess}`}>Array manipulation</span>
              </li>
              <li>
                <span className={styles.dnaLabel}>Time Management</span>
                <span className={`${styles.dnaValue} ${styles.dnaWarning}`}>Edge case planning</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
