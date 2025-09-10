"""
Analytics API endpoints for RULE
Provides RESTful API for analytics and reporting features
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any
from uuid import uuid4
from datetime import datetime

from .engine import analytics_engine
from .models import (
    AnalyticsResponse, AnalyticsQuery, TimeRange,
    MetricType, CandidateComparison
)

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/metrics", response_model=AnalyticsResponse)
async def get_aggregate_metrics(
    time_range: TimeRange = Query(TimeRange.MONTH, description="Time range for metrics"),
    include_details: bool = Query(False, description="Include detailed breakdowns")
):
    """Get aggregated analytics metrics"""
    try:
        metrics = analytics_engine.get_aggregate_metrics(time_range)

        if include_details:
            # Add additional computed metrics
            metrics['computed_at'] = datetime.now().isoformat()
            metrics['time_range'] = time_range.value

        return AnalyticsResponse(
            success=True,
            data=metrics,
            message=f"Analytics metrics for {time_range.value}",
            metadata={
                "time_range": time_range.value,
                "computed_at": datetime.now().isoformat()
            }
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to compute analytics metrics: {str(e)}"
        )


@router.get("/metrics/{metric_type}", response_model=AnalyticsResponse)
async def get_specific_metric(
    metric_type: MetricType,
    time_range: TimeRange = Query(TimeRange.MONTH, description="Time range for metric")
):
    """Get a specific analytics metric"""
    try:
        all_metrics = analytics_engine.get_aggregate_metrics(time_range)

        # Map metric type to actual data key
        metric_key_map = {
            MetricType.CANDIDATE_COUNT: 'total_candidates',
            MetricType.AVERAGE_FIT_SCORE: 'average_fit_score',
            MetricType.ELIGIBILITY_RATE: 'eligibility_rate',
            MetricType.TOP_SKILLS: 'top_skills',
            MetricType.EXPERIENCE_DISTRIBUTION: 'experience_distribution',
            MetricType.SKILLS_DISTRIBUTION: 'skills_distribution',
            MetricType.GEOGRAPHIC_DISTRIBUTION: 'geographic_distribution'
        }

        metric_key = metric_key_map.get(metric_type)
        if not metric_key:
            raise HTTPException(status_code=400, detail=f"Unsupported metric type: {metric_type}")

        metric_value = all_metrics.get(metric_key)

        return AnalyticsResponse(
            success=True,
            data={
                "metric_type": metric_type.value,
                "value": metric_value,
                "time_range": time_range.value
            },
            message=f"Metric {metric_type.value} for {time_range.value}"
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve metric: {str(e)}"
        )


@router.get("/candidates", response_model=AnalyticsResponse)
async def get_candidate_analytics(
    time_range: TimeRange = Query(TimeRange.MONTH, description="Time range for candidates"),
    limit: int = Query(100, description="Maximum number of candidates to return"),
    offset: int = Query(0, description="Number of candidates to skip"),
    sort_by: str = Query("fit_score", description="Field to sort by"),
    sort_order: str = Query("desc", description="Sort order: asc or desc")
):
    """Get analytics data for individual candidates"""
    try:
        # Get all candidates in time range
        candidates = analytics_engine._get_candidates_in_time_range(time_range)

        # Apply sorting
        reverse_order = sort_order.lower() == "desc"
        if sort_by == "fit_score":
            candidates.sort(key=lambda c: c.fit_score, reverse=reverse_order)
        elif sort_by == "experience_years":
            candidates.sort(key=lambda c: c.experience_years or 0, reverse=reverse_order)
        elif sort_by == "processed_at":
            candidates.sort(key=lambda c: c.processed_at, reverse=reverse_order)

        # Apply pagination
        paginated_candidates = candidates[offset:offset + limit]

        # Convert to dict format
        candidate_data = [
            {
                "resume_id": c.resume_id,
                "filename": c.filename,
                "full_name": c.full_name,
                "fit_score": c.fit_score,
                "eligibility_status": c.eligibility_status,
                "skills_count": len(c.skills),
                "experience_years": c.experience_years,
                "location": c.location,
                "education_level": c.education_level,
                "processed_at": c.processed_at.isoformat()
            }
            for c in paginated_candidates
        ]

        return AnalyticsResponse(
            success=True,
            data={
                "candidates": candidate_data,
                "total_count": len(candidates),
                "returned_count": len(candidate_data),
                "offset": offset,
                "limit": limit
            },
            message=f"Retrieved {len(candidate_data)} candidates",
            metadata={
                "time_range": time_range.value,
                "sort_by": sort_by,
                "sort_order": sort_order,
                "total_candidates": len(candidates)
            }
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve candidate analytics: {str(e)}"
        )


@router.get("/batch/{batch_id}", response_model=AnalyticsResponse)
async def get_batch_analytics(batch_id: str):
    """Get analytics for a specific batch"""
    try:
        batch_analytics = analytics_engine.get_batch_analytics(batch_id)

        if not batch_analytics:
            raise HTTPException(status_code=404, detail=f"Batch analytics not found: {batch_id}")

        return AnalyticsResponse(
            success=True,
            data=batch_analytics.dict(),
            message=f"Batch analytics for {batch_id}"
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve batch analytics: {str(e)}"
        )


@router.post("/compare", response_model=AnalyticsResponse)
async def compare_candidates(
    resume_id_a: str = Query(..., description="First resume ID to compare"),
    resume_id_b: str = Query(..., description="Second resume ID to compare"),
    criteria: str = Query("fit_score", description="Comparison criteria")
):
    """Compare two candidates"""
    try:
        comparison = analytics_engine.compare_candidates(resume_id_a, resume_id_b, criteria)

        if not comparison:
            raise HTTPException(
                status_code=404,
                detail=f"One or both resumes not found: {resume_id_a}, {resume_id_b}"
            )

        return AnalyticsResponse(
            success=True,
            data=comparison,
            message=f"Comparison of candidates {resume_id_a} vs {resume_id_b}"
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to compare candidates: {str(e)}"
        )


@router.get("/skills/analysis", response_model=AnalyticsResponse)
async def get_skills_analysis(
    time_range: TimeRange = Query(TimeRange.MONTH, description="Time range for analysis"),
    top_n: int = Query(20, description="Number of top skills to return")
):
    """Get detailed skills analysis"""
    try:
        candidates = analytics_engine._get_candidates_in_time_range(time_range)

        if not candidates:
            return AnalyticsResponse(
                success=True,
                data={"skills_analysis": [], "total_candidates": 0},
                message="No candidates found in the specified time range"
            )

        # Get top skills
        top_skills = analytics_engine._get_top_skills(candidates, top_n)

        # Additional skills metrics
        all_skills = []
        for candidate in candidates:
            all_skills.extend(candidate.skills)

        unique_skills = len(set(all_skills))
        avg_skills_per_candidate = len(all_skills) / len(candidates) if candidates else 0

        skills_analysis = {
            "top_skills": top_skills,
            "unique_skills_count": unique_skills,
            "average_skills_per_candidate": round(avg_skills_per_candidate, 2),
            "total_skill_mentions": len(all_skills),
            "total_candidates": len(candidates)
        }

        return AnalyticsResponse(
            success=True,
            data=skills_analysis,
            message=f"Skills analysis for {len(candidates)} candidates"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze skills: {str(e)}"
        )


@router.get("/trends", response_model=AnalyticsResponse)
async def get_trends_analysis(
    metric: str = Query("fit_score", description="Metric to analyze trends for"),
    time_range: TimeRange = Query(TimeRange.YEAR, description="Time range for trend analysis")
):
    """Get trend analysis for specified metric"""
    try:
        # This would typically involve time-series analysis
        # For now, return basic trend data
        candidates = analytics_engine._get_candidates_in_time_range(time_range)

        if not candidates:
            return AnalyticsResponse(
                success=True,
                data={"trends": [], "message": "No data available for trend analysis"},
                message="No candidates found for trend analysis"
            )

        # Group by month/week for trend analysis
        from collections import defaultdict
        trends = defaultdict(list)

        for candidate in candidates:
            period = candidate.processed_at.strftime("%Y-%m")  # Monthly grouping

            if metric == "fit_score":
                trends[period].append(candidate.fit_score)
            elif metric == "experience_years":
                if candidate.experience_years:
                    trends[period].append(candidate.experience_years)

        # Calculate averages for each period
        trend_data = []
        for period, values in sorted(trends.items()):
            if values:
                trend_data.append({
                    "period": period,
                    "average": round(sum(values) / len(values), 2),
                    "count": len(values),
                    "min": min(values),
                    "max": max(values)
                })

        return AnalyticsResponse(
            success=True,
            data={
                "metric": metric,
                "trends": trend_data,
                "total_periods": len(trend_data)
            },
            message=f"Trend analysis for {metric} over {time_range.value}"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze trends: {str(e)}"
        )


@router.get("/dashboard/summary", response_model=AnalyticsResponse)
async def get_dashboard_summary(
    time_range: TimeRange = Query(TimeRange.MONTH, description="Time range for dashboard")
):
    """Get dashboard summary with key metrics"""
    try:
        metrics = analytics_engine.get_aggregate_metrics(time_range)

        # Create dashboard summary
        dashboard_data = {
            "key_metrics": {
                "total_candidates": metrics.get("total_candidates", 0),
                "average_fit_score": round(metrics.get("average_fit_score", 0), 2),
                "eligibility_rate": round(metrics.get("eligibility_rate", 0), 2),
                "top_skill": metrics.get("top_skills", [{}])[0].get("skill", "N/A") if metrics.get("top_skills") else "N/A"
            },
            "charts_data": {
                "experience_distribution": metrics.get("experience_distribution", {}),
                "eligibility_distribution": metrics.get("eligibility_distribution", {}),
                "top_skills": metrics.get("top_skills", [])[:5]  # Top 5 skills
            },
            "time_range": time_range.value,
            "generated_at": datetime.now().isoformat()
        }

        return AnalyticsResponse(
            success=True,
            data=dashboard_data,
            message=f"Dashboard summary for {time_range.value}"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate dashboard summary: {str(e)}"
        )


@router.get("/export", response_model=AnalyticsResponse)
async def export_analytics_data(
    time_range: TimeRange = Query(TimeRange.MONTH, description="Time range for export"),
    format: str = Query("json", description="Export format: json or csv")
):
    """Export analytics data"""
    try:
        candidates = analytics_engine._get_candidates_in_time_range(time_range)

        if format.lower() == "csv":
            # Convert to CSV format
            import csv
            import io

            output = io.StringIO()
            writer = csv.writer(output)

            # Write header
            writer.writerow([
                "Resume ID", "Filename", "Full Name", "Fit Score",
                "Eligibility Status", "Skills Count", "Experience Years",
                "Location", "Education Level", "Processed At"
            ])

            # Write data
            for candidate in candidates:
                writer.writerow([
                    candidate.resume_id,
                    candidate.filename,
                    candidate.full_name or "",
                    candidate.fit_score,
                    candidate.eligibility_status,
                    len(candidate.skills),
                    candidate.experience_years or "",
                    candidate.location or "",
                    candidate.education_level or "",
                    candidate.processed_at.isoformat()
                ])

            export_data = output.getvalue()
            output.close()

        else:  # JSON format
            export_data = {
                "candidates": [
                    {
                        "resume_id": c.resume_id,
                        "filename": c.filename,
                        "full_name": c.full_name,
                        "fit_score": c.fit_score,
                        "eligibility_status": c.eligibility_status,
                        "skills": c.skills,
                        "experience_years": c.experience_years,
                        "location": c.location,
                        "education_level": c.education_level,
                        "processed_at": c.processed_at.isoformat()
                    }
                    for c in candidates
                ],
                "summary": analytics_engine.get_aggregate_metrics(time_range),
                "exported_at": datetime.now().isoformat(),
                "time_range": time_range.value
            }

        return AnalyticsResponse(
            success=True,
            data={
                "format": format,
                "data": export_data,
                "record_count": len(candidates)
            },
            message=f"Exported {len(candidates)} records in {format} format"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to export analytics data: {str(e)}"
        )
