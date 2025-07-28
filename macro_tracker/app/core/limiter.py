from slowapi import Limiter
from slowapi.util import get_remote_address

# Create the shared limiter instance here
main_limiter = Limiter(key_func=get_remote_address)