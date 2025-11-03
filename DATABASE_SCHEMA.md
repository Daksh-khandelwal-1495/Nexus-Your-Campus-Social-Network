# Nexus Database Schema Documentation

## Overview
Nexus uses a Neo4j graph database to model the complex relationships within a campus social network. The schema is designed to represent students, courses, clubs, and their interconnections efficiently.

## Database Architecture

### Graph Database Choice
- **Technology**: Neo4j (Graph Database)
- **Reason**: Perfect for modeling social networks with complex relationships
- **Advantages**: 
  - Efficient traversal of relationships
  - Natural representation of social connections
  - Flexible schema evolution
  - Powerful query capabilities with Cypher

## Schema Components

### Node Types

#### 1. Student
- **Label**: `Student`
- **Properties**:
  - `name` (String): Full name of the student
  - `student_id` (String): Unique identifier (e.g., "S001")
- **Purpose**: Represents individual students in the campus network
- **Relationships**: Can follow other students, enroll in courses, join clubs

#### 2. Course
- **Label**: `Course`
- **Properties**:
  - `name` (String): Full course name (e.g., "Introduction to Computer Science")
  - `code` (String): Course code (e.g., "CS101")
- **Purpose**: Represents academic courses offered by the institution
- **Relationships**: Students can enroll in courses

#### 3. Club
- **Label**: `Club`
- **Properties**:
  - `name` (String): Club name (e.g., "Debate Club")
  - `description` (String): Club description and purpose
- **Purpose**: Represents student organizations and extracurricular activities
- **Relationships**: Students can be members of clubs

### Relationship Types

#### 1. FOLLOWS
- **Direction**: Student → Student
- **Purpose**: Represents social connections between students
- **Properties**: None (simple relationship)
- **Use Case**: Building social networks, friend suggestions

#### 2. ENROLLED_IN
- **Direction**: Student → Course
- **Purpose**: Represents academic enrollment
- **Properties**: None
- **Use Case**: Finding classmates, course popularity analysis

#### 3. MEMBER_OF
- **Direction**: Student → Club
- **Purpose**: Represents club membership
- **Properties**: None
- **Use Case**: Finding club members, interest-based connections

## Key Database Operations

### Social Network Analysis
1. **Friend Suggestions**: Find students who share courses or clubs
2. **Common Interests**: Identify students with similar academic/social interests
3. **Popular Courses**: Rank courses by enrollment count
4. **Network Traversal**: Find friends of friends (2nd degree connections)

### Query Patterns

#### 1. Find Students with Common Interests
```cypher
MATCH (s1:Student {student_id: $student_id})
MATCH (s2:Student)
WHERE s1 <> s2
OPTIONAL MATCH (s1)-[:ENROLLED_IN]->(course:Course)<-[:ENROLLED_IN]-(s2)
OPTIONAL MATCH (s1)-[:MEMBER_OF]->(club:Club)<-[:MEMBER_OF]-(s2)
WITH s2, 
     collect(DISTINCT course.name) as common_courses,
     collect(DISTINCT club.name) as common_clubs
WHERE size(common_courses) > 0 OR size(common_clubs) > 0
RETURN s2.name as student_name, s2.student_id as student_id,
       common_courses, common_clubs,
       (size(common_courses) + size(common_clubs)) as total_common_interests
ORDER BY total_common_interests DESC
```

#### 2. Get Popular Courses
```cypher
MATCH (s:Student)-[:ENROLLED_IN]->(c:Course)
WITH c, count(s) as student_count
ORDER BY student_count DESC
RETURN c, student_count
```

#### 3. Find Suggested Friends
```cypher
MATCH (student:Student {student_id: $student_id})-[:FOLLOWS]->(followed:Student)
MATCH (followed)-[:FOLLOWS]->(suggested:Student)
WHERE suggested <> student 
  AND NOT (student)-[:FOLLOWS]->(suggested)
RETURN DISTINCT suggested
```

## Database Performance Considerations

### Indexing Strategy
- **Student ID Index**: For fast student lookups
- **Course Code Index**: For quick course identification
- **Club Name Index**: For efficient club searches

### Relationship Optimization
- **Bidirectional Queries**: Some relationships modeled as unidirectional for simplicity
- **Relationship Properties**: Minimal properties to maintain performance
- **Query Optimization**: Use of parameterized queries to prevent injection

## Schema Evolution

### Extensibility
The current schema can be easily extended to include:
- **Event** nodes for campus events
- **Department** nodes for academic departments
- **Semester** nodes for temporal data
- **Rating** relationships for course/club feedback
- **Message** nodes for direct messaging

### Migration Considerations
- Neo4j allows dynamic schema changes
- New node types and relationships can be added without downtime
- Existing data remains unaffected during schema evolution

## Technical Implementation

### Connection Details
- **Database Type**: Neo4j Aura (Cloud)
- **Driver**: Neo4j Python Driver
- **Connection Pool**: Managed by neo4j-driver
- **Query Language**: Cypher

### API Endpoints for Schema
- `GET /api/schema` - Complete database schema
- `GET /api/schema/visual` - Visual schema representation
- Schema export functionality for documentation

## Data Integrity

### Constraints
- Unique constraints on student IDs
- Required properties validation
- Relationship cardinality checks

### Validation
- Input sanitization on all endpoints
- Parameterized queries to prevent injection
- Error handling for constraint violations

## Use Cases Supported

1. **Student Discovery**: Find students by interests, courses, clubs
2. **Social Networking**: Follow/unfollow functionality
3. **Academic Integration**: Course enrollment tracking
4. **Club Management**: Club membership and discovery
5. **Analytics**: Network analysis and statistics
6. **Recommendations**: Friend and interest suggestions

## Reporting and Analytics

The schema supports various analytical queries:
- Network density analysis
- Popular courses identification
- Club membership trends
- Social connection patterns
- Student engagement metrics

This flexible graph schema efficiently models the complex relationships inherent in a campus social network while maintaining performance and scalability.