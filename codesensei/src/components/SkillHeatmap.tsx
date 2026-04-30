"use client";

import { useState } from "react";
import styles from "./SkillHeatmap.module.css";

interface Skill {
  name: string;
  frequency: number;
  level: "strong" | "medium" | "weak";
  solved: number;
  total: number;
}

const skills: Skill[] = [
  { name: "Arrays", frequency: 85, level: "strong", solved: 42, total: 50 },
  { name: "Strings", frequency: 72, level: "strong", solved: 36, total: 50 },
  { name: "Trees", frequency: 55, level: "medium", solved: 22, total: 40 },
  { name: "Graphs", frequency: 35, level: "weak", solved: 14, total: 40 },
  { name: "DP", frequency: 68, level: "medium", solved: 27, total: 40 },
  { name: "Backtracking", frequency: 45, level: "medium", solved: 18, total: 40 },
  { name: "Heaps", frequency: 30, level: "weak", solved: 12, total: 40 },
  { name: "Greedy", frequency: 60, level: "medium", solved: 24, total: 40 },
];

const levelLabels = {
  strong: "Proficient",
  medium: "Developing",
  weak: "Needs Focus",
};

export default function SkillHeatmap() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <div className={styles.heatmapContainer}>
      {skills.map((skill) => (
        <div
          key={skill.name}
          className={`${styles.skillNode} ${styles[skill.level]}`}
          style={{
            width: `${Math.max(skill.frequency * 1.2, 70)}px`,
            height: `${Math.max(skill.frequency * 1.2, 70)}px`,
          }}
          onMouseEnter={() => setHoveredSkill(skill.name)}
          onMouseLeave={() => setHoveredSkill(null)}
        >
          <span className={styles.skillName}>{skill.name}</span>
          <div className={`${styles.tooltip} ${hoveredSkill === skill.name ? styles.tooltipVisible : ""}`}>
            <div className={styles.tooltipHeader}>{skill.name}</div>
            <div className={styles.tooltipLevel}>{levelLabels[skill.level]}</div>
            <div className={styles.tooltipStats}>
              {skill.solved} / {skill.total} solved
            </div>
            <div className={styles.tooltipProgress}>
              <div
                className={styles.tooltipProgressFill}
                style={{ width: `${(skill.solved / skill.total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
