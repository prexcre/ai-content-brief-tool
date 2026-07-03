from google import genai
from google.genai import types
from dotenv import load_dotenv
import os
from pydantic import BaseModel, Field

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

class SpecificInfo(BaseModel):
    target_audience: str = Field(description="The users target audience. Who is this person trying to get to view their content. ")
    best_platform: str = Field(description="What platform is the user's main platform. You can eventually figure out what is the most effective based on their goals and current statistics. ")
    posting_frequency: str = Field(description="How many times did the user tell you they are posting a week. This is something that may possibly change depending on the info you provide them. ")
    content_angles: str = Field(description="The specific content approaches or hooks that resonate with an audience in a given niche. Basically the 'why would someone click on this' framing for a piece of content.")
    full_brief: str = Field(description="A comprehensive, in-depth content strategy brief covering all recommendations, growth tactics, competitor insights, and a detailed action plan based on everything the user has provided.")

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
        system_instruction="You are an AI Content Briefing Tool that is extremely objective and logical. You look for trends in posts and publications across many niches and industries in content creation and return the best content creation strategies for users to use to generate significant viewership and revenue. You look at (not limited to) Tiktok, Instagram, Youtube, and Twitter to figure out what works and what doesn't to provide users with the most effective strategies based on the goals and detials they provide to you. You respond with clear, structured sections that are cohesive and extensive.  ",

        previous_interaction_id=previous_interaction_id,
        response_format={
            "type": "text",
            "mime_type": "application/json",
            "schema": SpecificInfo.model_json_schema()
        }
        
    )
    print(interaction1.output_text)
    previous_interaction_id = interaction1.id

