import csv
import json
from datetime import timedelta

from django.contrib import messages
from django.db.models import Sum
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone
from django.views.decorators.http import require_GET, require_POST

from .forms import SubjectForm
from .models import StudySession, Subject
from .services import format_hhmm, period_totals, streak_days, subject_totals


def landing(request):
    return render(request, "landing.html")


def dashboard(request):
    totals = subject_totals()
    all_seconds = sum(item["total_seconds"] for item in totals)
    today = timezone.localdate()
    today_total = (
        StudySession.objects.filter(start_time__date=today).aggregate(total=Sum("duration_seconds"))["total"] or 0
    )
    context = {
        "subject_totals": totals,
        "total_studied": format_hhmm(all_seconds),
        "today_studied": format_hhmm(int(today_total)),
        "streak": streak_days(),
        "recent_sessions": StudySession.objects.select_related("subject")[:8],
    }
    return render(request, "dashboard.html", context)


def timer_page(request):
    subjects = Subject.objects.all()
    return render(request, "timer.html", {"subjects": subjects})


def subjects_page(request):
    if request.method == "POST":
        form = SubjectForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Subject added.")
            return redirect("subjects")
    else:
        form = SubjectForm()
    subjects = Subject.objects.all()
    return render(request, "subjects.html", {"form": form, "subjects": subjects})


@require_POST
def edit_subject(request, pk):
    subject = get_object_or_404(Subject, pk=pk)
    form = SubjectForm(request.POST, instance=subject)
    if form.is_valid():
        form.save()
        messages.success(request, "Subject updated.")
    return redirect("subjects")


@require_POST
def delete_subject(request, pk):
    subject = get_object_or_404(Subject, pk=pk)
    subject.delete()
    messages.success(request, "Subject deleted.")
    return redirect("subjects")


def stats_page(request):
    return render(request, "stats.html")


@require_POST
def save_session(request):
    data = json.loads(request.body.decode("utf-8"))
    subject = get_object_or_404(Subject, pk=data.get("subject_id"))
    duration_seconds = max(int(data.get("duration_seconds", 0)), 1)
    started_at = timezone.now() - timedelta(seconds=duration_seconds)
    ended_at = timezone.now()
    StudySession.objects.create(
        subject=subject,
        duration_seconds=duration_seconds,
        start_time=started_at,
        end_time=ended_at,
    )
    return JsonResponse({"ok": True})


@require_GET
def analytics_json(request):
    return JsonResponse(
        {
            "subjects": subject_totals(),
            "daily_30": period_totals(30),
            "weekly_12": period_totals(84),
            "monthly_12": period_totals(365),
            "streak": streak_days(),
        }
    )


@require_GET
def export_csv(request):
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="studyx-sessions.csv"'
    writer = csv.writer(response)
    writer.writerow(["Subject", "Duration (seconds)", "Start", "End"])
    for session in StudySession.objects.select_related("subject").order_by("-start_time"):
        writer.writerow(
            [
                session.subject.name,
                session.duration_seconds,
                session.start_time.isoformat(),
                session.end_time.isoformat(),
            ]
        )
    return response
