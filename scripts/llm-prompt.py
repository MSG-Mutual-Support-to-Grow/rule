import requests
import json
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()
api_key = os.getenv("MISTRAL_API_KEY","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")

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
FRANZ
9092043143
KINGSTEIN N franzkingstein@gmail.com
Pannimadai, Coimbatore 641017
D A T A S C I E N T I S T franzkingstein.site
P R O F I L E
E D U C A T I O N
Aspiring Data Scientist with expertise in Machine Learning, 2023 - 2027
AI, and Data Analytics. Skilled in Python, SQL, and deep
KARUNYA INSTITUTE OF
learning frameworks like TensorFlow. Experienced in
TECHNOLOGY AND SCIENCE
computer vision, predictive modeling, and database
management. Passionate about solving real-world Bachelor of Technology, GPA: 9.62 / 10.0
problems using data-driven insights.
2021 - 2023
W O R K E X P E R I E N C E
STANES ANGLO INDIAN HIGHER
SECONDARY SCHOOL
JUNE 2024
Intern at Nandha Infotech
Higher Secondary
Computer Vision & Data Scientist
S K I L L S
Implemented deep learning models (CNN, ResNet,
Programming: Python, SQL, MongoDB
DenseNet, VGG16, YOLO, COCO) for disease
Machine Learning & AI: Deep Learning,
detection.
Optimized image classification through data TensorFlow, Computer Vision
augmentation. Data Engineering & Analytics: Tableau,
Skills Earned: MACHINE LEARNING, DEEP
Data Preprocessing
LEARNING, DOCUMENTATION, COMMUNICATION
Soft Skills: Effective Communication,
Solution-Oriented Thinking
P R O J E C T
R E S E A R C H
May 2024
Echonet Dynamics
MLCARE
Unique approach to identify heart
Developed a lung cancer prediction system using
disease
Random Forest for early detection.
Use ECG calibration and medical report
Integrated a Python-based GUI for a user-friendly
to identify Heart Disease
clinical decision support interface.
Skills Earned: Conference paper
Skill Gained: Medical knowledge, Research Paper
experience, Hybrid model development,
presentation, Machine Learning, Tkinter
Medical terms,documentation
September 2024
C.L.A.V.E - Smart India hackathon 2025
Designed a deep learning model combining CNN
and GRU to classify Micro-Doppler signals.
Extracted and analyzed spatial and temporal
features to improve accuracy.
Skills Gained: Micro Doppler signature knowledge,
Hybrid Model development, Leadership
"""

    result = call_mistral_resume_analyzer(resume_text, api_key)
    
    if result:
        print(json.dumps(result, indent=2))
