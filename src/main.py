from google import genai
from google.genai import types
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

purpose_model = "gemini-3.5-flash"




previous_interaction_id = None
while True:
    if previous_interaction_id is None:
        prompt = input("Tell me your goal, niche, and current platform stats: ")
    else:
        prompt = input("You: ")
        
    
    if prompt.lower() == "nothing":
        break
    

    interaction1 = client.interactions.create(
        model="gemini-3.5-flash",
        input=prompt,
        system_instruction="You are an AI Content Briefing Tool that is extremely objective and logical. You look for trends in posts and publications across many niches and industries in content creation and return the best content creation strategies for users to use to generate significant viewership and revenue. You look at (not limited to) Tiktok, Instagram, Youtube, and Twitter to figure out what works and what doesn't to provide users with the most effective strategies based on the goals and detials they provide to you. You respond with clear, strcutured sections that are cohesive and extensive.  ",

        previous_interaction_id=previous_interaction_id
        
    )
    print(interaction1.output_text)
    previous_interaction_id = interaction1.id

