class Solution: 
    def __init__(self): 
        self.HEX_ALLOWED = '0123456789abcdef'
    def check_valid_string(self, chk_str): 
        
        if "#" not in chk_str: 
            number = chk_str.replace("_", "")
            return number.isdigit()

        parts = chk_str.split("#")
        if parts[2] != "" or len(parts) != 3: 
            return False 

        basestr = parts[0].replace("_", "")
        number_str = parts[1].replace("_", "")

        if not basestr.isdigit() or number_str.isdigit(): 
            return False 
        
        base = int(basestr)
        if not 2 <= base <= 16: 
            return False 

        allowed = self.HEX_ALLOWED[:base]

        for n in number_str: 
            if n.lower() not in allowed: 
                return False
        return True 
        

        