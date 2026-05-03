class solution: 
    def roman_to_int(self, s): 
        values = {
            'I': 1,
            'V': 5,
            'X': 10,
            'L': 50,
            'C': 100,
            'D': 500,
            'M': 1000
        }

        result = 0

        for i in range(len(s)): 
            cur = values[s[i]]

            if i+1 < len(s): 
                next = values[s[i+1]]
                if cur < next: 
                    result -= cur
                else: 
                    result += cur
            else: 
                result += cur
        return result

sol = solution()
print(sol.roman_to_int("III"))      # 3
print(sol.roman_to_int("IV"))       # 4
print(sol.roman_to_int("IX"))       # 9
print(sol.roman_to_int("LVIII"))    # 58
print(sol.roman_to_int("MCMXCIV")) # 1994