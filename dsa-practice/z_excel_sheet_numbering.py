class solution: 
    def excel_to_int(self, string): 
        result = 0
        for char in s:
            result = result * 26 + (ord(char) - ord('A') + 1)
        return result

"""
why do i need to do ord(char) - ord('A') + 1

why cant i just do  result = result * 26 + ord(char)
Because ord('A') is 65, not 1.


ord('A')  → 65
ord('B')  → 66
ord('Z')  → 90
If you just use ord(char) directly:


# "A" should → 1
result = 0 * 26 + ord('A')
result = 0 * 26 + 65  → 65  ❌
You need A=1, B=2, Z=26. So you subtract the offset to shift it down:


ord('A') - ord('A') + 1  →  65 - 65 + 1  =  1  ✅
ord('B') - ord('A') + 1  →  66 - 65 + 1  =  2  ✅
ord('Z') - ord('A') + 1  →  90 - 65 + 1  =  26 ✅
"""