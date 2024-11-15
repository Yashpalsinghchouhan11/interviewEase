from django.db import models
from Authentication.models import signupModel

# Choices for domain names
INTERVIEW_DOMAINS = [
    ('SD', 'Softwate Developer'),
    ('PM', 'Product management'),
    ('HR', 'Human Resource'),
    ('DS', 'Data Science'),
    ('CD', 'Cloud and DevOps'),
]

class Domain(models.Model):
    domain = models.CharField(max_length=50, choices=INTERVIEW_DOMAINS, unique=True)

    class Meta:
        db_table = 'Domains'
        verbose_name_plural = "Domains"
    
    def __str__(self) -> str:
        return f"Domain: {self.domain}"

class Interview(models.Model):
    user = models.ForeignKey(signupModel, on_delete=models.CASCADE)  # Link to the user who is taking the interview
    domain = models.ForeignKey(Domain, on_delete=models.SET_NULL, null=True)  # Link to the interview domain (e.g., Python Developer)
    interview_date = models.DateTimeField(auto_now_add=True)  # Automatically sets the interview date to the current date/time

    class Meta:
        db_table = 'Interviews'
        ordering = ['-interview_date']  # Orders by most recent interviews first

    def __str__(self):
        return f"Interview for {self.domain} - {self.user.username} on {self.interview_date.strftime('%Y-%m-%d %H:%M')}"
    
class Questions(models.Model):
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE)
    question_text = models.CharField(max_length=255)

    class Meta:
        db_table = 'Questions'

    def __str__(self) -> str:
        return f"Question: {self.question_text} (Interview ID: {self.interview.id})"

class Answers(models.Model):
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE)
    question = models.ForeignKey(Questions, on_delete=models.CASCADE)
    answer_text = models.TextField(null=True, blank=True)  # Use TextField for longer answers
    audio_path = models.FileField(upload_to='answers/audio/', null=True, blank=True)  # For storing audio file

    class Meta:
        db_table = 'Answers'

    def __str__(self) -> str:
        return f"Answer to {self.question.question_text} (Interview ID: {self.interview.id})"
