from django.db import models


class Subject(models.Model):
    name = models.CharField(max_length=120, unique=True)
    color = models.CharField(max_length=7, default="#8B5CF6")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name

    @property
    def total_seconds(self) -> int:
        return int(self.sessions.aggregate(total=models.Sum("duration_seconds"))["total"] or 0)


class StudySession(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="sessions")
    duration_seconds = models.PositiveIntegerField(default=0)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-start_time"]

    def __str__(self) -> str:
        return f"{self.subject.name} - {self.duration_seconds}s"
