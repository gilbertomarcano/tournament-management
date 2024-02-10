import json

from django.http import JsonResponse
from django.views import View
from django.contrib.auth import authenticate, login
from django.db.models import CharField
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie

from utils.mixins import ErrorMixin
from utils.validators import FieldValidator

@method_decorator(csrf_exempt, name='dispatch')
class AuthView(ErrorMixin, View):
    def get(self, request):
        return JsonResponse({'data': 'happy'}, status=200)
    
    def post(self, request):
        """Handles POST requests for user authentication."""
        # Example: Extract username and password from request.POST
        data = json.loads(request.body)
        validator = FieldValidator(
            username=CharField(),
            password=CharField(),
        )
        validated_data = validator.validate(data)
        user = authenticate(request, username=validated_data['username'], password=validated_data['password'])
        if user is not None:
            login(request, user)
            serialized_data = {"message": "User authenticated successfully"}
            return JsonResponse(serialized_data, status=200)
        else:
            serialized_data = {"error": "Invalid credentials"}
            return JsonResponse(serialized_data, status=401)
