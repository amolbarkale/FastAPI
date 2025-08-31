from fastapi import FastAPI

app = FastAPI(title="FastAPI tutorial")

@app.get("/")
def hello_world():
    return {"data": {"name": "Hello world!"}}