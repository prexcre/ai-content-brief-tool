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


"""
response = client.models.generate_content(
    model = "gemini-2.5-flash",
    contents = "Who has scored the most goals in the 2026 World Cup as of right now?",
    config = config

)
print(response.text)

metadata = response.candidates[0].grounding_metadata
if metadata.web_search_queries:
    print("\nSearch queries executed: ")
    for query in metadata.web_search_queries:
        print(f" - {query}")

if metadata.grounding_chunks:
    print("\nSources: ")
    for chunk in metadata.grounding_chunks:
        print(f" - [{chunk.web.title}]({chunk.web.uri})")

"""

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

"""
    interaction2 = client.interactions.create(
        model = "gemini-3.5-flash",
        input = "How did this person become who they are? (short versrion)",
        previous_interaction_id=interaction1.id,

    )
print(interaction2.output_text) """