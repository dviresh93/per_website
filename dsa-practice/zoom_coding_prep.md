# Zoom Coding Interview Preparation
**Interview Date: Tuesday**

---

## ✅ CONFIRMED ASKED IN ACTUAL ZOOM INTERVIEW

### Ada-Style Integer Validation (String Parsing)

**Source:** Confirmed asked in live Zoom interview (Product Engineer - Voice AI round)

**Problem:**
Determine whether a string is a valid integer in Ada-style representation. Two valid forms:

1. **Simple decimal** — digits 0-9 only, underscores allowed as separators (ignored)
2. **Based integer** — `{base}#{digits}#` where base is 2–16 (decimal), digits are valid for that base, underscores allowed

Digits 10–15 use `a–f` or `A–F`. Underscores can appear anywhere as separators and are ignored.

**Examples:**

```text
"123_456_789"      → true   (simple decimal)
"16#123abc#"       → true   (hex)
"10#123abc#"       → false  (a is invalid in base 10)
"10#10#123ABC#"    → false  (too many # groups)
"10#0#"            → true
"10##"             → false  (no digits between ##)
```

**Solution:**

```python
def solution(line):
    # Case 1: Simple decimal (no # present)
    if '#' not in line:
        clean = line.replace('_', '')
        return clean.isdigit() and len(clean) > 0

    # Case 2: Based integer — must be exactly base#digits#
    parts = line.split('#')
    if len(parts) != 3:
        return False

    base_part, digits_part, trailing = parts

    if trailing != '':  # nothing after last #
        return False

    # Parse base (decimal, underscores allowed)
    base_clean = base_part.replace('_', '')
    if not base_clean.isdigit() or len(base_clean) == 0:
        return False

    base = int(base_clean)
    if not (2 <= base <= 16):
        return False

    # At least one digit required
    digits_clean = digits_part.replace('_', '')
    if len(digits_clean) == 0:
        return False

    def is_valid_digit(c, b):
        if c.isdigit():
            return int(c) < b
        if c in 'abcdefABCDEF':
            return (ord(c.lower()) - ord('a') + 10) < b
        return False

    return all(is_valid_digit(c, base) for c in digits_clean)
```

**Key insight:** Split on `#` → must get exactly 3 parts `[base, digits, ""]`. Strip underscores from each part separately before validating.

**Complexity:** O(n) time, O(n) space

---

## 3-DAY PREP: QUESTION LIST

### FRIDAY/SATURDAY (8 problems)
1. Two Sum
2. Best Time to Buy and Sell Stock
3. Product of Array Except Self
4. Longest Substring Without Repeating Characters
5. Container With Most Water
6. 3Sum
7. Group Anagrams
8. LRU Cache **********************************************

### SUNDAY (8 problems)
9. Reverse Linked List ***************************************
10. Merge Two Sorted Lists
11. Copy List with Random Pointer
12. Delete Node in Linked List ********************************8
13. Invert Binary Tree
14. Maximum Depth of Binary Tree
15. Binary Tree Level Order Traversal
16. Binary Tree Right Side View

