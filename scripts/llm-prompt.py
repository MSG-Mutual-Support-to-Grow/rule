import requests
import json
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()
api_key = os.getenv("MISTRAL_API_KEY")

def call_mistral_resume_analyzer(resume_text, api_key):
    """
    Sends resume text to Mistral (via OpenRouter API) and returns structured JSON analysis.
    """

    prompt = f"""
You are a smart recruiter assistant AI.

Analyze the following resume text and extract the following information in valid JSON format:

- full_name (string)
- email (string)
- phone_number (string)
- total_experience_years (int)
- roles (list of {{title, company, years}})
- skills (dict: key=skill name, value={{"source": how skill was acquired, "years": if mentioned or estimated}})
- projects (list of {{name, tech_stack, description}})
- leadership_signals (bool)
- candidate_fit_summary (1–2 sentence summary of best role for candidate)

Return only JSON. Do not explain or add any text outside the JSON block.

Resume:
\"\"\"
{resume_text}
\"\"\"
"""

    headers = {
        "Authorization": f"Bearer {api_key}",
        "HTTP-Referer": "http://localhost",  # Replace with your frontend URL if needed
        "Content-Type": "application/json"
    }

    data = {
        "model": "mistralai/mistral-small-3.2-24b-instruct:free",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }

    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)

    if response.status_code == 200:
        try:
            raw = response.json()['choices'][0]['message']['content']
            return json.loads(raw)
        except Exception as e:
            print("[ERROR] Failed to parse JSON:", e)
            print("Raw response:", raw)
            return None
    else:
        print("[ERROR]", response.status_code, response.text)
        return None


# 👇 EXAMPLE USAGE 👇
if __name__ == "__main__":
    resume_text = """
    --- Page 1 ---
Ronnie A Jeffrey
ronnieallen2005@gmail.com (cid:211) +91 99528 60468 fl LinkedIn (cid:135) GitHub (cid:140) Portfolio
Education
• Karunya Institute of Technology, Coimbatore, India
B.Tech in Artificial Intelligence and Data Science May 2027
Experience
• Mobile App Developer Intern June 2024 – July 2024
Nandha Infotech, Coimbatore, India
– Worked on Flutter-based mobile apps with real-time API integration in the agriculture
domain.
• Full Stack and Mobile App Trainee Aug 2024 – Mar 2025
KIDS, Karunya University, Coimbatore, India
– Built dynamic web applications using React.js and Node.js; focused on UI/UX, REST    
APIs, and Mobile application with Flutter and database integration.
Skills
• Languages: Python, Java, C, Dart, JavaScript
• Frameworks/Tools: React.js, Tailwind CSS, ShadCN UI, Flask, FastAPI, TensorFlow,     
Keras, Scikit-learn, Git
• Domains: Data Analysis, Machine Learning, Full-Stack Development, Mobile App Develop-
ment, Generative AI
Projects
• Mindkraft’25 - Event Website (cid:135)
– Built a full-featured event site with auth and payments; used by 1000+ students for regis-
tration.
– TechStack: Django, React.js, Stripe API
• Water Potability Prediction Analysis (cid:135)
– Compared multiple ML models to predict water potability; best model achieved 92% ac- 
curacy.
– Contributed to SDG 6 and 13 for sustainable water and climate goals.
– TechStack: Django, React.js, ShadCN UI
• CropAI – Crop Recommendation & Yield Prediction API (cid:135)
– BuiltanML-poweredAPItorecommendbestcropsandpredictyieldbasedonsoil,climate,
and accurate values.
– Accuracy reached 88% for crop prediction using RandomForestClassifier.
– TechStack: Django, React.js, Scikit-learn
1

--- Page 2 ---
• Music Genre Classification with CNN (cid:135)
– Built a CNN model to classify music genres from raw audio files.
– Achieved 87% classification accuracy using MFCC features; deployed via Streamlit.    
– TechStack: Python, TensorFlow, Keras, Librosa
• Hoodigo - Frontend Website (cid:135)
– Created a stylish responsive frontend using modern UI/UX design patterns.
– Enhanced responsiveness and layout performance across mobile/desktop.
– TechStack: HTML, CSS, JavaScript, Bootstrap
Achievements & Hackathons
• Special Mention – Intel OneAPI India Hackathon 2024
Project: Patient Monitoring System for Hospitals (cid:135)
– Developed an AI-driven platform that allows hospitals to upload lab reports via admin
portal.
– System provides personalized AI recommendations for medicine, diet, and workouts.    
– Doctors can review and approve suggestions; patient app syncs real-time health notifica-
tions.
Certifications
• Google CyberSecurity Specialization Google, Jul 2024
• Data Analytics Internship YBI Foundation, Sep 2024
• CSS Skill Test HackerRank, Sep 2024
• Java Programming Fundamentals Infosys, Sep 2024
"""

    result = call_mistral_resume_analyzer(resume_text, api_key)
    
    if result:
        print(json.dumps(result, indent=2))
