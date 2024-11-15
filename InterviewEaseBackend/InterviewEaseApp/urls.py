from django.urls import path
from . import views

urlpatterns = [
    path('category/',views.Question, name='category'),
    path('media/<str:filename>', views.Greeting, name="Greeting"),
    path('media/get_questions/<str:domain>',views.Get_questions, name='get_questions'),
    path('interview/create/',views.create_interview,name="create interview"),
    path("getquestions/<str:interview_id>",views.getQuestions,name="get_questions"),
]
