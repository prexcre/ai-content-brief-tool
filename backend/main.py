from fastapi import FastAPI
from pydantic import BaseModel
import sys
sys.path.append("backend")
from src.main import generate_content_strategy
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],

)

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