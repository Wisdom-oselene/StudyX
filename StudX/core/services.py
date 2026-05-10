from datetime import timedelta

from django.db.models import Sum
from django.db.models.functions import TruncDate
from django.utils import timezone

from .models import StudySession, Subject


def format_hhmm(total_seconds: int) -> str:
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    return f"{hours:02d}h {minutes:02d}m"


def subject_totals():
    rows = (
        Subject.objects.annotate(total_seconds=Sum("sessions__duration_seconds"))
        .values("id", "name", "color", "total_seconds")
        .order_by("-total_seconds", "name")
    )
    return [{**r, "total_seconds": int(r["total_seconds"] or 0)} for r in rows]


def period_totals(days: int):
    since = timezone.now() - timedelta(days=days - 1)
    rows = (
        StudySession.objects.filter(start_time__gte=since)
        .annotate(day=TruncDate("start_time"))
        .values("day")
        .annotate(total_seconds=Sum("duration_seconds"))
        .order_by("day")
    )
    return [{"day": r["day"].isoformat(), "total_seconds": int(r["total_seconds"] or 0)} for r in rows]


def streak_days() -> int:
    days = list(
        StudySession.objects.annotate(day=TruncDate("start_time"))
        .values_list("day", flat=True)
        .distinct()
        .order_by("-day")
    )
    if not days:
        return 0
    streak = 0
    cursor = timezone.localdate()
    if days and days[0] < cursor:
        cursor = days[0]
    day_set = set(days)
    while cursor in day_set:
        streak += 1
        cursor = cursor - timedelta(days=1)
    return streak
