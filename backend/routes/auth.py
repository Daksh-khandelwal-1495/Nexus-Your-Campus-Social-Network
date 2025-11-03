from flask import Blueprint, request, jsonify
from backend.services.auth_service import register_user, login_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    student_id = data.get('student_id')
    password = data.get('password')
    
    if not name or not student_id or not password:
        return jsonify({'error': 'Missing required fields'}), 400
    
    user = register_user(name, student_id, password)
    if user:
        return jsonify({'message': 'User registered successfully'}), 201
    return jsonify({'error': 'User registration failed'}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    student_id = data.get('student_id')
    password = data.get('password')
    
    if not student_id or not password:
        return jsonify({'error': 'Missing required fields'}), 400
    
    token = login_user(student_id, password)
    if token:
        return jsonify({'token': token}), 200
    return jsonify({'error': 'Invalid credentials'}), 401