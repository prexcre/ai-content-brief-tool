from google import genai
from google.genai import types
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

purpose_model = "gemini-3.5-flash"
config = types.GenerateContentConfig(
    tools = [types.Tool(google_search=types.GoogleSearch())]
)



previous_interaction_id = None
while True:
    prompt = input("What would you like to know? ")
    if prompt.lower() == "nothing":
        break
    

    interaction1 = client.interactions.create(
        model="gemini-3.5-flash",
        input=prompt,
        previous_interaction_id=previous_interaction_id
        
    )
    print(interaction1.output_text)
    previous_interaction_id = interaction1.id

