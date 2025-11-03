from neo4j import GraphDatabase

class User:
    def __init__(self, name, student_id):
        self.name = name
        self.student_id = student_id

    @staticmethod
    def create_user(driver, name, student_id):
        with driver.session() as session:
            session.run("CREATE (u:Student {name: $name, student_id: $student_id})",
                        name=name, student_id=student_id)

    @staticmethod
    def get_user(driver, student_id):
        with driver.session() as session:
            result = session.run("MATCH (u:Student {student_id: $student_id}) RETURN u", student_id=student_id)
            return result.single()

    @staticmethod
    def delete_user(driver, student_id):
        with driver.session() as session:
            session.run("MATCH (u:Student {student_id: $student_id}) DELETE u", student_id=student_id)