from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth.models import AnonymousUser
from tokens.models import AuthToken  # Adjust the import path based on your project structure


class TokenAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        token = request.META.get('HTTP_AUTHORIZATION', '').replace('Token ', '')
        if token:
            try:
                auth_token = AuthToken.objects.get(token=token)
                request.user = auth_token.user
            except AuthToken.DoesNotExist:
                return JsonResponse({"error": "Invalid token"}, status=401)
        else:
            request.user = AnonymousUser()
