"""
Analytics Engine for RULE
Handles data collection, aggregation, and computation of analytics metrics
"""

import json
import os
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
from collections import defaultdict, Counter
import statistics

from .models import (
    CandidateAnalytics, BatchAnalytics, SkillsAnalytics,
    AnalyticsMetric, MetricType, TimeRange, AnalyticsQuery
)


class AnalyticsEngine:
    """Core analytics processing engine"""

    def __init__(self, outputs_dir: str = "/app/outputs", analytics_dir: str = "/app/analytics_data"):
        self.outputs_dir = outputs_dir
        self.analytics_dir = analytics_dir
        self._ensure_directories()

    def _ensure_directories(self):
        """Ensure required directories exist"""
        os.makedirs(self.outputs_dir, exist_ok=True)
        os.makedirs(self.analytics_dir, exist_ok=True)

    def collect_candidate_data(self, resume_id: str) -> Optional[CandidateAnalytics]:
        """Collect analytics data from a processed resume"""
        output_file = os.path.join(self.outputs_dir, f"{resume_id}.json")

        if not os.path.exists(output_file):
            return None

        try:
            with open(output_file, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # Extract relevant analytics data
            skills_data = data.get('skills', {})
            if isinstance(skills_data, dict):
                # Convert skills object to array of skill names
                skills_list = list(skills_data.keys())
            else:
                skills_list = skills_data if isinstance(skills_data, list) else []

            candidate = CandidateAnalytics(
                resume_id=resume_id,
                filename=data.get('filename', ''),
                full_name=data.get('full_name', ''),
                fit_score=float(data.get('fit_score', 0)),
                eligibility_status=data.get('eligibility_status', 'Unknown'),
                skills=skills_list,
                experience_years=self._extract_experience_years(data),
                location=data.get('location', ''),
                education_level=data.get('education_level', ''),
                job_description_id=data.get('job_description_id', '')
            )

            return candidate

        except Exception as e:
            print(f"Error collecting data for resume {resume_id}: {e}")
            return None

    def _extract_experience_years(self, data: Dict[str, Any]) -> Optional[float]:
        """Extract years of experience from resume data"""
        # Try different fields that might contain experience info
        experience_fields = ['experience_years', 'years_experience', 'total_experience']

        for field in experience_fields:
            if field in data and data[field]:
                try:
                    return float(data[field])
                except (ValueError, TypeError):
                    continue

        # Try to extract from work experience text
        work_exp = data.get('work_experience_raw', '')
        if work_exp:
            # Simple heuristic: count years mentioned
            import re
            years = re.findall(r'(\d+)\s*(?:year|yr)', work_exp.lower())
            if years:
                return max([int(y) for y in years])

        return None

    def compute_batch_analytics(self, batch_id: str, resume_ids: List[str]) -> BatchAnalytics:
        """Compute analytics for a batch of resumes"""
        candidates = []
        skills_counter = Counter()
        eligibility_counter = Counter()

        for resume_id in resume_ids:
            candidate = self.collect_candidate_data(resume_id)
            if candidate:
                candidates.append(candidate)
                # Aggregate skills
                for skill in candidate.skills:
                    skills_counter[skill] += 1
                # Aggregate eligibility
                eligibility_counter[candidate.eligibility_status] += 1

        if not candidates:
            return BatchAnalytics(
                batch_id=batch_id,
                total_candidates=len(resume_ids),
                successful_analyses=0,
                failed_analyses=len(resume_ids),
                average_fit_score=0.0,
                skills_distribution={},
                eligibility_distribution={},
                processing_time_seconds=0.0
            )

        # Calculate metrics
        fit_scores = [c.fit_score for c in candidates]
        average_fit_score = statistics.mean(fit_scores) if fit_scores else 0.0

        # Find top performer
        top_performer = max(candidates, key=lambda c: c.fit_score) if candidates else None

        return BatchAnalytics(
            batch_id=batch_id,
            total_candidates=len(resume_ids),
            successful_analyses=len(candidates),
            failed_analyses=len(resume_ids) - len(candidates),
            average_fit_score=average_fit_score,
            top_performer=top_performer,
            skills_distribution=dict(skills_counter.most_common(20)),  # Top 20 skills
            eligibility_distribution=dict(eligibility_counter),
            processing_time_seconds=0.0  # Would be calculated from actual processing time
        )

    def get_aggregate_metrics(self, time_range: TimeRange = TimeRange.MONTH) -> Dict[str, Any]:
        """Get aggregated metrics across all processed resumes"""
        all_candidates = self._get_candidates_in_time_range(time_range)

        if not all_candidates:
            return self._empty_metrics()

        # Calculate various metrics
        metrics = {
            'total_candidates': len(all_candidates),
            'average_fit_score': statistics.mean([c.fit_score for c in all_candidates]),
            'eligibility_rate': self._calculate_eligibility_rate(all_candidates),
            'top_skills': self._get_top_skills(all_candidates),
            'experience_distribution': self._get_experience_distribution(all_candidates),
            'skills_distribution': self._get_skills_distribution(all_candidates),
            'geographic_distribution': self._get_geographic_distribution(all_candidates)
        }

        return metrics

    def _get_candidates_in_time_range(self, time_range: TimeRange) -> List[CandidateAnalytics]:
        """Get all candidates processed within the specified time range"""
        candidates = []
        cutoff_date = self._get_cutoff_date(time_range)

        # Scan all output files
        if os.path.exists(self.outputs_dir):
            for filename in os.listdir(self.outputs_dir):
                if filename.endswith('.json'):
                    resume_id = filename[:-5]  # Remove .json extension
                    candidate = self.collect_candidate_data(resume_id)
                    if candidate and candidate.processed_at >= cutoff_date:
                        candidates.append(candidate)

        return candidates

    def _get_cutoff_date(self, time_range: TimeRange) -> datetime:
        """Get the cutoff date for the specified time range"""
        now = datetime.now()

        if time_range == TimeRange.TODAY:
            return now.replace(hour=0, minute=0, second=0, microsecond=0)
        elif time_range == TimeRange.WEEK:
            return now - timedelta(days=7)
        elif time_range == TimeRange.MONTH:
            return now - timedelta(days=30)
        elif time_range == TimeRange.QUARTER:
            return now - timedelta(days=90)
        elif time_range == TimeRange.YEAR:
            return now - timedelta(days=365)
        else:  # ALL_TIME
            return datetime.min

    def _calculate_eligibility_rate(self, candidates: List[CandidateAnalytics]) -> float:
        """Calculate the percentage of eligible candidates"""
        if not candidates:
            return 0.0

        eligible_count = sum(1 for c in candidates if c.eligibility_status == 'Eligible')
        return (eligible_count / len(candidates)) * 100

    def _get_top_skills(self, candidates: List[CandidateAnalytics], top_n: int = 10) -> List[Dict[str, Any]]:
        """Get the most common skills across candidates"""
        all_skills = []
        for candidate in candidates:
            all_skills.extend(candidate.skills)

        skill_counts = Counter(all_skills)
        top_skills = skill_counts.most_common(top_n)

        return [
            {
                'skill': skill,
                'count': count,
                'percentage': (count / len(candidates)) * 100 if candidates else 0
            }
            for skill, count in top_skills
        ]

    def _get_experience_distribution(self, candidates: List[CandidateAnalytics]) -> Dict[str, int]:
        """Get distribution of experience levels"""
        distribution = defaultdict(int)

        for candidate in candidates:
            if candidate.experience_years is not None:
                if candidate.experience_years < 2:
                    distribution['0-2 years'] += 1
                elif candidate.experience_years < 5:
                    distribution['2-5 years'] += 1
                elif candidate.experience_years < 10:
                    distribution['5-10 years'] += 1
                else:
                    distribution['10+ years'] += 1
            else:
                distribution['Unknown'] += 1

        return dict(distribution)

    def _get_skills_distribution(self, candidates: List[CandidateAnalytics]) -> Dict[str, int]:
        """Get overall skills distribution"""
        all_skills = []
        for candidate in candidates:
            all_skills.extend(candidate.skills)

        return dict(Counter(all_skills))

    def _get_geographic_distribution(self, candidates: List[CandidateAnalytics]) -> Dict[str, int]:
        """Get geographic distribution of candidates"""
        distribution = defaultdict(int)

        for candidate in candidates:
            location = candidate.location or 'Unknown'
            distribution[location] += 1

        return dict(distribution)

    def _empty_metrics(self) -> Dict[str, Any]:
        """Return empty metrics structure"""
        return {
            'total_candidates': 0,
            'average_fit_score': 0.0,
            'eligibility_rate': 0.0,
            'top_skills': [],
            'experience_distribution': {},
            'skills_distribution': {},
            'geographic_distribution': {}
        }

    def compare_candidates(self, resume_id_a: str, resume_id_b: str,
                          criteria: str = "fit_score") -> Optional[Dict[str, Any]]:
        """Compare two candidates based on specified criteria"""
        candidate_a = self.collect_candidate_data(resume_id_a)
        candidate_b = self.collect_candidate_data(resume_id_b)

        if not candidate_a or not candidate_b:
            return None

        comparison = {
            'candidate_a': candidate_a.dict(),
            'candidate_b': candidate_b.dict(),
            'criteria': criteria,
            'differences': {},
            'winner': None,
            'comparison_score': 0.0
        }

        # Compare based on criteria
        if criteria == "fit_score":
            comparison['differences']['fit_score_diff'] = candidate_a.fit_score - candidate_b.fit_score
            comparison['winner'] = 'a' if candidate_a.fit_score > candidate_b.fit_score else 'b' if candidate_b.fit_score > candidate_a.fit_score else None
        elif criteria == "experience":
            exp_a = candidate_a.experience_years or 0
            exp_b = candidate_b.experience_years or 0
            comparison['differences']['experience_diff'] = exp_a - exp_b
            comparison['winner'] = 'a' if exp_a > exp_b else 'b' if exp_b > exp_a else None
        elif criteria == "skills_match":
            skills_a = set(candidate_a.skills)
            skills_b = set(candidate_b.skills)
            intersection = skills_a.intersection(skills_b)
            comparison['differences']['common_skills'] = list(intersection)
            comparison['differences']['unique_a'] = list(skills_a - skills_b)
            comparison['differences']['unique_b'] = list(skills_b - skills_a)
            comparison['winner'] = 'a' if len(skills_a) > len(skills_b) else 'b' if len(skills_b) > len(skills_a) else None

        return comparison

    def save_batch_analytics(self, batch_analytics: BatchAnalytics):
        """Save batch analytics data to file"""
        analytics_file = os.path.join(self.analytics_dir, f"batch_{batch_analytics.batch_id}.json")

        with open(analytics_file, 'w', encoding='utf-8') as f:
            json.dump(batch_analytics.dict(), f, indent=2, default=str)

    def get_batch_analytics(self, batch_id: str) -> Optional[BatchAnalytics]:
        """Retrieve batch analytics data"""
        analytics_file = os.path.join(self.analytics_dir, f"batch_{batch_id}.json")

        if not os.path.exists(analytics_file):
            return None

        try:
            with open(analytics_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return BatchAnalytics(**data)
        except Exception as e:
            print(f"Error loading batch analytics {batch_id}: {e}")
            return None


# Global analytics engine instance
analytics_engine = AnalyticsEngine()
