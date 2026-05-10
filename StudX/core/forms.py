from django import forms

from .models import Subject


class SubjectForm(forms.ModelForm):
    class Meta:
        model = Subject
        fields = ["name", "color"]
        widgets = {
            "name": forms.TextInput(attrs={"placeholder": "e.g. Mathematics"}),
            "color": forms.TextInput(attrs={"type": "color"}),
        }
