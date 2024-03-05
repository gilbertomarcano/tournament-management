from functools import partial

from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin

from django.contrib import auth

from django.contrib.auth.models import AnonymousUser
from tokens.models import AuthToken  # Adjust the import path based on your project structure
from django.contrib.auth.middleware import AuthenticationMiddleware

async def auser(request):
    if not hasattr(request, "_acached_user"):
        request._acached_user = await auth.aget_user(request)
    return request._acached_user


class TokenAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        token = request.META.get('HTTP_AUTHORIZATION', '').replace('Token ', '')
        if token:
            try:
                auth_token = AuthToken.objects.get(token=token)
                request.user = auth_token.user
                request._cached_user = auth_token.user
            except AuthToken.DoesNotExist:
                return JsonResponse({"error": "Invalid token"}, status=401)
        else:
            request.user = AnonymousUser()
        request.auser = partial(auser, request)
