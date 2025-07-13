from passlib.context import CryptContext

from jose import jwt, JWTError                 # JWT encode/decode
from datetime import datetime, timedelta


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    """Hash a plain-text password."""
    return pwd_context.hash(password)

def verify_password(plain_password:str, hashed_password:str) -> bool:
        """Verify a plain-text password against its hash."""
        return pwd_context.verify(plain_password, hashed_password) 

# ── JWT settings ──
SECRET_KEY = "SecretKey"         # ↩️ replace with a secure random string
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 3

def create_access_token(data: dict) -> str:
    """
    Create a JWT token with an expiration.
    `data` should include whatever you want in the payload (we’ll use "sub" and "role").
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# In-memory token revocation store
revoked_tokens = set()

def create_refresh_token(data: dict) -> str:
    return create_access_token(data, expires_delta=timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES))

def decode_access_token(token: str, verify_exp: bool = True) -> dict:
    options = {"verify_exp": verify_exp}
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options=options)


def revoke_token(token: str):
    revoked_tokens.add(token)

def is_token_revoked(token: str) -> bool:
    return token in revoked_tokens

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

