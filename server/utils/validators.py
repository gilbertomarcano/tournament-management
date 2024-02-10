from django.core.exceptions import ValidationError

class FieldValidator:
    def __init__(self, **fields) -> None:
        self.fields = fields

    def validate(self, data: dict) -> dict:
        errors = {}
        validated_data = {}

        for field_name, field_instance in self.fields.items():
            value = data.get(field_name)

            # Check if the field is required and missing
            if field_instance.blank == False and value is None:
                errors[field_name] = 'This field is required.'
                continue

            # Use the field's own validation mechanism
            try:
                validated_data[field_name] = field_instance.clean(value, None)
            except Exception as e:
                errors[field_name] = str(e)

        if errors:
            raise ValidationError(errors)

        return validated_data