### MONDAY (6 problems)
17. Valid Parentheses
18. Maximum Subarray (Kadane's Algorithm)
19. Merge Intervals
20. Word Break
21. Lowest Common Ancestor of a Binary Search Tree
22. Serialize and Deserialize Binary Tree

---

## ZOOM-SPECIFIC QUESTIONS (Previously Asked)

### Arrays & Strings
1. Two Sum [1]
2. Move All Zeros to the Left (while maintaining order) [1]
3. Maximum Subarray (find contiguous subarray with largest sum) [1]
4. Merge Two Sorted Arrays in Decreasing Order [3, 7]
5. Valid Number (determine if string makes valid number) [1] ********************** HARD leetcode problem ***************************
6. Low and High Index of Key in Sorted Array (with duplicates) [1]   ************ almost got it but lets retry this
7. Arrange Even Numbers on Left, Odd on Right [2] ************ got the logic, need to code it out
8. Inversion Count in Array [3, 7] *********** HARD 
9. Lonely Number (element appearing once, others twice) [6] ******** this is a math problem, need to be solved using the xor approach 
10. Product of Array Except Self

### Linked Lists
12. Delete Node in Linked List (given key) [1]
13. Deep Copy Linked List with Random Pointer [1] *****************************
14. Random Node from Linked List [3, 7] 
15. Merge Two Sorted Lists
16. Binary Tree to Doubly Linked List (in-place) [3, 7]

### Binary Trees & BST
17. Invert Binary Tree (swap left/right children) [1]
18. Identical Binary Trees [1]
19. Right View of Binary Tree [3, 7]
20. Height of Binary Tree [3, 7]
21. Connect Nodes at Same Level [3, 7]
22. Lowest Common Ancestor in BST [3, 7]
23. Count Leaves in BST [3, 7]
24. Serialize and Deserialize Binary Tree/BST [3, 7]

### Stacks & Queues
29. Valid Parentheses [2]
30. Balanced Braces Combinations (for given N) [1]


### Dynamic Programming
25. Word Segmentation (can string be segmented into dictionary words) [1]
26. Longest Increasing Subsequence [6]
11. Delete Operation String Array (handle backspace character) [6]  ******* this a DP problem

### Graphs
27. Minimum Spanning Tree (connected, undirected, weighted graph) [1]
28. Word Ladder (transform one word to another) [6]


### Design & OOP
31. LRU Cache [1, 9]
32. Custom HashMap [2]
33. Caesar Cipher (encrypt/decrypt) [2]
34. Factory Pattern [2]
35. Singleton Class (without synchronized keyword) [2]

### Intervals
36. Merge Intervals (with start/end timestamps) [1]

### Math & Primes
37. Sum of All Primes (≤ n) [6]
38. Palindrome Check [6]

### System Design (Mentioned)
39. Design Scalable Video Conferencing System [2, 5, 6]
40. Design Chat System with Message Delivery Guarantees [5]
41. Design Notification System for 100M+ Users [5]
42. Design Load Balancing for Video Calls [3, 5, 7]

---

## KEY INTERVIEW INSIGHTS

### Format
- **Duration**: 45-60 minutes
- **Problems**: 1-2 LeetCode Medium problems
- **Platform**: Shared editor (CoderPad/HackerRank) or screen share
- **Recent Trend**: Questions are getting longer (20-30 lines) with many edge cases

### What Zoom Tests
- Arrays, Strings, Hash Maps (most common)
- Linked Lists, Trees, Graphs
- Clean code with edge case handling
- Time/space complexity analysis
- Clear communication and problem-solving process

### Online Assessment (if applicable)
- **Platform**: CodeSignal
- **Duration**: 75 minutes
- **Questions**: 4 problems
- **Difficulty**: Questions 1-2 are Medium; Questions 3-4 are Medium-Hard
- **Note**: Expect highly optimized solutions required

---

## INTERVIEW EXECUTION CHECKLIST

### First 5 Minutes (Clarify)
- [ ] Repeat problem in your own words
- [ ] Ask about edge cases (empty input, nulls, duplicates)
- [ ] Confirm input/output format
- [ ] Ask about constraints (array size, time limits)

### Next 5-10 Minutes (Plan)
- [ ] Think out loud about approach
- [ ] Discuss brute force first, then optimize
- [ ] Get interviewer buy-in before coding

### Next 20-25 Minutes (Code)
- [ ] Write clean, readable code
- [ ] Use meaningful variable names
- [ ] Handle edge cases as you code
- [ ] Narrate what you're doing

### Last 5-10 Minutes (Test & Optimize)
- [ ] Walk through 2-3 test cases
- [ ] State time complexity: O(?)
- [ ] State space complexity: O(?)
- [ ] Discuss optimizations if asked

---

## COMMON PATTERNS TO KNOW

| Pattern | When to Use | Example |
|---------|-------------|---------|
| HashMap | O(1) lookup, counting, grouping | Two Sum, LRU Cache |
| Two Pointers | Sorted array, pairs/triplets | 3Sum, Container With Water |
| Sliding Window | Substring, subarray problems | Longest Substring |
| Fast/Slow Pointer | Linked list cycle, middle | Cycle Detection |
| DFS/BFS | Tree/graph traversal | Level Order, Right View |
| Stack | Matching pairs, parsing | Valid Parentheses |
| Prefix Sum | Subarray sum problems | Product Except Self |

---

## TIME COMPLEXITIES QUICK REFERENCE

```
O(1)      - HashMap lookup, array access
O(log n)  - Binary search, balanced tree operations
O(n)      - Single pass through array/list
O(n log n)- Sorting, heap operations
O(n²)     - Nested loops (usually brute force)
```

---

## DAY-OF CHECKLIST (Tuesday)

### 30 Minutes Before
- [ ] Test camera/mic/internet
- [ ] Have water nearby
- [ ] Pull up a blank code editor to warm up
- [ ] Do ONE easy problem to warm up (Reverse String, Valid Palindrome)

### During Interview
- [ ] Be friendly and conversational
- [ ] Think out loud constantly
- [ ] If stuck for >2 min, ask for a hint
- [ ] Show enthusiasm for the problem

---

## REFERENCES

[1] Coding Interview. "Zoom Coding Interview Questions | (Updated 2025)." CodingInterview.com.  
https://www.codinginterview.com/guide/zoom-interview-questions/

[2] LeetCode Discuss. "Zoom Meeting | SDE-2 | Remote - Interview Experience." LeetCode.  
https://leetcode.com/discuss/interview-experience/3518828/Zoom-Meeting-or-SDE-2-or-Remote

[3] Interview Kickstart. "Zoom Interview Questions." InterviewKickstart.com. December 18, 2025.  
https://interviewkickstart.com/blogs/interview-questions/zoom-interview-questions

[4] AlgoMonster. "Zoom Interview Questions: What to Expect and How to Prepare." AlgoMonster.  
https://algo.monster/interview-guides/zoom

[5] Coding Interview. "Ace the Zoom Coding Interview | All You Need to Know." CodingInterview.com. August 5, 2025.  
https://www.codinginterview.com/guide/zoom-interview/

[6] AlgoDaily. "Zoom Interview Questions and Interview Process." AlgoDaily.com.  
https://algodaily.com/companies/zoom

[7] Interview Kickstart. "Zoom Interview Questions." (Additional context) InterviewKickstart.com. December 18, 2025.  
https://interviewkickstart.com/blogs/interview-questions/zoom-interview-questions

[8] Glassdoor. "Zoom Communications Software Engineer Interview Experience & Questions." Glassdoor.  
https://www.glassdoor.com/Interview/Zoom-Video-Communications-Software-Engineer-Interview-Questions-EI_IE924644.0,25_KO26,43.htm

[9] Interview Query. "Zoom Software Engineer Interview Guide." InterviewQuery.com. May 22, 2022.  
https://www.interviewquery.com/interview-guides/zoom-software-engineer

---

## ADDITIONAL RESOURCES

- **NeetCode 150**: Follow their roadmap for pattern-based learning
- **LeetCode Company Tag**: Filter by Zoom (requires Premium)
- **Visualizations**: Use visualgo.net for tree/graph algorithms
- **NeetCode YouTube**: Watch solution videos for specific problems

---

**Good luck with your interview! Focus on clear communication and showing your problem-solving process.**
