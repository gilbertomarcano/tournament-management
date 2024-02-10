from django.http import JsonResponse
from django.core.exceptions import ValidationError

class ErrorMixin:
    def handle_exception(self, exc):
        if isinstance(exc, ValidationError):
            return JsonResponse({'errors': exc.message_dict}, status=400)
        elif isinstance(exc, PermissionError):
            return JsonResponse({'errors': str(exc)}, status=403)
        # You can add more exception types as needed
        else:
            return JsonResponse({'errors': 'An unexpected error occurred.'}, status=500)

    def dispatch(self, request, *args, **kwargs):
        try:
            return super().dispatch(request, *args, **kwargs)
        except Exception as exc:
            return self.handle_exception(exc)