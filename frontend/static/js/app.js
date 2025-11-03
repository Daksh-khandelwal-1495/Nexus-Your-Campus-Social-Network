// Nexus - Campus Social Network Frontend JavaScript
// Handles all form interactions and API calls

document.addEventListener('DOMContentLoaded', function() {
    console.log('🌐 Nexus Frontend Loaded - Connect. Discover. Thrive.');
    
    // Get the results container
    const resultsContainer = document.getElementById('results');
    
    // Toast Notification System
    function createToastContainer() {
        if (!document.querySelector('.toast-container')) {
            const container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
    }
    
    function showToast(message, type = 'success', duration = 5000) {
        createToastContainer();
        const container = document.querySelector('.toast-container');
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };
        
        toast.innerHTML = `
            <div class="toast-header">
                <span class="toast-icon">${icons[type]}</span>
                <span>${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                <button class="toast-close">&times;</button>
            </div>
            <div class="toast-body">${message}</div>
            <div class="toast-progress"></div>
        `;
        
        container.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Progress bar animation
        const progress = toast.querySelector('.toast-progress');
        setTimeout(() => {
            progress.style.width = '0%';
        }, 200);
        
        // Auto dismiss
        const autoHide = setTimeout(() => {
            hideToast(toast);
        }, duration);
        
        // Manual close
        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(autoHide);
            hideToast(toast);
        });
        
        return toast;
    }
    
    function hideToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
    
    // Enhanced success/error handlers
    function showSuccess(message, data = null) {
        showToast(message, 'success');
        if (data) {
            displayResults(data, 'Success');
        }
    }
    
    function showError(message) {
        showToast(message, 'error');
        displayError(message, 'Error');
    }
    
    function showInfo(message) {
        showToast(message, 'info');
    }
    
    // Tab functionality
    function initializeTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Show corresponding tab content
                const tabId = button.getAttribute('data-tab') + '-tab';
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // Initialize tabs
    initializeTabs();
    
    // Enhanced result display functions
    function displayResults(data, title = 'Results') {
        const timestamp = new Date().toLocaleTimeString();
        
        // Check if data has special formatting needs
        if (title.includes('Common Interests') && data.data && Array.isArray(data.data)) {
            displayCommonInterestsTable(data.data, title, timestamp);
        } else if (title.includes('Popular Courses') && data.data && Array.isArray(data.data)) {
            displayPopularCoursesTable(data.data, title, timestamp);
        } else if ((title.includes('Students') || title.includes('Members') || title.includes('Following') || title.includes('Followers')) && data.data && Array.isArray(data.data)) {
            displayStudentTable(data.data, title, timestamp);
        } else {
            // Default JSON display
            const resultHtml = `
                <div class="success">
                    <h4>✅ ${title} (${timestamp})</h4>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                </div>
            `;
            resultsContainer.innerHTML = resultHtml;
        }
    }
    
    function displayCommonInterestsTable(data, title, timestamp) {
        if (data.length === 0) {
            resultsContainer.innerHTML = `
                <div class="success">
                    <h4>ℹ️ ${title} (${timestamp})</h4>
                    <p>No students with common interests found.</p>
                </div>
            `;
            return;
        }
        
        let tableHTML = `
            <div class="success">
                <h4>🎯 ${title} (${timestamp})</h4>
                <table class="result-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Student ID</th>
                            <th>Common Courses</th>
                            <th>Common Clubs</th>
                            <th>Total Common</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        data.forEach(student => {
            const courses = student.common_courses || [];
            const clubs = student.common_clubs || [];
            
            tableHTML += `
                <tr>
                    <td><strong>${student.student_name}</strong></td>
                    <td>${student.student_id}</td>
                    <td>
                        ${courses.map(course => `<span class="badge course">📚 ${course}</span>`).join(' ')}
                        ${courses.length === 0 ? '<em>None</em>' : ''}
                    </td>
                    <td>
                        ${clubs.map(club => `<span class="badge club">🏛️ ${club}</span>`).join(' ')}
                        ${clubs.length === 0 ? '<em>None</em>' : ''}
                    </td>
                    <td><strong>${student.total_common_interests}</strong></td>
                </tr>
            `;
        });
        
        tableHTML += `
                    </tbody>
                </table>
            </div>
        `;
        
        resultsContainer.innerHTML = tableHTML;
    }
    
    function displayPopularCoursesTable(data, title, timestamp) {
        if (data.length === 0) {
            resultsContainer.innerHTML = `
                <div class="success">
                    <h4>ℹ️ ${title} (${timestamp})</h4>
                    <p>No courses found.</p>
                </div>
            `;
            return;
        }
        
        let tableHTML = `
            <div class="success">
                <h4>🏆 ${title} (${timestamp})</h4>
                <table class="result-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Course Name</th>
                            <th>Course Code</th>
                            <th>Student Count</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        data.forEach((course, index) => {
            const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
            tableHTML += `
                <tr>
                    <td>${rankEmoji} ${index + 1}</td>
                    <td><strong>${course.c.name}</strong></td>
                    <td>${course.c.code}</td>
                    <td><span class="badge">${course.student_count} students</span></td>
                </tr>
            `;
        });
        
        tableHTML += `
                    </tbody>
                </table>
            </div>
        `;
        
        resultsContainer.innerHTML = tableHTML;
    }
    
    function displayStudentTable(data, title, timestamp) {
        if (data.length === 0) {
            resultsContainer.innerHTML = `
                <div class="success">
                    <h4>ℹ️ ${title} (${timestamp})</h4>
                    <p>No students found.</p>
                </div>
            `;
            return;
        }
        
        let tableHTML = `
            <div class="success">
                <h4>👥 ${title} (${timestamp})</h4>
                <table class="result-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Student ID</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        data.forEach(item => {
            // Handle different data structures
            const student = item.s || item.other || item.follower || item.followed || item.suggested || item;
            const name = student.name || 'N/A';
            const studentId = student.student_id || 'N/A';
            
            tableHTML += `
                <tr>
                    <td><strong>${name}</strong></td>
                    <td>${studentId}</td>
                </tr>
            `;
        });
        
        tableHTML += `
                    </tbody>
                </table>
            </div>
        `;
        
        resultsContainer.innerHTML = tableHTML;
    }
    
    // Utility function to display error
    function displayError(error, title = 'Error') {
        const timestamp = new Date().toLocaleTimeString();
        const errorHtml = `
            <div class="error">
                <h4>${title} (${timestamp})</h4>
                <pre>${error}</pre>
            </div>
        `;
        resultsContainer.innerHTML = errorHtml;
    }
    
    // Utility function to show loading state
    function showLoading(message = 'Loading...') {
        resultsContainer.innerHTML = `
            <div class="loading-state">
                <div class="loading"></div>
                ${message}
            </div>
        `;
    }
    
    // Utility function to handle button loading state
    function setButtonLoading(button, loading = true) {
        if (loading) {
            button.dataset.originalText = button.textContent;
            button.innerHTML = '<div class="loading"></div>Processing...';
            button.disabled = true;
        } else {
            button.innerHTML = button.dataset.originalText || button.textContent.replace('Processing...', '').replace(/\.+/g, '');
            button.disabled = false;
        }
    }
    
    // Generic API call function
    async function makeAPICall(url, method = 'GET', data = null) {
        try {
            showLoading();
            
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                }
            };
            
            if (data && method !== 'GET') {
                options.body = JSON.stringify(data);
            }
            
            const response = await fetch(url, options);
            const result = await response.json();
            
            if (response.ok) {
                return result;
            } else {
                throw new Error(result.error || 'API call failed');
            }
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    // Student Operations
    
    // Create Student
    document.getElementById('createStudentForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const submitBtn = this.querySelector('button[type="submit"]');
        
        try {
            setButtonLoading(submitBtn, true);
            
            const name = document.getElementById('studentName').value;
            const student_id = document.getElementById('studentId').value;
            
            const result = await makeAPICall('/api/student', 'POST', { name, student_id });
            showSuccess(`Student "${name}" created successfully!`, result);
            this.reset();
        } catch (error) {
            showError(`Failed to create student: ${error.message}`);
        } finally {
            setButtonLoading(submitBtn, false);
        }
    });
    
    // Find Student - Enhanced to show profile card
    document.getElementById('findStudentForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const submitBtn = this.querySelector('button[type="submit"]');
        
        try {
            setButtonLoading(submitBtn, true);
            
            const student_id = document.getElementById('searchStudentId').value;
            const result = await makeAPICall(`/api/student/${student_id}`);
            
            if (result.success && result.data) {
                showSuccess(`Student found!`);
                await displayStudentProfile(student_id, result.data.s);
            }
            this.reset();
        } catch (error) {
            showError(`Student not found: ${error.message}`);
        } finally {
            setButtonLoading(submitBtn, false);
        }
    });
    
    // Enhanced student profile display
    async function displayStudentProfile(studentId, studentData) {
        try {
            // Get additional data for the student
            const [followingRes, followersRes, coursesRes, clubsRes] = await Promise.allSettled([
                makeAPICall(`/api/student/${studentId}/following`),
                makeAPICall(`/api/student/${studentId}/followers`),
                fetch(`/api/student/${studentId}/courses`).then(r => r.json()).catch(() => ({data: []})),
                fetch(`/api/student/${studentId}/clubs`).then(r => r.json()).catch(() => ({data: []}))
            ]);
            
            const following = followingRes.status === 'fulfilled' ? followingRes.value.data || [] : [];
            const followers = followersRes.status === 'fulfilled' ? followersRes.value.data || [] : [];
            const courses = coursesRes.status === 'fulfilled' ? coursesRes.value.data || [] : [];
            const clubs = clubsRes.status === 'fulfilled' ? clubsRes.value.data || [] : [];
            
            displayStudentCard({
                ...studentData,
                student_id: studentId,
                stats: {
                    following: following.length,
                    followers: followers.length,
                    courses: courses.length,
                    clubs: clubs.length
                }
            });
            
        } catch (error) {
            console.error('Error fetching student profile:', error);
            displayStudentCard({
                ...studentData,
                student_id: studentId,
                stats: { following: 0, followers: 0, courses: 0, clubs: 0 }
            });
        }
    }
    
    function displayStudentCard(student) {
        const timestamp = new Date().toLocaleTimeString();
        const initials = student.name ? student.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'ST';
        
        const cardHTML = `
            <div class="success">
                <h4>👤 Student Profile (${timestamp})</h4>
                <div class="profile-cards-container">
                    <div class="student-card">
                        <div class="student-avatar">${initials}</div>
                        <div class="student-name">${student.name || 'Unknown'}</div>
                        <div class="student-id">ID: ${student.student_id}</div>
                        
                        <div class="student-stats">
                            <div class="stat-item">
                                <div class="stat-number">${student.stats.following}</div>
                                <div class="stat-label">Following</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">${student.stats.followers}</div>
                                <div class="stat-label">Followers</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">${student.stats.courses}</div>
                                <div class="stat-label">Courses</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">${student.stats.clubs}</div>
                                <div class="stat-label">Clubs</div>
                            </div>
                        </div>
                        
                        <div class="student-actions">
                            <button class="action-btn primary" onclick="viewStudentDetails('${student.student_id}')">
                                View Details
                            </button>
                            <button class="action-btn secondary" onclick="findCommonInterests('${student.student_id}')">
                                Common Interests
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        resultsContainer.innerHTML = cardHTML;
    }
    
    // Global functions for student card actions
    window.viewStudentDetails = async function(studentId) {
        try {
            showInfo(`Loading details for student ${studentId}...`);
            const [following, followers, commonInterests] = await Promise.all([
                makeAPICall(`/api/student/${studentId}/following`),
                makeAPICall(`/api/student/${studentId}/followers`),
                makeAPICall(`/api/student/${studentId}/common_interests`)
            ]);
            
            displayStudentDetails(studentId, {following, followers, commonInterests});
        } catch (error) {
            showError(`Failed to load student details: ${error.message}`);
        }
    };
    
    window.findCommonInterests = async function(studentId) {
        try {
            const result = await makeAPICall(`/api/student/${studentId}/common_interests`);
            displayCommonInterestsTable(result.data, `Common Interests for ${studentId}`, new Date().toLocaleTimeString());
        } catch (error) {
            showError(`Failed to find common interests: ${error.message}`);
        }
    };
    
    function displayStudentDetails(studentId, data) {
        const timestamp = new Date().toLocaleTimeString();
        
        let detailsHTML = `
            <div class="success">
                <h4>📊 Student Details: ${studentId} (${timestamp})</h4>
                <div class="dashboard-grid">
        `;
        
        // Following widget
        detailsHTML += `
            <div class="dashboard-widget students">
                <div class="widget-header">
                    <span class="widget-icon">👥</span>
                    <span class="widget-title">Following</span>
                </div>
                <div class="widget-value">${data.following.data.length}</div>
                <div class="widget-label">Students</div>
            </div>
        `;
        
        // Followers widget
        detailsHTML += `
            <div class="dashboard-widget courses">
                <div class="widget-header">
                    <span class="widget-icon">👨‍👩‍👧‍👦</span>
                    <span class="widget-title">Followers</span>
                </div>
                <div class="widget-value">${data.followers.data.length}</div>
                <div class="widget-label">Students</div>
            </div>
        `;
        
        // Common interests widget
        detailsHTML += `
            <div class="dashboard-widget clubs">
                <div class="widget-header">
                    <span class="widget-icon">🎯</span>
                    <span class="widget-title">Common Interests</span>
                </div>
                <div class="widget-value">${data.commonInterests.data.length}</div>
                <div class="widget-label">Connections</div>
            </div>
        `;
        
        detailsHTML += `</div></div>`;
        
        resultsContainer.innerHTML = detailsHTML;
    }
    
    // Delete Student
    document.getElementById('deleteStudentForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const submitBtn = this.querySelector('button[type="submit"]');
        const student_id = document.getElementById('deleteStudentId').value;
        
        if (confirm(`Are you sure you want to delete student ${student_id}?`)) {
            try {
                setButtonLoading(submitBtn, true);
                
                const result = await makeAPICall(`/api/student/${student_id}`, 'DELETE');
                displayResults(result, 'Student Deleted');
                this.reset();
            } catch (error) {
                displayError(error.message, 'Delete Student Error');
            } finally {
                setButtonLoading(submitBtn, false);
            }
        }
    });
    
    // Course Operations
    
    // Create Course
    document.getElementById('createCourseForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('courseName').value;
        const code = document.getElementById('courseCode').value;
        
        try {
            const result = await makeAPICall('/api/course', 'POST', { name, code });
            displayResults(result, 'Course Created');
            this.reset();
        } catch (error) {
            displayError(error.message, 'Create Course Error');
        }
    });
    
    // Get Course Students
    document.getElementById('getCourseStudentsForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const course_code = document.getElementById('courseCodeSearch').value;
        
        try {
            const result = await makeAPICall(`/api/course/${course_code}/students`);
            displayResults(result, 'Course Students');
            this.reset();
        } catch (error) {
            displayError(error.message, 'Get Course Students Error');
        }
    });
    
    // Get Popular Courses
    document.getElementById('getPopularCoursesBtn').addEventListener('click', async function() {
        try {
            const result = await makeAPICall('/api/popular_courses');
            displayResults(result, 'Popular Courses');
        } catch (error) {
            displayError(error.message, 'Get Popular Courses Error');
        }
    });
    
    // Club Operations
    
    // Create Club
    document.getElementById('createClubForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('clubName').value;
        const description = document.getElementById('clubDescription').value;
        
        try {
            const result = await makeAPICall('/api/club', 'POST', { name, description });
            displayResults(result, 'Club Created');
            this.reset();
        } catch (error) {
            displayError(error.message, 'Create Club Error');
        }
    });
    
    // Get Club Members
    document.getElementById('getClubMembersForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const club_name = document.getElementById('clubNameSearch').value;
        
        try {
            const result = await makeAPICall(`/api/club/${club_name}/members`);
            displayResults(result, 'Club Members');
            this.reset();
        } catch (error) {
            displayError(error.message, 'Get Club Members Error');
        }
    });
    
    // Relationship Operations
    
    // Follow Student
    document.getElementById('followStudentForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const submitBtn = this.querySelector('button[type="submit"]');
        
        try {
            setButtonLoading(submitBtn, true);
            
            const student1_id = document.getElementById('followerStudentId').value;
            const student2_id = document.getElementById('followedStudentId').value;
            
            const result = await makeAPICall('/api/relation/follow', 'POST', { student1_id, student2_id });
            showSuccess(`${student1_id} is now following ${student2_id}!`, result);
            this.reset();
        } catch (error) {
            showError(`Failed to create follow relationship: ${error.message}`);
        } finally {
            setButtonLoading(submitBtn, false);
        }
    });
    
    // Enroll in Course
    document.getElementById('enrollCourseForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const submitBtn = this.querySelector('button[type="submit"]');
        
        try {
            setButtonLoading(submitBtn, true);
            
            const student_id = document.getElementById('enrollStudentId').value;
            const course_code = document.getElementById('enrollCourseCode').value;
            
            const result = await makeAPICall('/api/relation/enroll', 'POST', { student_id, course_code });
            showSuccess(`${student_id} enrolled in ${course_code}!`, result);
            this.reset();
        } catch (error) {
            showError(`Failed to enroll student: ${error.message}`);
        } finally {
            setButtonLoading(submitBtn, false);
        }
    });
    
    // Join Club
    document.getElementById('joinClubForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const submitBtn = this.querySelector('button[type="submit"]');
        
        try {
            setButtonLoading(submitBtn, true);
            
            const student_id = document.getElementById('joinStudentId').value;
            const club_name = document.getElementById('joinClubName').value;
            
            const result = await makeAPICall('/api/relation/join_club', 'POST', { student_id, club_name });
            showSuccess(`${student_id} joined ${club_name}!`, result);
            this.reset();
        } catch (error) {
            showError(`Failed to join club: ${error.message}`);
        } finally {
            setButtonLoading(submitBtn, false);
        }
    });
    
    // Dashboard functionality
    async function loadDashboardStats() {
        try {
            showInfo('Loading dashboard statistics...');
            
            // Note: These endpoints would need to be implemented in the backend
            // For now, we'll simulate with existing data
            const popularCourses = await makeAPICall('/api/popular_courses');
            
            // Update dashboard widgets with available data
            document.getElementById('totalCourses').textContent = popularCourses.data.length || '0';
            
            showSuccess('Nexus dashboard updated successfully!');
        } catch (error) {
            showError(`Failed to load dashboard: ${error.message}`);
        }
    }
    
    // Dashboard event listeners
    document.getElementById('refreshDashboard').addEventListener('click', loadDashboardStats);
    
    document.getElementById('viewPopularCourses').addEventListener('click', async function() {
        try {
            const result = await makeAPICall('/api/popular_courses');
            displayPopularCoursesTable(result.data, 'Popular Courses', new Date().toLocaleTimeString());
            showInfo('Popular courses loaded!');
        } catch (error) {
            showError(`Failed to load popular courses: ${error.message}`);
        }
    });
    
    document.getElementById('networkAnalysis').addEventListener('click', function() {
                    showSuccess('Nexus network analysis feature coming soon! 🚀');
    });
    
    // Load dashboard on page load
    setTimeout(loadDashboardStats, 1000);
    
    // Social Features
    
    // Get Following
    document.getElementById('getFollowingForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const student_id = document.getElementById('followingStudentId').value;
        
        try {
            const result = await makeAPICall(`/api/student/${student_id}/following`);
            displayResults(result, 'Students Following');
            this.reset();
        } catch (error) {
            displayError(error.message, 'Get Following Error');
        }
    });
    
    // Get Followers
    document.getElementById('getFollowersForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const student_id = document.getElementById('followersStudentId').value;
        
        try {
            const result = await makeAPICall(`/api/student/${student_id}/followers`);
            displayResults(result, 'Student Followers');
            this.reset();
        } catch (error) {
            displayError(error.message, 'Get Followers Error');
        }
    });
    
    // Get Suggested Friends
    document.getElementById('getSuggestedFriendsForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const student_id = document.getElementById('suggestedStudentId').value;
        
        try {
            const result = await makeAPICall(`/api/student/${student_id}/suggested_friends`);
            displayResults(result, 'Suggested Friends');
            this.reset();
        } catch (error) {
            displayError(error.message, 'Get Suggested Friends Error');
        }
    });
    
    // Get Common Interests
    document.getElementById('getCommonInterestsForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const student_id = document.getElementById('commonInterestsStudentId').value;
        
        try {
            const result = await makeAPICall(`/api/student/${student_id}/common_interests`);
            displayResults(result, 'Students with Common Interests');
            this.reset();
        } catch (error) {
            displayError(error.message, 'Get Common Interests Error');
        }
    });
    
    // Demo Data Creation
    document.getElementById('createDemoDataBtn').addEventListener('click', async function() {
        const button = this;
        
        try {
            setButtonLoading(button, true);
            displayResults({message: 'Creating Nexus demo data...'}, 'Creating Demo Network');
            
            // Create students
            const students = [
                {name: 'Alice Johnson', student_id: 'S001'},
                {name: 'Bob Smith', student_id: 'S002'},
                {name: 'Carol Davis', student_id: 'S003'},
                {name: 'Dave Wilson', student_id: 'S004'}
            ];
            
            for (const student of students) {
                await makeAPICall('/api/student', 'POST', student);
            }
            
            // Create courses
            const courses = [
                {name: 'Introduction to Computer Science', code: 'CS101'},
                {name: 'Calculus I', code: 'MATH101'},
                {name: 'English Literature', code: 'ENG101'}
            ];
            
            for (const course of courses) {
                await makeAPICall('/api/course', 'POST', course);
            }
            
            // Create clubs
            const clubs = [
                {name: 'Debate Club', description: 'College debate and public speaking club'},
                {name: 'Chess Club', description: 'Strategic thinking and chess competitions'},
                {name: 'Drama Club', description: 'Theater and performing arts club'}
            ];
            
            for (const club of clubs) {
                await makeAPICall('/api/club', 'POST', club);
            }
            
            // Create relationships - follows
            const follows = [
                {student1_id: 'S001', student2_id: 'S002'},
                {student1_id: 'S001', student2_id: 'S003'},
                {student1_id: 'S002', student2_id: 'S003'},
                {student1_id: 'S003', student2_id: 'S004'},
                {student1_id: 'S004', student2_id: 'S001'}
            ];
            
            for (const follow of follows) {
                await makeAPICall('/api/relation/follow', 'POST', follow);
            }
            
            // Create enrollments
            const enrollments = [
                {student_id: 'S001', course_code: 'CS101'},
                {student_id: 'S001', course_code: 'MATH101'},
                {student_id: 'S002', course_code: 'CS101'},
                {student_id: 'S002', course_code: 'ENG101'},
                {student_id: 'S003', course_code: 'MATH101'},
                {student_id: 'S003', course_code: 'ENG101'},
                {student_id: 'S004', course_code: 'CS101'}
            ];
            
            for (const enrollment of enrollments) {
                await makeAPICall('/api/relation/enroll', 'POST', enrollment);
            }
            
            // Create club memberships
            const memberships = [
                {student_id: 'S001', club_name: 'Debate Club'},
                {student_id: 'S001', club_name: 'Chess Club'},
                {student_id: 'S002', club_name: 'Chess Club'},
                {student_id: 'S003', club_name: 'Drama Club'},
                {student_id: 'S003', club_name: 'Debate Club'},
                {student_id: 'S004', club_name: 'Drama Club'}
            ];
            
            for (const membership of memberships) {
                await makeAPICall('/api/relation/join_club', 'POST', membership);
            }
            
            displayResults({
                success: true,
                message: 'Nexus demo network created successfully!',
                details: {
                    students: students.length,
                    courses: courses.length,
                    clubs: clubs.length,
                    relationships: follows.length + enrollments.length + memberships.length
                }
            }, 'Nexus Demo Network Created');
            
        } catch (error) {
            displayError(`Failed to create demo data: ${error.message}`, 'Demo Data Error');
        } finally {
            setButtonLoading(button, false);
        }
    });
    
    // Database Schema Functions
    document.getElementById('loadSchemaBtn').addEventListener('click', async function() {
        const button = this;
        try {
            setButtonLoading(button, true);
            
            let result;
            try {
                // Try the main schema endpoint first
                result = await makeAPICall('/api/schema');
            } catch (error) {
                // If main endpoint fails, try the simple one
                console.log('Main schema endpoint failed, trying simple endpoint:', error);
                result = await makeAPICall('/api/schema/simple');
                showInfo('Using simplified schema due to data formatting issues');
            }
            
            displayDatabaseSchema(result.data);
            document.getElementById('schemaDisplay').style.display = 'block';
            showSuccess('Database schema loaded successfully!');
        } catch (error) {
            showError(`Failed to load schema: ${error.message}`);
        } finally {
            setButtonLoading(button, false);
        }
    });
    
    document.getElementById('exportSchemaBtn').addEventListener('click', async function() {
        try {
            const result = await makeAPICall('/api/schema');
            const dataStr = JSON.stringify(result.data, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'nexus_database_schema.json';
            link.click();
            URL.revokeObjectURL(url);
            showSuccess('Schema exported successfully!');
        } catch (error) {
            showError(`Failed to export schema: ${error.message}`);
        }
    });
    
    document.getElementById('visualSchemaBtn').addEventListener('click', async function() {
        try {
            const result = await makeAPICall('/api/schema/visual');
            displayVisualSchema(result.data);
            document.getElementById('schemaDisplay').style.display = 'block';
            showSuccess('Visual schema loaded!');
        } catch (error) {
            showError(`Failed to load visual schema: ${error.message}`);
        }
    });
    
    document.getElementById('schemaStatsBtn').addEventListener('click', async function() {
        try {
            const result = await makeAPICall('/api/schema');
            displaySchemaStatistics(result.data.statistics);
            document.getElementById('schemaDisplay').style.display = 'block';
            showSuccess('Schema statistics loaded!');
        } catch (error) {
            showError(`Failed to load schema statistics: ${error.message}`);
        }
    });
    
    function displayDatabaseSchema(schema) {
        const content = document.getElementById('schemaContent');
        let html = '<div class="schema-sections">';
        
        // Nodes Section
        html += '<div class="schema-section">';
        html += '<h4>📊 Node Types</h4>';
        Object.entries(schema.nodes).forEach(([label, info]) => {
            html += `<div class="node-info">`;
            html += `<h5>${label} (${info.count} nodes)</h5>`;
            html += `<div class="properties-list">`;
            info.properties.forEach(prop => {
                html += `<span class="property-tag">${prop}</span>`;
            });
            html += `</div></div>`;
        });
        html += '</div>';
        
        // Relationships Section
        html += '<div class="schema-section">';
        html += '<h4>🔗 Relationship Types</h4>';
        Object.entries(schema.relationships).forEach(([type, info]) => {
            html += `<div class="relationship-info">`;
            
            // Handle both complex (with patterns) and simple (just count) relationship info
            if (info.patterns && info.patterns.length > 0) {
                html += `<h5>${type} (${info.total_count} relationships)</h5>`;
                html += `<div>`;
                info.patterns.forEach(pattern => {
                    html += `<span class="relationship-pattern">${pattern.from} → ${pattern.to} (${pattern.count})</span>`;
                });
                html += `</div>`;
            } else {
                // Simple format - just show count
                html += `<h5>${type} (${info.count || info.total_count} relationships)</h5>`;
                html += `<p>Relationship pattern details not available in simplified view</p>`;
            }
            html += `</div>`;
        });
        html += '</div>';
        
        // Statistics Section
        html += '<div class="schema-section">';
        html += '<h4>📈 Database Statistics</h4>';
        html += '<div class="schema-stats">';
        html += `<div class="stat-card">
                    <div class="stat-value">${schema.statistics.total_nodes}</div>
                    <div class="stat-label">Total Nodes</div>
                 </div>`;
        html += `<div class="stat-card">
                    <div class="stat-value">${schema.statistics.total_relationships}</div>
                    <div class="stat-label">Total Relationships</div>
                 </div>`;
        html += `<div class="stat-card">
                    <div class="stat-value">${schema.statistics.node_types}</div>
                    <div class="stat-label">Node Types</div>
                 </div>`;
        html += `<div class="stat-card">
                    <div class="stat-value">${schema.statistics.relationship_types}</div>
                    <div class="stat-label">Relationship Types</div>
                 </div>`;
        html += '</div></div>';
        
        html += '</div>';
        content.innerHTML = html;
    }
    
    function displayVisualSchema(visualData) {
        const content = document.getElementById('schemaContent');
        let html = '<div class="schema-sections">';
        
        html += '<div class="schema-section">';
        html += '<h4>🎯 Visual Schema Representation</h4>';
        
        // Nodes
        html += '<h5>Node Types:</h5>';
        visualData.nodes.forEach(node => {
            html += `<div class="node-info">
                        <h5>${node.label}</h5>
                        <p>Count: ${node.count} nodes</p>
                     </div>`;
        });
        
        // Relationships
        html += '<h5>Relationship Patterns:</h5>';
        visualData.relationships.forEach(rel => {
            html += `<div class="relationship-info">
                        <h5>(${rel.source})-[${rel.type}]->(${rel.target})</h5>
                        <p>Count: ${rel.count} relationships</p>
                     </div>`;
        });
        
        html += '</div></div>';
        content.innerHTML = html;
    }
    
    function displaySchemaStatistics(stats) {
        const content = document.getElementById('schemaContent');
        const html = `
            <div class="schema-section">
                <h4>📊 Database Statistics Summary</h4>
                <div class="schema-stats">
                    <div class="stat-card">
                        <div class="stat-value">${stats.total_nodes}</div>
                        <div class="stat-label">Total Nodes</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.total_relationships}</div>
                        <div class="stat-label">Total Relationships</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.node_types}</div>
                        <div class="stat-label">Node Types</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.relationship_types}</div>
                        <div class="stat-label">Relationship Types</div>
                    </div>
                </div>
            </div>
        `;
        content.innerHTML = html;
    }
    
    console.log('🌐 All Nexus event listeners registered successfully');
});