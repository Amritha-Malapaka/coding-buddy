"""
Seed the database with code samples for mock interviews
"""
from app import app
from models import db, CodeSample

def seed_code_samples():
    """Populate code_samples table with interview problems"""
    
    samples = [
        {
            'title': 'Two Sum - Brute Force',
            'difficulty': 'easy',
            'language': 'python',
            'buggy_code': '''def two_sum(nums, target):
    # Check every pair
    for i in range(len(nums)):
        for j in range(len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []''',
            'issues': [
                {
                    'type': 'performance',
                    'description': 'Using nested loops results in O(n²) time complexity',
                    'keywords': ['nested', 'O(n²)', 'n²', 'quadratic', 'loop', 'inefficient', 'slow'],
                    'fix': 'Use hash map for O(n) time: store complement in dict as you iterate'
                },
                {
                    'type': 'logic',
                    'description': 'Allows same element to be used twice (i can equal j)',
                    'keywords': ['same element', 'i == j', 'duplicate', 'twice', 'same index'],
                    'fix': 'Check i != j before returning, or use single-pass hash approach'
                }
            ],
            'optimal_solution': '''def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []'''
        },
        {
            'title': 'Binary Search - Off-by-One',
            'difficulty': 'medium',
            'language': 'python',
            'buggy_code': '''def binary_search(arr, target):
    left, right = 0, len(arr)
    
    while left < right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid
    
    return -1''',
            'issues': [
                {
                    'type': 'logic',
                    'description': 'right is set to len(arr) which is out of bounds',
                    'keywords': ['out of bounds', 'len(arr)', 'index error', 'right bound', 'overflow'],
                    'fix': 'Set right = len(arr) - 1, and adjust loop condition to left <= right'
                },
                {
                    'type': 'performance',
                    'description': '(left + right) can overflow in some languages',
                    'keywords': ['overflow', 'mid calculation', 'integer overflow'],
                    'fix': 'Use left + (right - left) // 2 to prevent overflow'
                }
            ],
            'optimal_solution': '''def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1'''
        },
        {
            'title': 'Reverse Linked List - Memory Leak',
            'difficulty': 'medium',
            'language': 'python',
            'buggy_code': '''class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    if not head:
        return None
    
    new_head = head
    while head.next:
        temp = head.next
        head.next = head.next.next
        temp.next = new_head
        new_head = temp
    
    return new_head''',
            'issues': [
                {
                    'type': 'readability',
                    'description': 'Variable naming could be clearer (temp, new_head)',
                    'keywords': ['naming', 'variable names', 'clarity', 'readable'],
                    'fix': 'Use prev, curr, next_node for standard linked list reversal pattern'
                },
                {
                    'type': 'logic',
                    'description': 'Logic is correct but could be simplified with standard 3-pointer approach',
                    'keywords': ['simplify', 'pointer', 'approach', 'pattern'],
                    'fix': 'Use standard iterative: prev=None, curr=head, while curr: next=curr.next, curr.next=prev, prev=curr, curr=next'
                }
            ],
            'optimal_solution': '''def reverse_list(head):
    prev = None
    curr = head
    
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    
    return prev'''
        },
        {
            'title': 'Merge Intervals - Sorting Missing',
            'difficulty': 'medium',
            'language': 'python',
            'buggy_code': '''def merge_intervals(intervals):
    if not intervals:
        return []
    
    merged = [intervals[0]]
    
    for curr in intervals[1:]:
        last = merged[-1]
        
        if curr[0] <= last[1]:
            last[1] = max(last[1], curr[1])
        else:
            merged.append(curr)
    
    return merged''',
            'issues': [
                {
                    'type': 'logic',
                    'description': 'Intervals not sorted before merging - assumes input is sorted',
                    'keywords': ['sort', 'sorted', 'order', 'unsorted', 'assume'],
                    'fix': 'Sort intervals by start time: intervals.sort(key=lambda x: x[0])'
                },
                {
                    'type': 'edge_case',
                    'description': 'No handling of empty intervals or single interval',
                    'keywords': ['edge case', 'empty', 'single', 'input validation'],
                    'fix': 'Add validation and early returns for edge cases'
                }
            ],
            'optimal_solution': '''def merge_intervals(intervals):
    if not intervals:
        return []
    
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    
    for curr in intervals[1:]:
        last = merged[-1]
        
        if curr[0] <= last[1]:
            last[1] = max(last[1], curr[1])
        else:
            merged.append(curr)
    
    return merged'''
        },
        {
            'title': 'Valid Parentheses - Incomplete',
            'difficulty': 'easy',
            'language': 'python',
            'buggy_code': '''def is_valid(s):
    stack = []
    
    for char in s:
        if char in '([{':
            stack.append(char)
        else:
            if not stack:
                return False
            stack.pop()
    
    return len(stack) == 0''',
            'issues': [
                {
                    'type': 'logic',
                    'description': 'Does not check if closing bracket matches the most recent opening bracket',
                    'keywords': ['match', 'mismatch', 'pair', 'bracket', 'mismatched', 'wrong'],
                    'fix': 'Use dict mapping: pairs = {\")\": \"(\", \"]\": \"[\", \"}\": \"{\"} and check pairs[char] != stack.pop()'
                },
                {
                    'type': 'edge_case',
                    'description': 'No validation for invalid characters',
                    'keywords': ['invalid', 'character', 'validation', 'input'],
                    'fix': 'Add check for valid bracket characters only'
                }
            ],
            'optimal_solution': '''def is_valid(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    
    for char in s:
        if char in pairs:
            if not stack or stack.pop() != pairs[char]:
                return False
        else:
            stack.append(char)
    
    return len(stack) == 0'''
        },
        {
            'title': 'Fibonacci - Exponential Time',
            'difficulty': 'easy',
            'language': 'python',
            'buggy_code': '''def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)''',
            'issues': [
                {
                    'type': 'performance',
                    'description': 'Recursive solution without memoization - O(2^n) exponential time',
                    'keywords': ['exponential', 'O(2^n)', 'slow', 'inefficient', 'recursion', 'memoization'],
                    'fix': 'Use memoization with @lru_cache or iterative O(n) solution'
                },
                {
                    'type': 'performance',
                    'description': 'Redundant calculations - fib(n-2) calculated twice',
                    'keywords': ['redundant', 'duplicate', 'recalculate'],
                    'fix': 'Store previously computed values in a dictionary or list'
                },
                {
                    'type': 'edge_case',
                    'description': 'No validation for negative inputs',
                    'keywords': ['negative', 'input', 'validation', 'edge case'],
                    'fix': 'Add check: if n < 0: raise ValueError or return None'
                }
            ],
            'optimal_solution': '''def fibonacci(n):
    if n < 0:
        raise ValueError("n must be non-negative")
    if n <= 1:
        return n
    
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b'''
        },
        {
            'title': 'Max Subarray (Kadane) - Logic Error',
            'difficulty': 'medium',
            'language': 'python',
            'buggy_code': '''def max_subarray(nums):
    max_sum = 0
    current_sum = 0
    
    for num in nums:
        current_sum += num
        if current_sum > max_sum:
            max_sum = current_sum
        if current_sum < 0:
            current_sum = 0
    
    return max_sum''',
            'issues': [
                {
                    'type': 'edge_case',
                    'description': 'Returns 0 for arrays with all negative numbers - should return max negative',
                    'keywords': ['negative', 'all negative', 'zero', 'wrong answer', 'edge case'],
                    'fix': 'Initialize max_sum = float(\'-inf\') or nums[0] instead of 0'
                },
                {
                    'type': 'logic',
                    'description': 'Resetting to 0 after finding max could miss later larger sums',
                    'keywords': ['reset', 'resetting', 'logic', 'order'],
                    'fix': 'Check and update max_sum before resetting: max_sum = max(max_sum, current_sum), then if current_sum < 0: current_sum = 0'
                }
            ],
            'optimal_solution': '''def max_subarray(nums):
    max_sum = nums[0]
    current_sum = nums[0]
    
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    
    return max_sum'''
        },
        {
            'title': 'Number of Islands - DFS Stack Overflow',
            'difficulty': 'medium',
            'language': 'python',
            'buggy_code': '''def num_islands(grid):
    if not grid:
        return 0
    
    count = 0
    rows, cols = len(grid), len(grid[0])
    
    def dfs(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] == '0':
            return
        grid[r][c] = '0'
        dfs(r+1, c)
        dfs(r-1, c)
        dfs(r, c+1)
        dfs(r, c-1)
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    
    return count''',
            'issues': [
                {
                    'type': 'performance',
                    'description': 'Recursive DFS can cause stack overflow on large grids',
                    'keywords': ['stack overflow', 'recursion', 'deep', 'large', 'memory'],
                    'fix': 'Use iterative DFS with explicit stack or BFS with queue'
                },
                {
                    'type': 'mutability',
                    'description': 'Modifies input grid - side effect may cause bugs',
                    'keywords': ['mutates', 'modifies', 'input', 'side effect', 'in-place'],
                    'fix': 'Use visited set instead of modifying grid, or clone grid first'
                }
            ],
            'optimal_solution': '''def num_islands(grid):
    if not grid:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    visited = set()
    
    def bfs(r, c):
        queue = [(r, c)]
        visited.add((r, c))
        
        while queue:
            cr, cc = queue.pop(0)
            for dr, dc in [(1,0), (-1,0), (0,1), (0,-1)]:
                nr, nc = cr + dr, cc + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1' and (nr, nc) not in visited:
                    visited.add((nr, nc))
                    queue.append((nr, nc))
    
    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1' and (r, c) not in visited:
                count += 1
                bfs(r, c)
    
    return count'''
        },
        {
            'title': 'LRU Cache - No TTL Handling',
            'difficulty': 'hard',
            'language': 'python',
            'buggy_code': '''class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}
        self.order = []
    
    def get(self, key):
        if key in self.cache:
            self.order.remove(key)
            self.order.append(key)
            return self.cache[key]
        return -1
    
    def put(self, key, value):
        if key in self.cache:
            self.order.remove(key)
        elif len(self.cache) >= self.capacity:
            lru = self.order.pop(0)
            del self.cache[lru]
        
        self.cache[key] = value
        self.order.append(key)''',
            'issues': [
                {
                    'type': 'performance',
                    'description': 'list.remove() and list.pop(0) are O(n) operations',
                    'keywords': ['O(n)', 'linear', 'slow', 'list', 'remove', 'pop(0)'],
                    'fix': 'Use OrderedDict from collections or combine dict with doubly-linked list for O(1) operations'
                },
                {
                    'type': 'structure',
                    'description': 'Manual list management is error-prone and verbose',
                    'keywords': ['verbose', 'manual', 'error-prone', 'complex'],
                    'fix': 'from collections import OrderedDict - use move_to_end and popitem(last=False)'
                }
            ],
            'optimal_solution': '''from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = OrderedDict()
    
    def get(self, key):
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]
    
    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)'''
        },
        {
            'title': 'Group Anagrams - Hash Key Issue',
            'difficulty': 'medium',
            'language': 'python',
            'buggy_code': '''def group_anagrams(strs):
    groups = {}
    
    for s in strs:
        key = ''.join(sorted(s))
        if key not in groups:
            groups[key] = []
        groups[key].append(s)
    
    return list(groups.values())''',
            'issues': [
                {
                    'type': 'performance',
                    'description': 'Sorting each string is O(k log k) per string',
                    'keywords': ['sort', 'O(k log k)', 'slow', 'sorting', 'inefficient'],
                    'fix': 'Use character count tuple as key: tuple(sorted(Counter(s).items()))'
                },
                {
                    'type': 'edge_case',
                    'description': 'No handling of empty strings or None input',
                    'keywords': ['empty', 'None', 'null', 'validation', 'edge case'],
                    'fix': 'Add: if not strs: return [] and handle None'
                },
                {
                    'type': 'readability',
                    'description': 'Can use defaultdict to simplify logic',
                    'keywords': ['defaultdict', 'simplify', 'cleaner', 'collections'],
                    'fix': 'from collections import defaultdict; groups = defaultdict(list)'
                }
            ],
            'optimal_solution': '''from collections import defaultdict

def group_anagrams(strs):
    if not strs:
        return []
    
    groups = defaultdict(list)
    
    for s in strs:
        count = [0] * 26
        for c in s:
            count[ord(c) - ord('a')] += 1
        groups[tuple(count)].append(s)
    
    return list(groups.values())'''
        }
    ]
    
    with app.app_context():
        # Clear existing
        CodeSample.query.delete()
        
        # Add new samples
        for sample_data in samples:
            sample = CodeSample(**sample_data)
            db.session.add(sample)
        
        db.session.commit()
        print(f"Seeded {len(samples)} code samples")

if __name__ == '__main__':
    seed_code_samples()
