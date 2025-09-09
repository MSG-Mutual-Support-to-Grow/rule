"""
LLM Response Validation using Pydantic AI
Handles validation, correction, and structured extraction of LLM responses
"""

import json
import re
from typing import Dict, Any, Optional, Union
from .validation_models import (
    ResumeAnalysisResponse,
    ValidationResult,
    create_resume_analysis_agent,
    EligibilityStatus
)
from .llm_automation import llm_automation


class LLMResponseValidator:
    """Validator for LLM responses using Pydantic AI"""



    def validate_and_extract(self, raw_response: str, job_description: str = "") -> ValidationResult:
        """
        Validate and extract structured data from LLM response

        Args:
            raw_response: Raw text response from LLM
            job_description: Original job description for context

        Returns:
            ValidationResult with validated data or error details
        """
        try:
            # Clean the raw response
            cleaned_response = self._clean_response(raw_response)

            # Try direct JSON parsing first (fast path)
            try:
                json_data = json.loads(cleaned_response)
                validated_data = ResumeAnalysisResponse(**json_data)
                return ValidationResult(
                    is_valid=True,
                    validated_data=validated_data,
                    raw_response=raw_response
                )
            except (json.JSONDecodeError, ValueError) as e:
                print(f"[VALIDATION] Direct JSON parsing failed: {e}")
                # Fall through to Pydantic AI extraction

            # Use Pydantic AI for structured extraction
            return self._extract_with_pydantic_ai(cleaned_response, job_description)

        except Exception as e:
            print(f"[VALIDATION] Unexpected error during validation: {e}")
            return ValidationResult(
                is_valid=False,
                errors=[f"Validation failed: {str(e)}"],
                raw_response=raw_response
            )

    def _clean_response(self, response: str) -> str:
        """Clean markdown and formatting from LLM response"""
        if not response:
            return ""

        cleaned = response.strip()

        # Remove markdown code blocks
        if cleaned.startswith("```"):
            first_newline = cleaned.find('\n')
            if first_newline != -1:
                cleaned = cleaned[first_newline + 1:]
            else:
                cleaned = cleaned[3:]

        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]

        # Remove language specifiers
        if cleaned.startswith("json"):
            cleaned = cleaned[4:].strip()

        return cleaned.strip()

    def _extract_with_pydantic_ai(self, cleaned_response: str, job_description: str) -> ValidationResult:
        """Use Pydantic AI to extract structured data from text"""
        try:
            # Configure the agent with current LLM provider
            current_config = llm_automation.current_config
            provider = current_config.get("provider", "openrouter")
            model = current_config.get("model", "anthropic/claude-3.5-sonnet")

            # Map provider to Pydantic AI format
            if provider == "openrouter":
                model_string = f"openai:{model}"  # OpenRouter uses OpenAI-compatible API
            elif provider == "ollama":
                model_string = f"ollama:{model}"
            else:
                model_string = f"openai:{model}"  # Default fallback

            # Create agent with current configuration
            agent = create_resume_analysis_agent(provider, model)

            # Prepare the prompt with context
            full_prompt = f"""
            Please extract structured information from this resume analysis response.

            Job Description: {job_description[:500]}...

            Raw Response:
            {cleaned_response}

            Extract the information into the required JSON structure, using appropriate defaults for missing data.
            """

            # Run the agent
            result = agent.run_sync(full_prompt)

            if result:
                return ValidationResult(
                    is_valid=True,
                    validated_data=result.data,
                    raw_response=cleaned_response
                )
            else:
                return ValidationResult(
                    is_valid=False,
                    errors=["Pydantic AI extraction failed"],
                    raw_response=cleaned_response
                )

        except Exception as e:
            print(f"[VALIDATION] Pydantic AI extraction error: {e}")
            return ValidationResult(
                is_valid=False,
                errors=[f"Pydantic AI extraction failed: {str(e)}"],
                raw_response=cleaned_response
            )

    def validate_partial_response(self, partial_data: Dict[str, Any]) -> ValidationResult:
        """Validate partial response data and fill in defaults"""
        try:
            # Try to create the model with partial data
            validated_data = ResumeAnalysisResponse(**partial_data)

            return ValidationResult(
                is_valid=True,
                validated_data=validated_data,
                partial_data=partial_data
            )

        except ValueError as e:
            # Extract validation errors
            error_messages = []
            if hasattr(e, 'errors'):
                for error in e.errors():
                    field = error.get('loc', ['unknown'])[0]
                    msg = error.get('msg', str(error))
                    error_messages.append(f"{field}: {msg}")
            else:
                error_messages.append(str(e))

            return ValidationResult(
                is_valid=False,
                errors=error_messages,
                partial_data=partial_data
            )

    def create_fallback_response(self, job_description: str, error_reason: str = "") -> ResumeAnalysisResponse:
        """Create a standardized fallback response"""
        return ResumeAnalysisResponse(
            job_description=job_description,
            full_name="Unknown",
            email="",
            phone_number="",
            total_experience_years=0,
            roles=[],
            work_experience_raw="Could not extract work experience due to processing error",
            skills={},
            projects=[],
            leadership_signals=False,
            leadership_justification="",
            candidate_fit_summary="Unable to analyze due to system error",
            fit_score=1,
            fit_score_reason=f"Analysis failed: {error_reason}" if error_reason else "System error prevented resume analysis",
            eligibility_status=EligibilityStatus.NOT_ELIGIBLE,
            eligibility_reason="Resume analysis could not be completed"
        )


# Global validator instance
response_validator = LLMResponseValidator()


def validate_llm_response(raw_response: Union[str, Dict], job_description: str = "") -> ValidationResult:
    """
    Convenience function to validate LLM responses

    Args:
        raw_response: Raw LLM response (string or dict)
        job_description: Job description for context

    Returns:
        ValidationResult with validated data
    """
    if isinstance(raw_response, dict):
        # Already parsed JSON
        return response_validator.validate_partial_response(raw_response)
    else:
        # Raw text response
        return response_validator.validate_and_extract(raw_response, job_description)
