from flask import Blueprint, request, jsonify
from backend.services.database import Neo4jConnection
from backend.models.post import Post

posts_bp = Blueprint('posts', __name__)
db = Neo4jConnection()

@posts_bp.route('/posts', methods=['POST'])
def create_post():
    data = request.json
    title = data.get('title')
    content = data.get('content')
    student_id = data.get('student_id')

    if not title or not content or not student_id:
        return jsonify({'error': 'Missing required fields'}), 400

    post = Post(title=title, content=content, student_id=student_id)
    query = """
    CREATE (p:Post {title: $title, content: $content, student_id: $student_id})
    RETURN p
    """
    result = db.execute_query(query, {
        'title': post.title,
        'content': post.content,
        'student_id': post.student_id
    })

    return jsonify(result), 201

@posts_bp.route('/posts/<student_id>', methods=['GET'])
def get_posts_by_student(student_id):
    query = """
    MATCH (p:Post {student_id: $student_id})
    RETURN p
    """
    result = db.execute_query(query, {'student_id': student_id})

    return jsonify(result), 200

@posts_bp.route('/posts/<post_id>', methods=['DELETE'])
def delete_post(post_id):
    query = """
    MATCH (p:Post)
    WHERE id(p) = $post_id
    DELETE p
    """
    db.execute_query(query, {'post_id': post_id})

    return jsonify({'message': 'Post deleted successfully'}), 204