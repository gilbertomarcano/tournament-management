import json
from typing import Any

from django.http import JsonResponse
from django.views import View
from django.contrib.auth import authenticate, login
from django.db.models import CharField
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.contrib.auth.middleware import AuthenticationMiddleware
from tokens.models import AuthToken
from utils.mixins import ErrorMixin
from utils.serializers import ModelSerializer
from utils.validators import FieldValidator
from django.core.serializers.python import Serializer

from django.contrib.auth.decorators import login_required

from django.contrib.auth.mixins import LoginRequiredMixin

class TokenSerializer(Serializer):
    def end_object(self, obj: AuthToken) -> None:
        return super().end_object(obj)


@method_decorator(csrf_exempt, name='dispatch')
class TokenView(ErrorMixin, View):
    def get(self, request):
        return JsonResponse({'data': 'happy'}, status=200)
    
    def post(self, request):
        print('USER ->', request.user)
        """Handles POST requests for user authentication."""
        # Example: Extract username and password from request.POST
        data = json.loads(request.body or '{}')
        validator = FieldValidator(
            username=CharField(),
            password=CharField(),
        )
        validated_data = validator.validate(data)
        user = authenticate(request, username=validated_data['username'], password=validated_data['password'])
        if user is not None:
            login(request, user)
            token, _ = AuthToken.objects.get_or_create(user=user)
            serialized_data = ModelSerializer().serialize(token)
            return JsonResponse(serialized_data, status=200)
        else:
            serialized_data = {"error": "Invalid credentials"}
            return JsonResponse(serialized_data, status=401)
