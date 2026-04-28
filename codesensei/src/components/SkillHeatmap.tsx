import styles from "./SkillHeatmap.module.css";

const skills = [
  { name: "Arrays", frequency: 80, level: "strong" },
  { name: "Strings", frequency: 65, level: "medium" },
  { name: "Trees", frequency: 45, level: "weak" },
  { name: "Graphs", frequency: 30, level: "weak" },
  { name: "DP", frequency: 70, level: "strong" },
  { name: "Backtracking", frequency: 40, level: "medium" },
];

export default function SkillHeatmap() {
  return (
    <div className={styles.heatmapContainer}>
      {skills.map((skill) => (
        <div 
          key={skill.name} 
          className={`${styles.bubble} ${styles[skill.level]}`}
          style={{ width: `${skill.frequency}%`, height: `${skill.frequency}%`, minWidth: "60px", minHeight: "60px", maxWidth: "120px", maxHeight: "120px" }}
        >
          <span className={styles.bubbleText}>{skill.name}</span>
        </div>
      ))}
    </div>
  );
}
