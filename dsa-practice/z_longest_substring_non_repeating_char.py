from collections import deque
class solution: 
    def non_repeating_char(self, string): 
        # "abcabcbb"   → 3   ("abc")
        # "bbbbb"      → 1   ("b")
        # "pwwkew"     → 3   ("wke")
        # "abcde"      → 5   (whole string)

        q = deque()
        maxlen = 0

        for char in string: 
            while char in q: 
                q.popleft()
            q.append(char)
            maxlen = max(len(q), maxlen)
        return maxlen

sol = solution()
print(sol.non_repeating_char("abcabcbb"))
sol = solution()
print(sol.non_repeating_char("bbbbb"))
sol = solution()
print(sol.non_repeating_char("pwwkew"))
sol = solution()
print(sol.non_repeating_char("abcde"))
sol = solution()
print(sol.non_repeating_char("dvdf"))


        