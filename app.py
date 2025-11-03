# app.py
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from db_connector import Neo4jConnection
import logging
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)

app = Flask(__name__, 
            template_folder='frontend/templates', 
            static_folder='frontend/static')
CORS(app)

# Initialize Neo4j connection
neo4j_uri = os.getenv('NEO4J_URI', 'bolt://localhost:7687')
neo4j_user = os.getenv('NEO4J_USER', 'neo4j')
neo4j_password = os.getenv('NEO4J_PASSWORD', 'password')

# Debug logging
print(f"Loading Neo4j connection with:")
print(f"URI: {neo4j_uri}")
print(f"User: {neo4j_user}")
print(f"Password: {'*' * len(neo4j_password) if neo4j_password else 'None'}")

db = Neo4jConnection(
    uri=neo4j_uri,
    user=neo4j_user,
    password=neo4j_password
)

@app.route('/')
def index():
    """Serve the main HTML page."""
    return render_template('index.html')

# CRUD Operations

@app.route('/api/student', methods=['POST'])
def create_student():
    """Create a new Student node."""
    try:
        data = request.get_json()
        name = data.get('name')
        student_id = data.get('student_id')
        
        if not name or not student_id:
            return jsonify({'error': 'Name and student_id are required'}), 400
        
        query = """
        CREATE (s:Student {name: $name, student_id: $student_id})
        RETURN s
        """
        result = db.run_query(query, {'name': name, 'student_id': student_id})
        
        return jsonify({'success': True, 'data': result}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/course', methods=['POST'])
def create_course():
    """Create a new Course node."""
    try:
        data = request.get_json()
        name = data.get('name')
        code = data.get('code')
        
        if not name or not code:
            return jsonify({'error': 'Name and code are required'}), 400
        
        query = """
        CREATE (c:Course {name: $name, code: $code})
        RETURN c
        """
        result = db.run_query(query, {'name': name, 'code': code})
        
        return jsonify({'success': True, 'data': result}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/club', methods=['POST'])
def create_club():
    """Create a new Club node."""
    try:
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        
        if not name or not description:
            return jsonify({'error': 'Name and description are required'}), 400
        
        query = """
        CREATE (c:Club {name: $name, description: $description})
        RETURN c
        """
        result = db.run_query(query, {'name': name, 'description': description})
        
        return jsonify({'success': True, 'data': result}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/student/<student_id>', methods=['GET'])
def get_student(student_id):
    """Read and return a single student's details."""
    try:
        query = """
        MATCH (s:Student {student_id: $student_id})
        RETURN s
        """
        result = db.run_query(query, {'student_id': student_id})
        
        if not result:
            return jsonify({'error': 'Student not found'}), 404
        
        return jsonify({'success': True, 'data': result[0]}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/student/<student_id>', methods=['DELETE'])
def delete_student(student_id):
    """Delete a student node using DETACH DELETE."""
    try:
        query = """
        MATCH (s:Student {student_id: $student_id})
        DETACH DELETE s
        RETURN count(s) as deleted_count
        """
        result = db.run_query(query, {'student_id': student_id})
        
        return jsonify({'success': True, 'deleted_count': result[0]['deleted_count']}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Relationship Operations

@app.route('/api/relation/follow', methods=['POST'])
def create_follow_relationship():
    """Create a FOLLOWS relationship between two students."""
    try:
        data = request.get_json()
        student1_id = data.get('student1_id')
        student2_id = data.get('student2_id')
        
        if not student1_id or not student2_id:
            return jsonify({'error': 'Both student1_id and student2_id are required'}), 400
        
        query = """
        MATCH (s1:Student {student_id: $student1_id})
        MATCH (s2:Student {student_id: $student2_id})
        CREATE (s1)-[:FOLLOWS]->(s2)
        RETURN s1, s2
        """
        result = db.run_query(query, {'student1_id': student1_id, 'student2_id': student2_id})
        
        return jsonify({'success': True, 'data': result}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/relation/enroll', methods=['POST'])
def create_enrollment_relationship():
    """Create an ENROLLED_IN relationship."""
    try:
        data = request.get_json()
        student_id = data.get('student_id')
        course_code = data.get('course_code')
        
        if not student_id or not course_code:
            return jsonify({'error': 'Both student_id and course_code are required'}), 400
        
        query = """
        MATCH (s:Student {student_id: $student_id})
        MATCH (c:Course {code: $course_code})
        CREATE (s)-[:ENROLLED_IN]->(c)
        RETURN s, c
        """
        result = db.run_query(query, {'student_id': student_id, 'course_code': course_code})
        
        return jsonify({'success': True, 'data': result}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/relation/join_club', methods=['POST'])
def create_club_membership():
    """Create a MEMBER_OF relationship."""
    try:
        data = request.get_json()
        student_id = data.get('student_id')
        club_name = data.get('club_name')
        
        if not student_id or not club_name:
            return jsonify({'error': 'Both student_id and club_name are required'}), 400
        
        query = """
        MATCH (s:Student {student_id: $student_id})
        MATCH (c:Club {name: $club_name})
        CREATE (s)-[:MEMBER_OF]->(c)
        RETURN s, c
        """
        result = db.run_query(query, {'student_id': student_id, 'club_name': club_name})
        
        return jsonify({'success': True, 'data': result}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Complex Query Operations

@app.route('/api/student/<student_id>/following', methods=['GET'])
def get_student_following(student_id):
    """Find all students this student follows."""
    try:
        query = """
        MATCH (s:Student {student_id: $student_id})-[:FOLLOWS]->(followed:Student)
        RETURN followed
        """
        result = db.run_query(query, {'student_id': student_id})
        
        return jsonify({'success': True, 'data': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/student/<student_id>/followers', methods=['GET'])
def get_student_followers(student_id):
    """Find all students who follow this student."""
    try:
        query = """
        MATCH (follower:Student)-[:FOLLOWS]->(s:Student {student_id: $student_id})
        RETURN follower
        """
        result = db.run_query(query, {'student_id': student_id})
        
        return jsonify({'success': True, 'data': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/course/<course_code>/students', methods=['GET'])
def get_course_students(course_code):
    """Find all students enrolled in this course."""
    try:
        query = """
        MATCH (s:Student)-[:ENROLLED_IN]->(c:Course {code: $course_code})
        RETURN s
        """
        result = db.run_query(query, {'course_code': course_code})
        
        return jsonify({'success': True, 'data': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/club/<club_name>/members', methods=['GET'])
def get_club_members(club_name):
    """Find all students who are members of this club."""
    try:
        query = """
        MATCH (s:Student)-[:MEMBER_OF]->(c:Club {name: $club_name})
        RETURN s
        """
        result = db.run_query(query, {'club_name': club_name})
        
        return jsonify({'success': True, 'data': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/student/<student_id>/suggested_friends', methods=['GET'])
def get_suggested_friends(student_id):
    """Find friends of friends (suggested friends)."""
    try:
        query = """
        MATCH (s:Student {student_id: $student_id})-[:FOLLOWS]->(friend:Student)-[:FOLLOWS]->(suggested:Student)
        WHERE NOT (s)-[:FOLLOWS]->(suggested) AND s <> suggested
        RETURN DISTINCT suggested
        """
        result = db.run_query(query, {'student_id': student_id})
        
        return jsonify({'success': True, 'data': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/student/<student_id>/common_interests', methods=['GET'])
def get_common_interests(student_id):
    """Find students with shared courses or clubs and show what they have in common."""
    try:
        query = """
        MATCH (s:Student {student_id: $student_id})
        MATCH (other:Student)
        WHERE s <> other
        
        // Find common courses
        OPTIONAL MATCH (s)-[:ENROLLED_IN]->(course:Course)<-[:ENROLLED_IN]-(other)
        WITH s, other, collect(DISTINCT course.name) as common_courses
        
        // Find common clubs
        OPTIONAL MATCH (s)-[:MEMBER_OF]->(club:Club)<-[:MEMBER_OF]-(other)
        WITH s, other, common_courses, collect(DISTINCT club.name) as common_clubs
        
        // Return only students with at least one common interest
        WHERE size(common_courses) > 0 OR size(common_clubs) > 0
        
        RETURN other.name as student_name, 
               other.student_id as student_id,
               common_courses,
               common_clubs,
               (size(common_courses) + size(common_clubs)) as total_common_interests
        ORDER BY total_common_interests DESC
        """
        result = db.run_query(query, {'student_id': student_id})
        
        return jsonify({'success': True, 'data': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/popular_courses', methods=['GET'])
def get_popular_courses():
    """Find the top 3 courses with the most students enrolled."""
    try:
        query = """
        MATCH (s:Student)-[:ENROLLED_IN]->(c:Course)
        RETURN c, COUNT(s) as student_count
        ORDER BY student_count DESC
        LIMIT 3
        """
        result = db.run_query(query)
        
        return jsonify({'success': True, 'data': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    try:
        app.run(debug=True, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\nShutting down...")
    finally:
        db.close()