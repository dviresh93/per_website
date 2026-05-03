class solution: 
    # "leetcode"   → 0   ('l' appears once, at index 0)
    # "loveleet"   → 2   ('v' appears once, at index 2)
    # "aabb"       → -1  (all characters repeat)

    def __init__(self): 
        self.uniq = {}

    
    def first_uniq(self, string): 
        for idx in range(len(string)): 
            if string[idx] not in self.uniq: 
                self.uniq[string[idx]] = idx 
            else: del self.uniq[string[idx]]
        # print(self.uniq)
        if not self.uniq: 
            return -1 
        
        min_idx = float("inf")
        for key, val in self.uniq.items(): 
            min_idx = min(val, min_idx)
        return min_idx 

sol =  solution()
print(sol.first_uniq("leetcode"))
sol =  solution()
print(sol.first_uniq("loveleet"))
sol =  solution()
print(sol.first_uniq("aabb"))
