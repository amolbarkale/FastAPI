import os
import time
import json
from fastapi import FastAPI, HTTPException
import openai
from pydantic import BaseModel

app = FastAPI(title="LLMOpsDemo", version="0.1")
MODEL_BACKEND= os.getenv("MODEL_BACKEND", "openai")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
print('OPENAI_API_KEY:', OPENAI_API_KEY)

class GenRequest(BaseModel):
    prompt: str
    max_tokens: int = 128
    temp: float = 0.0


@app.get("/")
def root():
    return {"mesage": "LLMOps API demo", "backend": MODEL_BACKEND}

@app.get("/health")
def health():
    return {"status": "healthy"}

async def _generate_openai(req: GenRequest):
    if not OPENAI_API_KEY:
        raise HTTPException(400, "OPEN_API_KEY required")

    open_api_key = OPENAI_API_KEY

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": req.prompt}],
            max_tokens = req.max_tokens,
            temperature= req.temperature
        )

        text = response["choices"][0]["message"]["content"]
        token_used = response.get("usage", {}).get("total_tokens", 0)

        return {"text": text, "backend": "openai", "token_used": token_used}

    except Exception as e:
        raise HTTPException(500, f"openAI error: {str(e)}")

@app.post("/generate")
async def generate(req: GenRequest):
    if MODEL_BACKEND == "openai":
        return await _generate_openai(req=req) 
    else:
        raise HTTPException(400, "Bad request received")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)