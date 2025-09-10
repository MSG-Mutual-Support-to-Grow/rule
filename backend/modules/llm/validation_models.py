"""
Pydantic AI validation models for LLM response validation
"""

from pydantic import BaseModel, Field, validator
from typing import List, Dict, Optional, Any
from pydantic_ai import Agent, RunContext
from enum import Enum


class EligibilityStatus(str, Enum):
    ELIGIBLE = "Eligible"
    NOT_ELIGIBLE = "Not Eligible"


class Role(BaseModel):
    """Model for work experience roles"""
    title: str = Field(..., description="Job title/position")
    company: str = Field(..., description="Company name")
    duration: str = Field(..., description="Duration of employment")
    start_date: str = Field(..., description="Start date (YYYY-MM or 'Unknown')")
    end_date: str = Field(..., description="End date (YYYY-MM, 'Present', or 'Unknown')")


class Skill(BaseModel):
    """Model for individual skills"""
    source: str = Field(..., description="Where the skill was found (e.g., 'Work Experience', 'Projects')")
    years: str = Field(..., description="Years of experience with this skill")


class Project(BaseModel):
    """Model for projects"""
    name: str = Field(..., description="Project name")
    tech_stack: str = Field(..., description="Comma-separated technologies used")
    description: str = Field(..., description="Brief description of the project")


class ResumeAnalysisResponse(BaseModel):
    """Complete model for LLM resume analysis response"""
    job_description: str = Field(..., description="Verbatim job description text")
    full_name: str = Field(default="Unknown", description="Candidate's full name")
    email: str = Field(default="", description="Candidate's email address")
    phone_number: str = Field(default="", description="Candidate's phone number")
    total_experience_years: int = Field(ge=0, le=50, default=0, description="Total years of professional experience")
    roles: List[Role] = Field(default_factory=list, description="List of work experience roles")
    work_experience_raw: str = Field(..., description="1-4 sentences summarizing relevant work experience")
    skills: Dict[str, Skill] = Field(default_factory=dict, description="Dictionary of skills with details")
    projects: List[Project] = Field(default_factory=list, description="List of relevant projects")
    leadership_signals: bool = Field(default=False, description="Whether leadership/ownership signals were detected")
    leadership_justification: str = Field(default="", description="Explanation of leadership assessment")
    candidate_fit_summary: str = Field(..., description="2-3 lines explaining suitability vs JD")
    fit_score: int = Field(..., ge=1, le=10, description="Fit score from 1-10")
    fit_score_reason: str = Field(..., description="Reason for the fit score")
    eligibility_status: EligibilityStatus = Field(..., description="Eligibility status")
    eligibility_reason: str = Field(..., description="Reason for eligibility decision")

    @validator('eligibility_status', pre=True, always=True)
    def validate_eligibility_consistency(cls, v, values):
        """Validate that eligibility status is consistent with fit score"""
        if isinstance(v, str):
            v = v.strip()

        if 'fit_score' in values and values['fit_score'] is not None:
            score = values['fit_score']
            expected_eligible = score >= 5

            if expected_eligible and v == "Not Eligible":
                # Auto-correct logical inconsistency
                print(f"[VALIDATION] Correcting eligibility: fit_score {score} should be Eligible, not {v}")
                return EligibilityStatus.ELIGIBLE
            elif not expected_eligible and v == "Eligible":
                # Auto-correct logical inconsistency
                print(f"[VALIDATION] Correcting eligibility: fit_score {score} should be Not Eligible, not {v}")
                return EligibilityStatus.NOT_ELIGIBLE

        return v

    @validator('fit_score')
    def validate_fit_score_range(cls, v):
        """Ensure fit score is within valid range"""
        if not (1 <= v <= 10):
            raise ValueError(f'fit_score must be between 1 and 10, got {v}')
        return v

    @validator('total_experience_years')
    def validate_experience_years(cls, v):
        """Ensure experience years is reasonable"""
        if v < 0:
            raise ValueError('total_experience_years cannot be negative')
        if v > 50:
            print(f"[VALIDATION] Warning: {v} years experience seems unusually high")
        return v

    class Config:
        """Pydantic configuration"""
        validate_assignment = True
        json_encoders = {
            EligibilityStatus: lambda v: v.value
        }


class ValidationResult(BaseModel):
    """Result of validation process"""
    is_valid: bool
    validated_data: Optional[ResumeAnalysisResponse] = None
    errors: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    raw_response: Optional[str] = None
    partial_data: Optional[Dict[str, Any]] = None


# Pydantic AI Agent factory for structured extraction
def create_resume_analysis_agent(provider="openrouter", model="anthropic/claude-3.5-sonnet"):
    """Create a Pydantic AI agent configured for the current LLM provider"""
    # Map provider to Pydantic AI format
    if provider == "openrouter":
        model_string = f"openai:{model}"  # OpenRouter uses OpenAI-compatible API
    elif provider == "ollama":
        model_string = f"ollama:{model}"
    else:
        model_string = f"openai:{model}"  # Default fallback

    return Agent(
        model_string,
        result_type=ResumeAnalysisResponse,
        system_prompt="""
        You are an expert at extracting structured data from resume analysis text.
        Your task is to parse the provided text and extract the resume analysis information
        into the exact structure specified. If information is missing, use appropriate defaults.
        Always ensure logical consistency between fit_score and eligibility_status.
        """
    )
