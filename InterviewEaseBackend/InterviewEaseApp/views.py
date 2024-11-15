from django.shortcuts import render
from django.shortcuts import HttpResponse
from django.http import FileResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.conf import settings
import os
import json
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .serializers import InterviewSerializer
from Authentication.models import signupModel as User
from Authentication.views import verify_token

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
        filename = f'{domain}.json'
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
        



@csrf_exempt
@api_view(['POST'])
def create_interview(request):
    # Verify JWT token
    user_id, error_response = verify_token(request)
    if error_response:
        return error_response  # Return error if token is invalid

    # Get the authenticated user
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)

    # Parse the form data using JSONParser for request data
    data = json.loads(request.body.decode('utf-8'))
    data['user'] = user.id  # Add user ID to data explicitly

    # Initialize the InterviewSerializer with data
    serializer = InterviewSerializer(data=data)
    if serializer.is_valid():
        # print(serializer)
        interview = serializer.save()
        return Response({'status': 'success', 'interview_id': interview.id}, status=status.HTTP_201_CREATED)
    else:
        return Response({'status':'error', 'message':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    

@csrf_exempt
def getQuestions(request,interview_id):
    if request.method == "GET":
        print(interview_id)
        return JsonResponse({"status":200, "id":interview_id})