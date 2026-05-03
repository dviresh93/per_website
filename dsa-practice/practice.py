# // [({})]][

# // [({

 
def validParan(pattern): 
    
    pmap = {
        ")" : "(", 
        "]" : "[", 
        "}" : "{"
    }
    stack = []

    for p in pattern: 
        if not stack or p not in pmap: 
            stack.append(p)
        elif  stack[-1] == pmap[p]: 
            stack.pop()
    
    if not stack: 
        return True 
    else: 
        return False 
        


print(validParan("[({})]]["))
print(validParan("[({})]"))
print(validParan("[]"))
print(validParan("]["))