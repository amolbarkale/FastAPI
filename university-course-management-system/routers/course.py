from fastapi import APIRouter

router = APIRouter(prefix="/course", tags=["Courses"])

@router.get("/")
def health_check():
    return {"message": "pong"}