# Create your views here.
from collections.abc import Collection, Iterable
import json
from typing import Any
from django.db.models.base import Model
from django.http import JsonResponse
from django.core import serializers
from django.contrib.auth.models import User
from django.views import View
from django.db import models
from django.core.serializers.python import Serializer


class UserSerializer(Serializer):
    def end_object(self, obj: Any) -> None:
        print('hello')
        print(self)
        print(self.objects)
        obj.custom = 'custom_value'
        print(obj, type(obj))
        # self.objects[-1]['custom_field'] = 'custom_value'
        return super().end_object(obj)


class UserListView(View):
    def get(self, request):
        """Handles GET requests to list users."""
        users = User.objects.all()
        serialized_data = UserSerializer().serialize(users)
        return JsonResponse({'data': serialized_data}, status=201)
