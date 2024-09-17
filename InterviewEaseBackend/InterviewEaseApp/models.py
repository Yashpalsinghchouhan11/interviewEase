from django.db import models
from Authentication.models import signupModel
# Create your models here.
Interview_domains = {
    'py':'Python Developer',
    'JS':'JavaScript developer',
    'React':'React Developer',
    'HR':'Human Resource',
    'DS':'Data Science',
    'DA':'Data Analytics'
}
class CategoryModel(models.Model):
    user = models.ForeignKey(signupModel, on_delete=models.CASCADE)
    categories = models.CharField(choices=Interview_domains)

    class Meta:
        db_table = 'Domains'