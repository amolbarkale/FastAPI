from fastapi import FastAPI

api = FastAPI()
# GET, POST, PUT, DELETE

@api.get("/")
async def get_blog():
    return {"message": "Hello World"}