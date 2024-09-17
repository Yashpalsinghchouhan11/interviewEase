from django.urls import path
from . import views

urlpatterns = [
    path('category/',views.Question, name='category'),
    path('media/<str:filename>', views.Greeting, name="Greeting"),
    path('media/get_questions/<str:domain>',views.Get_questions, name='get_questions')
]
