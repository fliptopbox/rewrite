import random
from datetime import datetime

# generates a 16 char UUID
def guid():
    hex_str = (hex(int(datetime.now().strftime('%Y%m%d%H%M%S%f')))[4:])
    alpha = hex(random.randint(10,15))[2:]
    return "%s%s" % (alpha, hex_str)


