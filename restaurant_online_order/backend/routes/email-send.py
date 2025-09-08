from fastapi import BackgroundTasks, APIRouter
import time

router = APIRouter(prefix="/send-email")

def write_log(message: str):
    time.sleep(30)
    with open("log.txt", "a") as f:
        f.write(f"{message}\n")

@router.post("/")
async def notify_user(email: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(write_log, f"Notification sent to {email}")
    return {"message": f"Email will be sent to {email}"}