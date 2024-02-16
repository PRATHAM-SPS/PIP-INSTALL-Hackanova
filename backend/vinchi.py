import google.generativeai as genai
import json
from IPython.display import Markdown

pf = f"""
Requirements:
5) Implement natural language processing (NLP) algorithms to analyze
social media and other communication channels for real-time information
about the disaster's impact on communities.

How should I implement this?
"""

model = genai.GenerativeModel('gemini-pro')
response = model.generate_content(pf)
# print(response.candidates)


json_string = json.dumps(response)
json_object = json.loads(json_string)

generated_text = json_object['choices'][0]['text'].strip()

print(generated_text)
#
# print(instructions)