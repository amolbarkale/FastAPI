from slowapi import Limiter
from slowapi.util import get_remote_address

# Central rate limiter instance
limiter = Limiter(key_func=get_remote_address)
