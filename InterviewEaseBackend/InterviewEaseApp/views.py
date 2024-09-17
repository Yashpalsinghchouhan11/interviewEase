from django.shortcuts import render
from django.shortcuts import HttpResponse
import json
from django.http import FileResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.conf import settings
import os

# Create your views here.

@csrf_exempt
@require_POST
def Question(request):
    if request.method == 'POST' and 'category' in request.GET:
        data = request.GET['category']
        print(data)
        return HttpResponse(f"Received category: {data}")
    return HttpResponse("Invalid request", status=400)

@csrf_exempt
def Greeting(request, filename):
    if request.method == 'GET':
        file_path = os.path.join(settings.BASE_DIR,'InterviewEaseBackend','media',filename)
        print(file_path)
        if os.path.exists(file_path):
            return FileResponse(open(file_path, 'rb'), content_type='audio/mpeg')
        else:
            return HttpResponse('File does not found', status=404)

@csrf_exempt
def Get_questions(request, domain):
    if request.method == 'GET':

        print(domain)
        filename = f'{domain}question.json'
        file_path = os.path.join(settings.BASE_DIR, 'InterviewEaseBackend', 'media', filename)

        try:
            with open(file_path, 'r') as file:
                questions = json.load(file)
        except FileNotFoundError:
            return JsonResponse({'error': 'Question file not found.'}, status=404)
        
        if questions:
            questionList = []
            for question in questions:
                questionList.append(question['question'])

            return JsonResponse({'questions': questionList}, status=200)
        else:
            return JsonResponse({'error': 'Question not found.'}, status=404)
