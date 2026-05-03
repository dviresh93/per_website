class solution: 
    def compress_string(self, string): 
        if len(string) == 0:
            return 
        if len(string) == 1: 
            return string 
        lastword = string[0]
        output = ""
        count = 1
        for idx in range(1, len(string)):
            word =  string[idx]
            if lastword == word:
                count +=1 
            
            if word != lastword:     
                if count > 1: 
                    output += lastword + str(count) 
                else: 
                    output += lastword
                lastword = word
                count = 1
        if count > 1: 
            output += lastword + str(count) 
        else: 
            output += lastword
        # output += lastword + str(count)
        return output 



sol = solution()
print(sol.compress_string("aabcccdddd"))
sol = solution()
print(sol.compress_string("abcd"))
sol = solution()
print(sol.compress_string("aaabbb"))
sol = solution()
print(sol.compress_string("aaa"))


    # "aabcccdddd"   → "a2bc3d4"
    # "abcd"         → "abcd"       (compressed = "a1b1c1d1", longer, return original)
    # "aaabbb"       → "a3b3"
    # "aaa"          → "a3"