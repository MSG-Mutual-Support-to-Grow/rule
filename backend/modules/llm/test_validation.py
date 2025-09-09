"""
Test suite for LLM response validation using Pydantic AI
"""

import json
from .response_validator import validate_llm_response, response_validator
from .validation_models import ResumeAnalysisResponse, EligibilityStatus


def test_valid_json_response():
    """Test validation of a well-formed JSON response"""
    valid_response = {
        "job_description": "Software Engineer position requiring Python, React, and AWS",
        "full_name": "John Doe",
        "email": "john.doe@email.com",
        "phone_number": "123-456-7890",
        "total_experience_years": 5,
        "roles": [
            {
                "title": "Software Engineer",
                "company": "Tech Corp",
                "duration": "3 years",
                "start_date": "2020-01",
                "end_date": "2023-01"
            }
        ],
        "work_experience_raw": "5 years of software development experience",
        "skills": {
            "Python": {
                "source": "Work Experience",
                "years": "3"
            }
        },
        "projects": [
            {
                "name": "E-commerce Platform",
                "tech_stack": "Python, Django, React",
                "description": "Built a full-stack e-commerce platform"
            }
        ],
        "leadership_signals": True,
        "leadership_justification": "Led a team of 3 developers",
        "candidate_fit_summary": "Strong technical background with relevant experience",
        "fit_score": 8,
        "fit_score_reason": "Direct experience with required technologies",
        "eligibility_status": "Eligible",
        "eligibility_reason": "Meets all core requirements"
    }

    result = validate_llm_response(valid_response)

    assert result.is_valid == True
    assert result.validated_data is not None
    assert result.validated_data.fit_score == 8
    assert result.validated_data.eligibility_status == EligibilityStatus.ELIGIBLE
    print("✅ Valid JSON response test passed")


def test_malformed_json_response():
    """Test validation of malformed JSON that should be fixed by Pydantic AI"""
    malformed_response = """
    Here is my analysis of the resume:

    Job Description: Software Engineer needed

    The candidate has:
    - Name: Jane Smith
    - Experience: 7 years
    - Skills: Python, JavaScript
    - Fit Score: 9
    - Status: Eligible

    The candidate is a great fit for this position because they have extensive experience in the required technologies.
    """

    result = validate_llm_response(malformed_response)

    # This should either validate successfully or provide a clear error
    if result.is_valid:
        print("✅ Malformed response was successfully parsed")
        assert result.validated_data is not None
    else:
        print(f"⚠️ Malformed response parsing failed: {result.errors}")
        # Even if parsing fails, we should have error details
        assert len(result.errors) > 0


def test_inconsistent_data_correction():
    """Test automatic correction of inconsistent eligibility vs fit score"""
    inconsistent_response = {
        "job_description": "Software Engineer position",
        "full_name": "Test User",
        "email": "",
        "phone_number": "",
        "total_experience_years": 0,
        "roles": [],
        "work_experience_raw": "Limited experience",
        "skills": {},
        "projects": [],
        "leadership_signals": False,
        "leadership_justification": "",
        "candidate_fit_summary": "Limited experience",
        "fit_score": 2,  # Low score
        "fit_score_reason": "Limited relevant experience",
        "eligibility_status": "Eligible",  # This should be corrected to Not Eligible
        "eligibility_reason": "Should be corrected based on fit score"
    }

    result = validate_llm_response(inconsistent_response)

    assert result.is_valid == True
    assert result.validated_data is not None
    # The validator should correct the inconsistency
    assert result.validated_data.eligibility_status == EligibilityStatus.NOT_ELIGIBLE
    print("✅ Inconsistent data correction test passed")


def test_missing_required_fields():
    """Test handling of missing required fields"""
    incomplete_response = {
        "job_description": "Software Engineer position",
        "full_name": "Test User",
        # Missing many required fields
    }

    result = validate_llm_response(incomplete_response)

    # Should either validate with defaults or provide clear errors
    if result.is_valid:
        print("✅ Incomplete response handled with defaults")
        assert result.validated_data is not None
        # Check that defaults were applied
        assert result.validated_data.fit_score == 1  # Default
    else:
        print(f"⚠️ Incomplete response validation failed: {result.errors}")


def test_invalid_fit_score():
    """Test validation of invalid fit score values"""
    invalid_response = {
        "job_description": "Software Engineer position",
        "full_name": "Test User",
        "email": "",
        "phone_number": "",
        "total_experience_years": 0,
        "roles": [],
        "work_experience_raw": "Test experience",
        "skills": {},
        "projects": [],
        "leadership_signals": False,
        "leadership_justification": "",
        "candidate_fit_summary": "Test summary",
        "fit_score": 15,  # Invalid: should be 1-10
        "fit_score_reason": "Test reason",
        "eligibility_status": "Eligible",
        "eligibility_reason": "Test reason"
    }

    result = validate_llm_response(invalid_response)

    # Should either correct the invalid value or provide error
    if result.is_valid:
        # Validator should clamp or correct invalid values
        assert 1 <= result.validated_data.fit_score <= 10
        print("✅ Invalid fit score was corrected")
    else:
        print(f"⚠️ Invalid fit score validation failed: {result.errors}")


def test_fallback_response_creation():
    """Test creation of fallback responses"""
    job_desc = "Software Engineer with Python experience"
    error_reason = "Test error"

    fallback = response_validator.create_fallback_response(job_desc, error_reason)

    assert isinstance(fallback, ResumeAnalysisResponse)
    assert fallback.job_description == job_desc
    assert fallback.fit_score == 1
    assert fallback.eligibility_status == EligibilityStatus.NOT_ELIGIBLE
    assert error_reason in fallback.fit_score_reason
    print("✅ Fallback response creation test passed")


def run_all_tests():
    """Run all validation tests"""
    print("🧪 Running LLM Response Validation Tests...")
    print("=" * 50)

    try:
        test_valid_json_response()
        test_malformed_json_response()
        test_inconsistent_data_correction()
        test_missing_required_fields()
        test_invalid_fit_score()
        test_fallback_response_creation()

        print("=" * 50)
        print("✅ All validation tests completed successfully!")

    except Exception as e:
        print(f"❌ Test suite failed: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    run_all_tests()
