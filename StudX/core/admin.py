from django.contrib import admin

from .models import StudySession, Subject


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ("name", "color", "created_at")
    search_fields = ("name",)


@admin.register(StudySession)
class StudySessionAdmin(admin.ModelAdmin):
    list_display = ("subject", "duration_seconds", "start_time", "end_time")
    list_filter = ("subject", "start_time")
