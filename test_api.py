#!/usr/bin/env python3
"""
Test script for the dynamic resume analysis with job description
"""

import requests
import json

# API endpoints
BASE_URL = "http://localhost:8000"
SAVE_JD_URL = f"{BASE_URL}/save-job-description/"
GET_JD_URL = f"{BASE_URL}/get-job-description/"
UPLOAD_RESUME_URL = f"{BASE_URL}/upload-resume/"
ANALYZE_WITH_JD_URL = f"{BASE_URL}/analyze-resume-with-job/"

# Test job description
test_job_description = {
    "job_description": "We are looking for a skilled JAVa developer with 3+ years of experience in FastAPI, React, and database systems. The candidate should have experience with AI/ML, REST APIs, and cloud deployment. Strong problem-solving skills and leadership experience preferred. Remote work available."
}

def test_workflow():
    """Test the complete dynamic workflow"""
    print("🚀 Testing Dynamic Resume Analysis Workflow")
    print("=" * 50)
    
    # Step 1: Save job description
    print("\n1️⃣ Saving Job Description...")
    try:
        response = requests.post(SAVE_JD_URL, json=test_job_description)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Job description saved successfully!")
        else:
            print("❌ Failed to save job description")
            return
    except Exception as e:
        print(f"❌ Error saving job description: {e}")
        return
    
    # Step 2: Get job description (verify it was saved)
    print("\n2️⃣ Verifying Saved Job Description...")
    try:
        response = requests.get(GET_JD_URL)
        print(f"Status: {response.status_code}")
        saved_jd = response.json()
        print(f"Saved JD: {saved_jd.get('job_description', 'Not found')[:100]}...")
        
        if response.status_code == 200:
            print("✅ Job description retrieved successfully!")
        else:
            print("❌ Failed to retrieve job description")
    except Exception as e:
        print(f"❌ Error retrieving job description: {e}")
    
    # Step 3: Test resume upload (would be dynamic now)
    print("\n3️⃣ Testing Resume Upload (Dynamic Analysis)...")
    print("📝 NOTE: This would analyze resume against the saved job description")
    print("📁 To test with actual resume, use:")
    print(f"   curl -X POST '{UPLOAD_RESUME_URL}' -F 'file=@your_resume.pdf'")
    
    # Step 4: Test combined endpoint
    print("\n4️⃣ Testing Combined Endpoint...")
    print("📝 NOTE: This endpoint accepts both resume file and job description")
    print(f"   curl -X POST '{ANALYZE_WITH_JD_URL}' -F 'file=@your_resume.pdf' -F 'job_description=Your job description here'")
    
    print("\n✅ Workflow test completed!")
    print("\n🔄 How the dynamic system works:")
    print("   1. Save job description → /save-job-description/")
    print("   2. Upload resume → /upload-resume/ (uses saved job description)")
    print("   3. AI analyzes resume against the job description")
    print("   4. Returns eligibility and fit analysis")

def test_endpoints():
    """Test individual endpoints"""
    print("\n🧪 Testing Individual Endpoints")
    print("=" * 30)
    
    # Test save job description
    print("\n📝 Testing Save Job Description...")
    try:
        response = requests.post(SAVE_JD_URL, json=test_job_description)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test get job description
    print("\n📖 Testing Get Job Description...")
    try:
        response = requests.get(GET_JD_URL)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🎯 Resume Parser Dynamic API Test")
    print("Make sure the backend server is running on http://localhost:8000")
    print()
    
    choice = input("Choose test (1=Full Workflow, 2=Individual Endpoints, 3=Both): ").strip()
    
    if choice == "1":
        test_workflow()
    elif choice == "2":
        test_endpoints()
    elif choice == "3":
        test_workflow()
        test_endpoints()
    else:
        print("Invalid choice. Running full workflow...")
        test_workflow()
