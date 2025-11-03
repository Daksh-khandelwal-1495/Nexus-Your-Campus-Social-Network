from flask import Blueprint, request, jsonify
from backend.services.database import Neo4jConnection
from backend.models.user import User

users_bp = Blueprint('users', __name__)
db = Neo4jConnection()

@users_bp.route('/users', methods=['POST'])
def create_user():
    data = request.json
    user = User(name=data['name'], student_id=data['student_id'])
    query = "CREATE (u:Student {name: $name, student_id: $student_id}) RETURN u"
    db.run_query(query, {'name': user.name, 'student_id': user.student_id})
    return jsonify({"message": "User created successfully"}), 201

@users_bp.route('/users/<student_id>', methods=['GET'])
def get_user(student_id):
    query = "MATCH (u:Student {student_id: $student_id}) RETURN u"
    result = db.run_query(query, {'student_id': student_id})
    if result:
        return jsonify(result), 200
    return jsonify({"message": "User not found"}), 404

@users_bp.route('/users/<student_id>', methods=['DELETE'])
def delete_user(student_id):
    query = "MATCH (u:Student {student_id: $student_id}) DELETE u"
    db.run_query(query, {'student_id': student_id})
    return jsonify({"message": "User deleted successfully"}), 200