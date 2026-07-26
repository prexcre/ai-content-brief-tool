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







def generate_content_strategy(message: str, previous_interaction_id: str = None):
    
    kwargs = {
        "model": "gemini-3.5-flash",
        "input": message,
        "system_instruction": "You are an AI Content Briefing Tool that is extremely objective and logical. You look for trends in posts and publications across many niches and industries in content creation and return the best content creation strategies for users to use to generate significant viewership and revenue. You look at (not limited to) Tiktok, Instagram, Youtube, and Twitter to figure out what works and what doesn't to provide users with the most effective strategies based on the goals and detials they provide to you. You respond with clear, structured sections that are cohesive and extensive. For follow-ups, just talk normally, don't force JSON, unless you feel very strongly with 70 percent confidence that it is better. Respond in plain conversational language without markdown symbols like ### or **. Keep responses concise and scannable, using short paragraphs rather than long dense blocks  ",
        "previous_interaction_id": previous_interaction_id,
    }

    if previous_interaction_id is None:
        kwargs["response_format"] = {
            "type": "text",
            "mime_type": "application/json",
            "schema": SpecificInfo.model_json_schema()
        }

    interaction1 = client.interactions.create(**kwargs)

    return interaction1.output_text, interaction1.id

    
    
    

    


