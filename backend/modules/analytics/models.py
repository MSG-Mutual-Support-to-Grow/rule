"""
Analytics data models for RULE
Handles data structures for metrics, reports, and analytics storage
"""

from typing import Dict, List, Optional, Any, Union
from datetime import datetime
from pydantic import BaseModel, Field
from enum import Enum


class MetricType(str, Enum):
    """Types of analytics metrics"""
    CANDIDATE_COUNT = "candidate_count"
    AVERAGE_FIT_SCORE = "average_fit_score"
    SKILLS_DISTRIBUTION = "skills_distribution"
    EXPERIENCE_DISTRIBUTION = "experience_distribution"
    ELIGIBILITY_RATE = "eligibility_rate"
    PROCESSING_TIME = "processing_time"
    TOP_SKILLS = "top_skills"
    GEOGRAPHIC_DISTRIBUTION = "geographic_distribution"


class TimeRange(str, Enum):
    """Time range options for analytics"""
    TODAY = "today"
    WEEK = "week"
    MONTH = "month"
    QUARTER = "quarter"
    YEAR = "year"
    ALL_TIME = "all_time"


class AnalyticsMetric(BaseModel):
    """Individual analytics metric"""
    metric_type: MetricType
    value: Union[int, float, str, Dict[str, Any]]
    timestamp: datetime = Field(default_factory=datetime.now)
    metadata: Optional[Dict[str, Any]] = None


class CandidateAnalytics(BaseModel):
    """Analytics data for a single candidate"""
    resume_id: str
    filename: str
    full_name: Optional[str] = None
    fit_score: float
    eligibility_status: str
    skills: List[str] = []
    experience_years: Optional[float] = None
    location: Optional[str] = None
    education_level: Optional[str] = None
    processed_at: datetime = Field(default_factory=datetime.now)
    job_description_id: Optional[str] = None


class BatchAnalytics(BaseModel):
    """Analytics data for a batch processing session"""
    batch_id: str
    total_candidates: int
    successful_analyses: int
    failed_analyses: int
    average_fit_score: float
    top_performer: Optional[CandidateAnalytics] = None
    skills_distribution: Dict[str, int] = {}
    eligibility_distribution: Dict[str, int] = {}
    processing_time_seconds: float
    processed_at: datetime = Field(default_factory=datetime.now)


class SkillsAnalytics(BaseModel):
    """Analytics for skills across candidates"""
    skill_name: str
    frequency: int
    average_fit_score: float
    candidates_with_skill: List[str] = []  # List of resume_ids


class ComparisonCriteria(str, Enum):
    """Criteria for comparing candidates"""
    FIT_SCORE = "fit_score"
    EXPERIENCE = "experience"
    SKILLS_MATCH = "skills_match"
    EDUCATION = "education"
    LOCATION = "location"


class CandidateComparison(BaseModel):
    """Comparison data between candidates"""
    candidate_a: CandidateAnalytics
    candidate_b: CandidateAnalytics
    criteria: ComparisonCriteria
    differences: Dict[str, Any] = {}
    winner: Optional[str] = None  # "a", "b", or None for tie
    comparison_score: float


class ReportTemplate(BaseModel):
    """Template for generating reports"""
    template_id: str
    name: str
    description: str
    metrics: List[MetricType]
    time_range: TimeRange
    filters: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class AnalyticsReport(BaseModel):
    """Generated analytics report"""
    report_id: str
    template_id: str
    title: str
    data: Dict[str, Any]
    generated_at: datetime = Field(default_factory=datetime.now)
    time_range: TimeRange
    filters_applied: Optional[Dict[str, Any]] = None


class DashboardWidget(BaseModel):
    """Dashboard widget configuration"""
    widget_id: str
    widget_type: str  # "chart", "metric", "table", etc.
    title: str
    metric_type: MetricType
    time_range: TimeRange
    filters: Optional[Dict[str, Any]] = None
    position: Dict[str, int] = {"x": 0, "y": 0, "width": 1, "height": 1}
    config: Optional[Dict[str, Any]] = None


class AnalyticsDashboard(BaseModel):
    """Complete dashboard configuration"""
    dashboard_id: str
    name: str
    description: str
    widgets: List[DashboardWidget]
    is_default: bool = False
    created_by: str
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class AnalyticsQuery(BaseModel):
    """Query parameters for analytics requests"""
    time_range: TimeRange = TimeRange.MONTH
    filters: Optional[Dict[str, Any]] = None
    group_by: Optional[str] = None
    sort_by: Optional[str] = None
    sort_order: str = "desc"
    limit: int = 100
    offset: int = 0


class AnalyticsResponse(BaseModel):
    """Standard response format for analytics API"""
    success: bool
    data: Optional[Any] = None
    message: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.now)
