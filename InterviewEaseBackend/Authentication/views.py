from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .serializer import signupSerializer
from .models import signupModel
from rest_framework_simplejwt.tokens import RefreshToken # type: ignore
from django.contrib.auth import login as auth_login, logout as auth_logout, authenticate
import jwt
from jwt.exceptions import InvalidTokenError
import os
import dotenv

dotenv.load_dotenv()
@csrf_exempt
def Verify_token(request,token):
    if request.method == 'GET':
        try:
            verifyToken = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms='HS256')
            print(verifyToken)
        #     return verifyToken

        except Exception as e:
            print('error: ',e)


@csrf_exempt
@require_POST
def signUp(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            serializer = signupSerializer(data=data)
            if serializer.is_valid():
                user = serializer.save()
                refresh = RefreshToken.for_user(user)
                response_data = {
                    'refresh_token':str(refresh),
                    'access_token': str(refresh.access_token),
                }
                return JsonResponse(response_data, status=201)
            else:
                return JsonResponse({'error':'Email already used !'}, status=400)
        except Exception as e:
            return JsonResponse({'error':str(e)},status=500)


@csrf_exempt
@require_POST
def login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return JsonResponse(
                    {'error': 'Email and password are required!'},
                    status=400
                )
            
            # Check if the user exists
            try:
                isUser = signupModel.objects.get(email=email)
            except signupModel.DoesNotExist:

                return JsonResponse({'error':'User does not exist!'}, status=404)
                
            user = authenticate(request, email=email, password=password)
            if user is not None:
                auth_login(request, user)
                refresh = RefreshToken.for_user(user)
                print(user)
                Response_data = {
                    'refresh_token':str(refresh),
                    'access_token':str(refresh.access_token),
                }
                return JsonResponse(Response_data, status=200)
            else:
                return JsonResponse({'error':'invalid credentials!'}, status=401)
        except :
            return JsonResponse({'error': 'An unexpected error occurred. Please try again later.'},status=500)
        

