import asyncio
import time
from fastapi import FastAPI
from pydantic import BaseModel
import sys
sys.path.append("backend")
from src.main import generate_content_strategy
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://ai-content-brief-tool-ids4ee5m2-prexcre.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

request_lock = asyncio.Lock()
last_request_time = 0
MIN_SECONDS_BETWEEN_REQUESTS = 12

@app.get("/")
def read_root():
    return {"message": "Content Brief API is running"}

class UserInput(BaseModel):
    message: str
    previous_interaction_id: Optional[str] = None

@app.post("/strategy")
async def get_strategy(user_input: UserInput):
    global last_request_time

    async with request_lock:
        elapsed = time.time() - last_request_time
        if elapsed < MIN_SECONDS_BETWEEN_REQUESTS:
            await asyncio.sleep(MIN_SECONDS_BETWEEN_REQUESTS - elapsed)
        last_request_time = time.time()

    response, interaction_id = generate_content_strategy(
        message=user_input.message,
        previous_interaction_id=user_input.previous_interaction_id
    )
    return {"response": response, "interaction_id": interaction_id}