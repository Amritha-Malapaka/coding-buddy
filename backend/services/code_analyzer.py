"""
AST-based code analysis using tree-sitter
"""
import re
from typing import Dict, List, Any

class CodeAnalyzer:
    def __init__(self):
        # Heuristic-based analysis without tree-sitter for now
        # Can be upgraded to use tree-sitter later
        pass
    
    def analyze(self, code: str, problem: str) -> Dict[str, Any]:
        """Analyze code and return complexity metrics and suggestions"""
        
        analysis = {
            'time_complexity': self._detect_time_complexity(code),
            'space_complexity': self._detect_space_complexity(code),
            'patterns': self._detect_patterns(code),
            'bottlenecks': self._detect_bottlenecks(code),
            'suggestions': self._generate_suggestions(code, problem),
            'metrics': self._calculate_metrics(code)
        }
        
        return analysis
    
    def _detect_time_complexity(self, code: str) -> Dict[str, Any]:
        """Detect time complexity from code patterns"""
        code_lower = code.lower()
        
        # Check for nested loops
        nested_loops = len(re.findall(r'for\s+.*:\s*\n.*for\s+.*:', code)) + \
                      len(re.findall(r'while\s+.*:\s*\n.*(for|while)\s+.*:', code))
        
        # Check for recursion
        has_recursion = 'def ' in code and any(
            func_name in code.split('def ', 1)[1].split('(')[0] 
            for func_name in [code.split('def ', 1)[1].split('(')[0].strip()] 
            if len(code.split('def ', 1)) > 1
        ) if 'def ' in code else False
        
        # Check for sorting
        has_sort = any(x in code_lower for x in ['.sort()', 'sorted(', 'quicksort', 'mergesort'])
        
        # Check for binary search pattern
        has_binary_search = all(x in code_lower for x in ['while', 'left', 'right', 'mid'])
        
        if nested_loops >= 2 or (has_recursion and 'fib' not in code_lower):
            return {'complexity': 'O(N²) or worse', 'confidence': 'high', 'reason': 'Nested loops or recursion detected'}
        elif nested_loops == 1 or has_sort:
            return {'complexity': 'O(N log N)', 'confidence': 'medium', 'reason': 'Single loop with sorting or linear scan'}
        elif has_binary_search:
            return {'complexity': 'O(log N)', 'confidence': 'high', 'reason': 'Binary search pattern detected'}
        else:
            return {'complexity': 'O(N)', 'confidence': 'high', 'reason': 'Single pass through data'}
    
    def _detect_space_complexity(self, code: str) -> Dict[str, Any]:
        """Detect space complexity from code patterns"""
        code_lower = code.lower()
        
        # Check for data structures
        has_hash_map = any(x in code_lower for x in ['{}', 'dict', 'map', 'set', 'hash'])
        has_array = '[]' in code or 'list' in code_lower or 'array' in code_lower
        has_matrix = '[][]' in code or ('[' in code and code.count('[') > 2)
        
        if has_matrix:
            return {'complexity': 'O(N²)', 'confidence': 'medium', 'reason': '2D array/matrix storage'}
        elif has_hash_map:
            return {'complexity': 'O(N)', 'confidence': 'high', 'reason': 'Hash map for memoization or counting'}
        elif has_array:
            return {'complexity': 'O(N)', 'confidence': 'high', 'reason': 'Array storage for input/output'}
        else:
            return {'complexity': 'O(1)', 'confidence': 'high', 'reason': 'Constant extra space used'}
    
    def _detect_patterns(self, code: str) -> List[Dict[str, str]]:
        """Detect algorithmic patterns in code"""
        patterns = []
        code_lower = code.lower()
        
        if 'def ' in code:
            patterns.append({'name': 'Function-based', 'type': 'structure'})
        
        if any(x in code_lower for x in ['for ', 'while ']):
            patterns.append({'name': 'Iterative', 'type': 'approach'})
            
        if 'def ' in code and code.count('def ') > 1:
            patterns.append({'name': 'Helper Functions', 'type': 'structure'})
            
        if any(x in code_lower for x in ['dp', 'memo', 'cache', 'lru_cache']):
            patterns.append({'name': 'Memoization', 'type': 'optimization'})
            
        if any(x in code_lower for x in ['left', 'right', 'mid', 'binary']):
            patterns.append({'name': 'Binary Search', 'type': 'algorithm'})
            
        if any(x in code_lower for x in ['bfs', 'dfs', 'queue', 'stack', 'graph']):
            patterns.append({'name': 'Graph Traversal', 'type': 'algorithm'})
            
        return patterns
    
    def _detect_bottlenecks(self, code: str) -> List[Dict[str, str]]:
        """Detect potential performance bottlenecks"""
        bottlenecks = []
        code_lower = code.lower()
        
        # Check for string concatenation in loops
        if 'for' in code_lower and ('+=' in code or 'string' in code_lower):
            bottlenecks.append({
                'type': 'performance',
                'issue': 'String concatenation in loop',
                'impact': 'O(N²) string copying',
                'fix': 'Use list or StringBuilder instead'
            })
        
        # Check for repeated calculations
        if code_lower.count('len(') > 2 or code_lower.count('.length') > 2:
            bottlenecks.append({
                'type': 'performance',
                'issue': 'Repeated length calculations',
                'impact': 'Unnecessary function calls',
                'fix': 'Cache length in a variable'
            })
        
        # Check for inefficient list operations
        if 'insert(0' in code or 'pop(0' in code:
            bottlenecks.append({
                'type': 'performance',
                'issue': 'O(N) list operations',
                'impact': 'Shifting elements',
                'fix': 'Use deque for queue operations'
            })
        
        return bottlenecks
    
    def _generate_suggestions(self, code: str, problem: str) -> List[Dict[str, str]]:
        """Generate improvement suggestions based on code analysis"""
        suggestions = []
        code_lower = code.lower()
        
        # Check for error handling
        if 'try' not in code_lower and 'except' not in code_lower and 'if' not in code_lower:
            if 'input' in problem.lower() or 'array' in problem.lower():
                suggestions.append({
                    'priority': 'high',
                    'category': 'robustness',
                    'suggestion': 'Add input validation',
                    'reason': 'Edge cases like empty arrays not handled'
                })
        
        # Check for documentation
        if '"""' not in code and "'''" not in code and '//' not in code and '/*' not in code:
            suggestions.append({
                'priority': 'medium',
                'category': 'documentation',
                'suggestion': 'Add function docstring/comments',
                'reason': 'Complexity and intent not documented'
            })
        
        # Suggest better data structures
        if 'in list' in code_lower or 'in arr' in code_lower:
            suggestions.append({
                'priority': 'high',
                'category': 'optimization',
                'suggestion': 'Use hash set for O(1) lookups',
                'reason': 'Linear search is O(N) per lookup'
            })
        
        # Suggest early termination
        if 'return' in code and code.count('return') == 1 and 'for' in code_lower:
            suggestions.append({
                'priority': 'medium',
                'category': 'optimization',
                'suggestion': 'Consider early termination',
                'reason': 'May be able to return before loop completes'
            })
        
        return suggestions
    
    def _calculate_metrics(self, code: str) -> Dict[str, Any]:
        """Calculate code metrics"""
        lines = code.split('\n')
        non_empty = [l for l in lines if l.strip()]
        
        return {
            'total_lines': len(lines),
            'code_lines': len(non_empty),
            'functions': code.count('def '),
            'loops': code.count('for ') + code.count('while '),
            'conditionals': code.count('if ') + code.count('elif ')
        }
