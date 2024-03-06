from typing import Any, Collection, Iterable
from django.db.models.base import Model
from django.db.models import QuerySet

# from django.core.serializers import Serializer
from django.core.serializers.python import Serializer

class ModelSerializer(Serializer):
    def serialize(
        self,
        queryset,
        fields=None,
        exclude=None,
        **options,
    ):
        if not isinstance(queryset, QuerySet):
            concrete_model = queryset._meta.concrete_model
            queryset = [queryset]
        elif queryset:
            concrete_model = queryset[0]._meta.concrete_model
        else:
            return []
        
        if fields and exclude:
            raise TypeError('Cannot set fields and exclude at the same time.')

        if exclude is not None:
            fields = []
            for field in concrete_model._meta.local_fields:
                if field.attname not in exclude:
                    fields.append(field.attname)
        
        data = super().serialize(queryset, fields=fields, **options)
        return data if isinstance(queryset, QuerySet) else data[0]



class TestSerializer(Serializer):
    def end_object(self, obj: Any) -> None:
        print('hello')
        print(self)
        print(self.objects)
        obj.custom = 'custom_value'
        print(obj, type(obj))
        # self.objects[-1]['custom_field'] = 'custom_value'
        return super().end_object(obj)