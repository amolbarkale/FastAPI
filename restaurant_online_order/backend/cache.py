import json
import redis.asyncio as redis
from typing import Any

REDIS_URL = "redis://localhost:6379/0"

redis_client = redis.from_url(REDIS_URL, decode_responses=True)

CACHE_TTL = 3600

def make_key(prefix: str, **kwargs) -> str:
    parts = [prefix] + [f"{k}={kwargs[k]}" for k in sorted(kwargs) if kwargs[k] is not None]
    return "|".join(parts)

async def get_cache(key: str):
    cached = await redis_client.get(key)
    if cached:
        try:
            return json.loads(cached)   # ✅ will now always give list/dict, not string
        except json.JSONDecodeError:
            return None
    return None

async def set_cache(key: str, value: Any, ttl: int = CACHE_TTL) -> None:
    # ✅ Always serialize dicts/lists
    await redis_client.setex(key, ttl, json.dumps(value, default=str))

# versioning helpers
async def get_version(name: str) -> int:
    v = await redis_client.get(f"version:{name}")
    return int(v) if v else 1

async def bump_version(name: str) -> int:
    return await redis_client.incr(f"version:{name}")
