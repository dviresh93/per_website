class solution: 
    
    def validate_ip(self, address): 
        # "192.168.1.1"          → "IPv4"
        # "256.168.1.1"          → "Neither"  (256 > 255)
        # "2001:0db8:85a3:0000:0000:8a2e:0370:7334"  → "IPv6"
        # "192.168.1.1.1"        → "Neither"  (5 parts)
        # "01.01.01.01"          → "Neither"  (leading zeros)

        parts = address.split(".")

        if len(parts) == 4:
            # check for ipv4 rules
            for part in parts: 
                if (not part) or (len(part) > 1 and int(part[0]) == 0) or \
                    (not part.isdigit()) or (not 0 <= int(part) <=255): 
                    
                    return "neither"
            return "ipv4"
        
        parts = address.split(":")

        if len(parts) == 8: 
            # check for ipv6 rules
            for part in parts: 
                if not (1 <= len(part) <= 4):   # length must be 1 to 4
                    return "neither"
                try:
                    int(part, 16)               # must be valid hex
                except ValueError:
                    return "neither"
                return "ipv6"
        return "neither"

sol = solution()
print(sol.validate_ip("192.168.1.1"))
sol = solution()
print(sol.validate_ip("256.168.1.1"))
sol = solution()
print(sol.validate_ip("2001:0db8:85a3:0000:0000:8a2e:0370:7334"))
sol = solution()
print(sol.validate_ip("192.168.1.1.1"))
sol = solution()
print(sol.validate_ip("01.01.01.01")) 

