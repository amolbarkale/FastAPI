from fastapi import APIRouter

router = APIRouter(prefix="/students", tags=["Students"])

@router.get("/")
def health_check():
    return {"message": "pong"}