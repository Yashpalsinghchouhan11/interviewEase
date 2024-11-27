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

from .serializers import InterviewSerializer, AnswerSerializer
from Authentication.models import signupModel as User
from Authentication.views import verify_token
from .models import Interview, Questions, Answers

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

    if "interview_type" in data.keys():
        filename = f'{data["domain"]}.json'
        file_path = os.path.join(settings.BASE_DIR, 'InterviewEaseBackend', 'media', filename)
        a = data.pop("interview_type")
        try:
            with open(file_path, 'r') as file:
                questions = json.load(file)
                data["questions"] = questions[0]["questions"]
        except FileNotFoundError:
            return JsonResponse({'error': 'Question file not found.'}, status=404)
                # Initialize the InterviewSerializer with data
        print(data)
        serializer = InterviewSerializer(data=data)
        if serializer.is_valid():
            # print(serializer)
            interview = serializer.save()
            return Response({'status': 'success', 'interview_id': interview.id}, status=status.HTTP_201_CREATED)
        else:
            return Response({'status':'error', 'message':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    else:
        # Initialize the InterviewSerializer with data
        serializer = InterviewSerializer(data=data)
        if serializer.is_valid():
            # print(serializer)
            interview = serializer.save()
            return Response({'status': 'success', 'interview_id': interview.id}, status=status.HTTP_201_CREATED)
        else:
            return Response({'status':'error', 'message':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)



@csrf_exempt
def Get_questions(request, domain):
    if request.method == 'GET':

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
def getQuestions(request, interview_id):
    if request.method == "GET":
        # Fetch the index from query parameters
        question_index = request.GET.get("index", 0)
        try:
            question_index = int(question_index)
        except ValueError:
            return JsonResponse({"status": 400, "message": "Invalid index format"}, status=400)

        # For hardcoded interview types
        # predefined_interviews = ['SD', 'PM', 'HR', 'CD', 'DS']
        # if interview_id in predefined_interviews:
        #     filename = f'{interview_id}.json'
        #     file_path = os.path.join(settings.BASE_DIR, 'InterviewEaseBackend', 'media', filename)

        #     try:
        #         with open(file_path, 'r') as file:
        #             questions = json.load(file)
        #     except FileNotFoundError:
        #         return JsonResponse({'status': 404, 'message': 'Question file not found.'}, status=404)

        #     if 0 <= question_index < len(questions):
        #         return JsonResponse({
        #             "status": 200,
        #             "question": questions[question_index][str(question_index)],
        #             "index": question_index,
        #             "total_questions": len(questions)
        #         })
        #     else:
        #         return JsonResponse({'status': 400, 'message': 'Invalid question index'}, status=400)

        # # For custom interviews
        # else:
        try:
            interview = Interview.objects.get(pk=interview_id)
        except Interview.DoesNotExist:
            return JsonResponse({"status": 404, "message": "Interview not found"}, status=404)
        questions = Questions.objects.filter(interview=interview).order_by('id')
        if 0 <= question_index < len(questions):
            question = questions[question_index]
            return JsonResponse({
                "status": 200,
                "question": question.question_text,
                "index": question_index,
                "total_questions": len(questions),
                "questionId":question.id
            })
        else:
            return JsonResponse({'status': 400, 'message': 'Invalid question index'}, status=400)

    return JsonResponse({"status": 405, "message": "Method not allowed"}, status=405)



@csrf_exempt
@api_view(['POST'])
def save_answer(request):
    if request.method == 'POST':
        user_id, error_response = verify_token(request)
        if error_response:
            return error_response 
        data=request.data
        newData = {
            "question": data["questionId"],
            "interview": data.get("interviewId"),  # Use .get() to handle null/optional values
            "answer_text": data.get("answer_text", ""),  # Default to an empty string if not provided
            "audio_path": data.get("audio_path"),  # Use .get() for optional fields
        }
        print(newData)
        serializer = AnswerSerializer(data=newData)
        
        # Validate input
        if serializer.is_valid():
            answer = serializer.save()  # Save the validated data
            return Response(
                {
                    "message": "Answer saved successfully",
                    "data": {
                        "id": answer.id,
                        "question": answer.question.question_text,
                        "interview": answer.interview.id if answer.interview else None,
                        "answer_text": answer.answer_text,
                        "audio_path": answer.audio_path.url if answer.audio_path else None,
                    },
                },
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(
                {"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )

    return Response({"error": "Invalid HTTP method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@csrf_exempt
@api_view(['GET'])
def get_answers(request, interview_id):
    try:
        # Verify user token
        user_id, error_response = verify_token(request)
        if error_response:
            return error_response
        
        # Fetch the interview
        interview = Interview.objects.get(pk=interview_id)
        
        # Fetch all answers related to this interview
        answers = Answers.objects.filter(interview=interview)

        # Prepare the response data
        answer_list = [
            {
                "id": answer.id,
                "question": answer.question.question_text,
                "answer_text": answer.answer_text,
                "audio_path": request.build_absolute_uri(answer.audio_path.url),
            }
            for answer in answers
        ]
        
        return JsonResponse(
            {"status": 200, "message": "Answers retrieved successfully", "answers": answer_list},
            status=200,
        )
    
    except Interview.DoesNotExist:
        return JsonResponse({"status": 404, "message": "Interview not found"}, status=404)
    
    except Exception as e:
        return JsonResponse(
            {"status": 500, "message": "An error occurred", "error": str(e)},
            status=500,
        )
