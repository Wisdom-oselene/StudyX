from django.urls import path

from . import views

urlpatterns = [
    path("", views.landing, name="landing"),
    path("dashboard/", views.dashboard, name="dashboard"),
    path("timer/", views.timer_page, name="timer"),
    path("subjects/", views.subjects_page, name="subjects"),
    path("subjects/<int:pk>/edit/", views.edit_subject, name="edit_subject"),
    path("subjects/<int:pk>/delete/", views.delete_subject, name="delete_subject"),
    path("stats/", views.stats_page, name="stats"),
    path("api/session/save/", views.save_session, name="save_session"),
    path("api/analytics/", views.analytics_json, name="analytics_json"),
    path("export/csv/", views.export_csv, name="export_csv"),
]
