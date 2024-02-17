from typing import Any, Collection, Iterable
from django.db.models.base import Model
from django.db.models import QuerySet

# from django.core.serializers import Serializer
from django.core.serializers.python import Serializer

class ModelSerializer(Serializer):
    def serialize(
        self,
        queryset,
        **options,
    ):
        if not isinstance(queryset, QuerySet):
            queryset = [queryset]
        data = super().serialize(queryset, **options)
        return data if isinstance(queryset, QuerySet) else data[0]
