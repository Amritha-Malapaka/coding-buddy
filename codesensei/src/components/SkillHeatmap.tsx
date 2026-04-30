"use client";

import { useState, useMemo } from "react";
import styles from "./SkillHeatmap.module.css";

interface SkillData {
  [key: string]: { solved: number; total: number };
}

const defaultSkills: SkillData = {
  arrays: { solved: 0, total: 15 },
  graphs: { solved: 0, total: 10 },
  dynamic_programming: { solved: 0, total: 8 },
  trees: { solved: 0, total: 12 },
  sorting: { solved: 0, total: 6 },
};

const skillDisplayNames: { [key: string]: string } = {
  arrays: "Arrays",
  graphs: "Graphs",
  dynamic_programming: "DP",
  trees: "Trees",
  sorting: "Sorting",
};

const levelLabels = {
  strong: "Proficient",
  medium: "Developing",
  weak: "Needs Focus",
};

function getSkillLevel(ratio: number): "strong" | "medium" | "weak" {
  if (ratio >= 0.7) return "strong";
  if (ratio >= 0.4) return "medium";
  return "weak";
}

export default function SkillHeatmap({ data }: { data?: SkillData }) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  
  const skillData = data || defaultSkills;
  
  const skills = useMemo(() => {
    return Object.entries(skillData).map(([key, value]) => {
      const ratio = value.solved / value.total;
      return {
        key,
        name: skillDisplayNames[key] || key,
        solved: value.solved,
        total: value.total,
        ratio,
        level: getSkillLevel(ratio),
        frequency: Math.round(ratio * 100),
      };
    });
  }, [skillData]);

  return (
    <div className={styles.heatmapContainer}>
      {skills.map((skill) => (
        <div
          key={skill.key}
          className={`${styles.skillNode} ${styles[skill.level]}`}
          style={{
            width: `${Math.max(skill.frequency * 1.2, 70)}px`,
            height: `${Math.max(skill.frequency * 1.2, 70)}px`,
          }}
          onMouseEnter={() => setHoveredSkill(skill.key)}
          onMouseLeave={() => setHoveredSkill(null)}
        >
          <span className={styles.skillName}>{skill.name}</span>
          <div className={`${styles.tooltip} ${hoveredSkill === skill.key ? styles.tooltipVisible : ""}`}>
            <div className={styles.tooltipHeader}>{skill.name}</div>
            <div className={styles.tooltipLevel}>{levelLabels[skill.level]}</div>
            <div className={styles.tooltipStats}>
              {skill.solved} / {skill.total} solved
            </div>
            <div className={styles.tooltipProgress}>
              <div
                className={styles.tooltipProgressFill}
                style={{ width: `${skill.ratio * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
