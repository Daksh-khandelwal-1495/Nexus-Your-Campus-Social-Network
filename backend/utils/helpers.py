def generate_unique_id():
    import uuid
    return str(uuid.uuid4())

def format_response(data, message="", status=200):
    return {
        "status": status,
        "message": message,
        "data": data
    }

def validate_user_input(data, required_fields):
    for field in required_fields:
        if field not in data or not data[field]:
            return False, f"{field} is required."
    return True, ""