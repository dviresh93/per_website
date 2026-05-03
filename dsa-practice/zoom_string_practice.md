# String & Parsing Practice Problems
## Zoom Interview Prep — Diverse Problem Set

**How to use this:** Read the problem, look at the examples, try to code it yourself first.
Don't jump to the hint unless you're truly stuck. The goal is thinking, not memorizing.

---

## PROBLEM 1 — IP Address Validation
**Type:** String parsing (similar to Ada problem)

Write a function that returns `"IPv4"`, `"IPv6"`, or `"Neither"` depending on whether the input string is a valid IP address.

**IPv4 rules:**
- Exactly 4 parts separated by `.`
- Each part is a number from 0 to 255
- No leading zeros (e.g. `"01"` is invalid)

**IPv6 rules:**
- Exactly 8 parts separated by `:`
- Each part is 1–4 hex characters (0–9, a–f, A–F)
- Leading zeros are allowed

```
"192.168.1.1"          → "IPv4"
"256.168.1.1"          → "Neither"  (256 > 255)
"2001:0db8:85a3:0000:0000:8a2e:0370:7334"  → "IPv6"
"192.168.1.1.1"        → "Neither"  (5 parts)
"01.01.01.01"          → "Neither"  (leading zeros)
```

**Hint:** Split on `.` first. If you get 4 parts, validate as IPv4. Split on `:` — if 8 parts, validate as IPv6. Otherwise Neither.

---

## PROBLEM 2 — String Compression
**Type:** Simulation / counting

Compress a string by replacing consecutive repeated characters with the character followed by the count. If the compressed string is NOT shorter than the original, return the original.

```
"aabcccdddd"   → "a2bc3d4"
"abcd"         → "abcd"       (compressed = "a1b1c1d1", longer, return original)
"aaabbb"       → "a3b3"
"aaa"          → "a3"
```

**Hint:** Walk through the string, count consecutive characters. Build the result as you go. Compare lengths at the end.

---

## PROBLEM 3 — Valid Parentheses (Multiple Types)
**Type:** Stack

Given a string with `(`, `)`, `[`, `]`, `{`, `}` — return `True` if all brackets are correctly opened and closed in the right order.

```
"()"        → True
"()[]{}"    → True
"(]"        → False
"([)]"      → False
"{[]}"      → True
""          → True
```

**Hint:** Use a stack. Push opening brackets. When you see a closing bracket, check if the top of the stack is its matching opener. If not → False.

---

## PROBLEM 4 — First Unique Character
**Type:** HashMap / counting

Given a string, find the index of the first character that appears only once. If none exists, return -1.

```
"leetcode"   → 0   ('l' appears once, at index 0)
"loveleet"   → 2   ('v' appears once, at index 2)
"aabb"       → -1  (all characters repeat)
```

**Hint:** First pass — count frequency of each character using a dict. Second pass — return index of first character with count == 1.

---

## PROBLEM 5 — Longest Substring Without Repeating Characters
**Type:** Sliding window

Given a string, return the length of the longest substring that has no repeated characters.

```
"abcabcbb"   → 3   ("abc")
"bbbbb"      → 1   ("b")
"pwwkew"     → 3   ("wke")
"abcde"      → 5   (whole string)
```

**Hint:** Use two pointers (left, right). Expand right. If you see a repeated character, move left forward until no repeat. Track max length.

---

## PROBLEM 6 — Reverse Words in a String
**Type:** String manipulation

Given a string with words separated by spaces, reverse the order of the words. Remove any extra spaces (leading, trailing, or multiple spaces between words).

```
"the sky is blue"       → "blue is sky the"
"  hello world  "       → "world hello"
"a good   example"      → "example good a"
```

**Hint:** Split the string (Python's `.split()` handles multiple spaces automatically). Reverse the list. Join with single space.

---

## PROBLEM 7 — Roman to Integer
**Type:** HashMap + simulation

Convert a Roman numeral string to an integer.

```
I=1, V=5, X=10, L=50, C=100, D=500, M=1000
Special cases: IV=4, IX=9, XL=40, XC=90, CD=400, CM=900
```

```
"III"    → 3
"IV"     → 4
"IX"     → 9
"LVIII"  → 58   (L=50, V=5, III=3)
"MCMXCIV" → 1994
```

**Hint:** Walk left to right. If current value is less than next value, subtract it. Otherwise add it. (e.g. I before V means subtract 1)

---

## PROBLEM 8 — Simplify Unix Path
**Type:** Stack + string parsing

Given a Unix file path, simplify it.

Rules:
- `.` means current directory (ignore it)
- `..` means go up one directory (pop from stack)
- Multiple slashes `//` treated as one `/`
- Result always starts with `/`

```
"/home/"              → "/home"
"/home//foo/"         → "/home/foo"
"/home/user/../docs"  → "/home/docs"   (.. goes up from user)
"/../"                → "/"            (can't go above root)
"/a/./b/../../c/"     → "/c"
```

**Hint:** Split on `/`. Use a stack. Push directory names. On `..` pop if stack not empty. On `.` or empty string, skip. Join stack with `/` at end.

---

## PROBLEM 9 — Excel Column Number
**Type:** Math + strings

Excel columns are labeled A, B, ..., Z, AA, AB, ..., AZ, BA, ...
Convert a column label to its number.

```
"A"   → 1
"B"   → 2
"Z"   → 26
"AA"  → 27
"AB"  → 28
"ZY"  → 701
```

**Hint:** Think of it like base-26. Go left to right. For each character: `result = result * 26 + (char value)`. A=1, B=2, ..., Z=26.

---

## PROBLEM 10 — Decode String
**Type:** Stack (harder)

Given an encoded string like `"3[abc]"`, decode it to `"abcabcabc"`. Encodings can be nested.

```
"3[a]"          → "aaa"
"3[a]2[bc]"     → "aaabcbc"
"2[abc]3[cd]ef" → "abcabccdcdcdef"
"2[3[a]b]"      → "aaabaaab"   (nested)
```

**Hint:** Use a stack. When you see a number, push it. When you see `[`, push current string. When you see `]`, pop count and previous string, repeat current string count times and append to previous.

---

## QUICK REFERENCE — Pattern Recognition

| Problem type | Key signal in the question |
|---|---|
| Stack | brackets, nested structure, "valid", undo/redo |
| HashMap | "first", "unique", "frequency", "count" |
| Sliding window | "longest substring", "subarray", no repeats |
| Two pointers | sorted array, palindrome, "in-place" |
| String parsing | format validation, split by delimiter, rules |
| Simulation | "compress", "encode/decode", follow the steps |

---

*Practice tip: For each problem, before coding — write out in plain English what your approach is. If you can explain it clearly, the code will follow.*
