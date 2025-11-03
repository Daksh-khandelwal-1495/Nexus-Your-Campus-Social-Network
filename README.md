# 🌐 Nexus - Campus Social Network

**Connect. Discover. Thrive.**

A modern, full-stack campus social network built with Python Flask and Neo4j graph database. Nexus empowers students to connect with peers, discover shared interests, and build meaningful relationships within their university community.

## 🎯 Why Nexus?

Nexus transforms the way students connect on campus by leveraging the power of graph databases to understand complex social relationships. Unlike traditional social platforms, Nexus is purpose-built for the unique needs of university communities.

### **� Core Values**
- **Connect**: Build meaningful relationships with fellow students
- **Discover**: Find students with shared academic and social interests  
- **Thrive**: Create a vibrant, engaged campus community

## 🚀 Features

### **👥 Social Networking**
- **Student Profiles**: Beautiful profile cards with academic and social statistics
- **Follow System**: Connect with classmates and build your network
- **Smart Suggestions**: AI-powered friend recommendations based on shared interests
- **Common Interests**: Discover students in your courses and clubs

### **🎓 Academic Integration**
- **Course Management**: Track enrollments and find study partners
- **Club Discovery**: Join clubs and connect with like-minded students
- **Popular Courses**: See trending courses across campus
- **Academic Analytics**: Understand course and club participation patterns

### **📊 Modern Interface**
- **Responsive Design**: Beautiful interface that works on all devices
- **Real-time Notifications**: Instant feedback with elegant toast notifications
- **Dashboard Analytics**: Campus network insights and statistics
- **Search & Filter**: Easily discover students, courses, and clubs

## 🛠 Technology Stack

- **Backend**: Python Flask
- **Database**: Neo4j Graph Database
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **API**: RESTful endpoints with JSON responses
- **Graph Driver**: Neo4j Python Driver

## 📁 Project Structure

```
college-social-network/
├── app.py                 # Main Flask application with 15 API endpoints
├── db_connector.py        # Neo4j connection and query handler
├── requirements.txt       # Python dependencies
├── .env.example          # Environment configuration template
├── README.md             # This file
└── frontend/
    ├── templates/
    │   └── index.html    # Main frontend interface
    └── static/
        ├── css/
        │   └── styles.css    # Modern, responsive styling
        └── js/
            └── app.js        # Frontend API interactions
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Neo4j Database (local or remote)
- Modern web browser

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd college-social-network
   ```

2. **Set up virtual environment**:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your Neo4j credentials
   ```

5. **Start Neo4j Database**:
   - Install Neo4j Desktop or use Neo4j Cloud
   - Create a new database
   - Update connection details in `.env`

6. **Run the application**:
   ```bash
   python app.py
   ```

7. **Access the application**:
   Open http://localhost:5000 in your browser

## 🔧 Configuration

Create a `.env` file based on `.env.example`:

```env
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
FLASK_ENV=development
FLASK_DEBUG=True
```

## 📚 API Endpoints

### CRUD Operations
- `POST /api/student` - Create a new student
- `POST /api/course` - Create a new course  
- `POST /api/club` - Create a new club
- `GET /api/student/{student_id}` - Get student details
- `DELETE /api/student/{student_id}` - Delete student

### Relationships
- `POST /api/relation/follow` - Create follow relationship
- `POST /api/relation/enroll` - Enroll student in course
- `POST /api/relation/join_club` - Join student to club

### Social Features
- `GET /api/student/{student_id}/following` - Get who student follows
- `GET /api/student/{student_id}/followers` - Get student's followers
- `GET /api/student/{student_id}/suggested_friends` - Get friend suggestions
- `GET /api/student/{student_id}/common_interests` - Find common interests

### Analytics
- `GET /api/course/{course_code}/students` - Get course enrollment
- `GET /api/club/{club_name}/members` - Get club membership
- `GET /api/popular_courses` - Get top 3 popular courses

## 🎮 Usage Examples

### Creating Test Data
1. Create students using the "Create Student" form
2. Create courses and clubs
3. Build relationships using the relationship forms
4. Explore social features and analytics

### Sample Neo4j Graph Schema
```cypher
// Create sample data
CREATE (alice:Student {name: "Alice Johnson", student_id: "S001"})
CREATE (bob:Student {name: "Bob Smith", student_id: "S002"})
CREATE (cs101:Course {name: "Introduction to Computer Science", code: "CS101"})
CREATE (debate:Club {name: "Debate Club", description: "College debate team"})

// Create relationships
CREATE (alice)-[:FOLLOWS]->(bob)
CREATE (alice)-[:ENROLLED_IN]->(cs101)
CREATE (bob)-[:MEMBER_OF]->(debate)
```

## 🔍 Graph Database Benefits

This project showcases how graph databases excel at:
- **Relationship Queries**: Finding friends of friends efficiently
- **Pattern Matching**: Discovering common interests across the network
- **Social Analytics**: Calculating social metrics and suggestions
- **Flexible Schema**: Easy addition of new relationship types

## 🛡 Security Features

- Parameterized Cypher queries prevent injection attacks
- CORS enabled for frontend-backend communication
- Error handling with appropriate HTTP status codes
- Input validation on all endpoints

## 🚧 Development

### Adding New Features
1. Define new Cypher queries in `app.py`
2. Add corresponding frontend forms in `index.html`
3. Implement JavaScript handlers in `app.js`
4. Update CSS styling as needed

### Testing
- Use the web interface to test all features
- Monitor Neo4j browser for graph visualization
- Check Flask console for debugging information

## 📊 Future Enhancements

- User authentication and sessions
- Real-time notifications
- Advanced graph analytics
- Professor and course management
- Mobile-responsive design improvements
- Graph visualization interface

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.