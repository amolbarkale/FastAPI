from fastapi import APIRouter

router = APIRouter(prefix="/professors", tags=["Professors"])

@router.get("/")
def health_check():
    return {"message": "pong"}