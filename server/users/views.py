# Create your views here.
from collections.abc import Collection, Iterable
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.views import View
from utils.serializers import ModelSerializer
from utils.mixins import ErrorMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required

class UserListView(ErrorMixin, View):
    def get(self, request):
        """Handles GET requests to list users."""
        users = User.objects.all()
        serialized_data = ModelSerializer().serialize(users, exclude=['password'])
        return JsonResponse({'data': serialized_data}, status=200)


class UserView(ErrorMixin, View):
    def get(self, request, user_id):
        """Handles GET requests to list users."""
        user = User.objects.get(id=user_id)
        serialized_data = ModelSerializer().serialize(user, exclude=['password'])
        return JsonResponse(serialized_data, status=200)


class UserMeView(ErrorMixin, View):
    def get(self, request):
        """Handles GET requests to list users."""
        user = request.user
        serialized_data = ModelSerializer().serialize(user, exclude=['password'])
        return JsonResponse(serialized_data, status=200)