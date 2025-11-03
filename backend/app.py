from flask import Flask
from flask_cors import CORS
from services.database import Neo4jConnection
from routes import auth, users, posts
import os

app = Flask(__name__)
CORS(app)

# Load configuration from environment variables
app.config['NEO4J_URI'] = os.getenv('NEO4J_URI')
app.config['NEO4J_USER'] = os.getenv('NEO4J_USER')
app.config['NEO4J_PASSWORD'] = os.getenv('NEO4J_PASSWORD')

# Initialize Neo4j connection
neo4j_connection = Neo4jConnection(app.config['NEO4J_URI'], app.config['NEO4J_USER'], app.config['NEO4J_PASSWORD'])

# Register routes
app.register_blueprint(auth.bp)
app.register_blueprint(users.bp)
app.register_blueprint(posts.bp)

@app.route('/')
def home():
    return "Welcome to the College Social Network API!"

if __name__ == '__main__':
    app.run(debug=True)