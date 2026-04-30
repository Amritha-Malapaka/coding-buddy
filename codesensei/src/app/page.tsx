"use client";

import styles from "./page.module.css";
import SkillHeatmap from "@/components/SkillHeatmap";
import ProgressTracker from "@/components/ProgressTracker";
import { progressApi } from "@/lib/api";
import { useProgress } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const { data: progress, loading, error, refetch } = useProgress();
  const [completing, setCompleting] = useState(false);

  const handleStartChallenge = async () => {
    setCompleting(true);
    try {
      await progressApi.completeChallenge(1);
      await refetch();
      router.push('/analyze');
    } catch (err) {
      console.error('Failed to start challenge:', err);
      router.push('/analyze');
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Track your progress and identify areas for improvement.</p>
        </div>
        <button 
          className={styles.primaryAction} 
          onClick={handleStartChallenge}
          disabled={completing}
        >
          {completing ? 'Starting...' : 'Start Next Challenge'}
        </button>
      </header>

      {loading && (
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Loading progress...</p>
        </div>
      )}
      
      {error && (
        <div className={styles.errorState}>
          <p>Failed to load progress. Please refresh the page.</p>
          <button onClick={refetch} className={styles.retryBtn}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <div className={styles.gridContainer}>
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>Skill Heatmap</h2>
                <p className={styles.cardSubtitle}>
                  {progress?.skill_data && Object.keys(progress.skill_data).length > 0 
                    ? 'Track your skill development across categories' 
                    : 'Complete challenges to build your skills'}
                </p>
              </div>
            </div>
            <div className={styles.cardBody}>
              <SkillHeatmap data={progress?.skill_data} />
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
              <ProgressTracker data={progress || undefined} />
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
      )}
    </div>
  );
}
