import json
from django.http import JsonResponse
from django.core.exceptions import ValidationError
from django.db.utils import OperationalError

class ErrorMixin:
    def handle_exception(self, exc):
        if isinstance(exc, ValidationError):
            return JsonResponse({'errors': exc.message_dict}, status=400)
        elif isinstance(exc, PermissionError):
            return JsonResponse({'errors': str(exc)}, status=403)
        elif isinstance(exc, json.decoder.JSONDecodeError):
            return JsonResponse({'errors': str(exc)}, status=400)
        elif isinstance(exc, OperationalError):
            return JsonResponse({'errors': str(exc)}, status=500)
        # elif isinstance(exc, TypeError):
        #     return JsonResponse({'errors': str(exc)}, status=500)
        else:
            return JsonResponse({
                # 'errors': 'An unexpected error occurred.',
                'errors': str(exc),
                'type': type(exc).__name__,
            }, status=500)

    def dispatch(self, request, *args, **kwargs):
        try:
            return super().dispatch(request, *args, **kwargs)
        except Exception as exc:
            return self.handle_exception(exc)