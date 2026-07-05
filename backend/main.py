from fastapi import FastAPI
from pydantic import BaseModel
import sys
sys.path.append("backend")
from src.main import generate_content_strategy
from typing import Optional

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Content Brief API is running"}

class UserInput(BaseModel):
    message: str
    previous_interaction_id: Optional[str] = None

@app.post("/strategy")
def get_strategy(user_input: UserInput):
    response, interaction_id = generate_content_strategy(
        message=user_input.message,
        previous_interaction_id=user_input.previous_interaction_id
    )
    return {"response": response, "interaction_id": interaction_id}