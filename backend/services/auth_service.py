from werkzeug.security import generate_password_hash, check_password_hash
from backend.services.database import Neo4jConnection

class AuthService:
    def __init__(self):
        self.db = Neo4jConnection()

    def register_user(self, name, student_id, password):
        hashed_password = generate_password_hash(password)
        query = """
        CREATE (u:Student {name: $name, student_id: $student_id, password: $password})
        """
        self.db.execute_query(query, name=name, student_id=student_id, password=hashed_password)

    def authenticate_user(self, student_id, password):
        query = """
        MATCH (u:Student {student_id: $student_id})
        RETURN u.password AS password
        """
        result = self.db.execute_query(query, student_id=student_id)
        if result and check_password_hash(result[0]['password'], password):
            return True
        return False

    def get_user(self, student_id):
        query = """
        MATCH (u:Student {student_id: $student_id})
        RETURN u.name AS name, u.student_id AS student_id
        """
        return self.db.execute_query(query, student_id=student_id)