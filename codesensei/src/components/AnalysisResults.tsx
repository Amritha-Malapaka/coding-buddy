"use client";

import styles from "./AnalysisResults.module.css";

interface AnalysisResultsProps {
  code: string;
  problem?: string;
}

interface AnalysisResult {
  status: string;
  statusType: "warning" | "success" | "error";
  timeComplexity: string;
  timeComplexityType: "good" | "warning" | "error";
  spaceComplexity: string;
  spaceComplexityType: "good" | "warning" | "error";
  timeDesc: string;
  spaceDesc: string;
  scalabilityTitle: string;
  scalabilityText: string;
  optimalTitle: string;
  optimalText: string;
}

function analyzeCode(code: string): AnalysisResult {
  const codeLower = code.toLowerCase();
  
  // Check for recursion patterns
  if (codeLower.includes("recursive") || code.includes("function") && code.includes("(") && code.split("(").length > 2) {
    return {
      status: "Recursive approach",
      statusType: "warning",
      timeComplexity: "O(2^N)",
      timeComplexityType: "error",
      spaceComplexity: "O(N)",
      spaceComplexityType: "warning",
      timeDesc: "Exponential time due to repeated calculations.",
      spaceDesc: "Call stack grows with recursion depth.",
      scalabilityTitle: "Stack Overflow Risk",
      scalabilityText: "Deep recursion may cause stack overflow for large inputs. Consider memoization or iterative approach.",
      optimalTitle: "Memoization (DP)",
      optimalText: "Cache intermediate results to avoid redundant calculations. Reduces time to O(N) with O(N) space.",
    };
  }
  
  // Check for nested loops
  if ((code.match(/for/g) || []).length >= 2 || (code.match(/while/g) || []).length >= 2) {
    return {
      status: "Works, but inefficient",
      statusType: "warning",
      timeComplexity: "O(N²)",
      timeComplexityType: "warning",
      spaceComplexity: "O(1)",
      spaceComplexityType: "good",
      timeDesc: "Nested loops iterate over elements multiple times.",
      spaceDesc: "No additional memory allocated for data structures.",
      scalabilityTitle: "Scalability Issues",
      scalabilityText: "This approach will time out for inputs larger than 10^4 elements. Consider more efficient algorithms.",
      optimalTitle: "Hash Map Optimization",
      optimalText: "Use a hash map to achieve O(1) lookups. Overall time complexity becomes O(N) with O(N) space trade-off.",
    };
  }
  
  // Check for sorting
  if (codeLower.includes("sort") || codeLower.includes("sorted")) {
    return {
      status: "Optimal sorting used",
      statusType: "success",
      timeComplexity: "O(N log N)",
      timeComplexityType: "good",
      spaceComplexity: "O(1) or O(N)",
      spaceComplexityType: "good",
      timeDesc: "Efficient comparison-based sorting algorithm.",
      spaceDesc: "Depends on sort implementation used.",
      scalabilityTitle: "Good Scalability",
      scalabilityText: "N log N complexity handles large datasets well. Consider if linear time is achievable.",
      optimalTitle: "Counting/Radix Sort",
      optimalText: "For integer ranges, O(N) sorting is possible. Only beneficial for very large datasets.",
    };
  }
  
  // Check for hash map usage
  if (codeLower.includes("map") || codeLower.includes("object") || codeLower.includes("set") || codeLower.includes("dict")) {
    return {
      status: "Optimal approach",
      statusType: "success",
      timeComplexity: "O(N)",
      timeComplexityType: "good",
      spaceComplexity: "O(N)",
      spaceComplexityType: "warning",
      timeDesc: "Single pass with O(1) hash map operations.",
      spaceDesc: "Hash map stores up to N elements.",
      scalabilityTitle: "Excellent Scalability",
      scalabilityText: "Linear time complexity handles millions of elements efficiently.",
      optimalTitle: "Space Optimization",
      optimalText: "If memory is constrained, consider two-pointer approach for O(1) space at O(N log N) time cost.",
    };
  }
  
  // Default single loop
  return {
    status: "Clean implementation",
    statusType: "success",
    timeComplexity: "O(N)",
    timeComplexityType: "good",
    spaceComplexity: "O(1)",
    spaceComplexityType: "good",
    timeDesc: "Single iteration over input data.",
    spaceDesc: "Constant extra space used.",
    scalabilityTitle: "Good Scalability",
    scalabilityText: "Linear time handles large inputs well. Verify no hidden complexity in utility functions.",
    optimalTitle: "Already Optimal",
    optimalText: "This approach is already optimal for most cases. Consider parallel processing for massive datasets.",
  };
}

export default function AnalysisResults({ code, problem }: AnalysisResultsProps) {
  const analysis = analyzeCode(code);
  
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Analysis Results</h2>
        <span className={`${styles.statusBadge} ${styles[analysis.statusType]}`}>
          {analysis.status}
        </span>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Time Complexity</span>
          <span className={styles.metricValueLine}>
            <span className={styles[analysis.timeComplexityType]}>{analysis.timeComplexity}</span>
          </span>
          <p className={styles.metricDesc}>{analysis.timeDesc}</p>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Space Complexity</span>
          <span className={styles.metricValueLine}>
            <span className={styles[analysis.spaceComplexityType]}>{analysis.spaceComplexity}</span>
          </span>
          <p className={styles.metricDesc}>{analysis.spaceDesc}</p>
        </div>
      </div>

      <div className={styles.section}>
        <h3>{analysis.scalabilityTitle}</h3>
        <p>{analysis.scalabilityText}</p>
      </div>

      <div className={styles.section}>
        <h3>{analysis.optimalTitle}</h3>
        <p>{analysis.optimalText}</p>
      </div>
    </div>
  );
}
