# Job Portal App

A full-stack **Job Portal Web Application** that connects recruiters and candidates. It allows recruiters to post jobs and manage applications, while candidates can apply for jobs, manage their profiles, and track their job applications.

---

## 📁 Project Structure

job-portal-app/
├── frontend/ # React frontend (user interface)
├── backend/ # Node.js backend (API, DB, logic)
└── README.md # Project overview and documentation


---

## ⚙️ Tech Stack

### Frontend:
- React.js
- HTML, CSS, JavaScript
- Axios for API communication

### Backend:
- Node.js
- Express.js
- MongoDB or MySQL (choose based on your setup)
- JWT (JSON Web Tokens) for role-based authentication
- RESTful APIs

---

## 🧑‍💼 Roles and Permissions

### 👤 **Candidate**
- Can **register** via registration form.
- After login, has access to:
  - **Profile Tab:** 
    - View personal information (name, email, skills, experience, etc.)
    - Edit details (except username and password).
  - **Jobs Tab:**
    - **Available Jobs:** Browse and apply to open positions posted by recruiters.
    - **Applied Jobs:** View the list of jobs they’ve applied for.

### 🧑‍💼 **Recruiter (Superuser)**
- Has elevated privileges with access to:
  - **Create New Candidate:**
    - If a candidate is unable to self-register, recruiters can manually add them through a dedicated form.
  - **Post Job:**
    - Create new job listings with title, description, required skills, etc.
  - **View Applications:**
    - See all applications submitted for jobs they’ve posted.
    - Track candidate progress and manage selections.

---

## 🔐 Authentication & Authorization

- Role-based login using JWT.
- Separate login views for **Recruiters** and **Candidates**.
- Secure API endpoints based on user roles.

---

 Application Flow
 
 Recruiter View:-
 
Tab 1: Create Candidate

Add candidate details (name, email, skills, etc.).

Tab 2: Post Job

Add new job postings with role, description, etc.

Tab 3: View Applications

Check applications received for each job.

Candidate View:-

Tab 1: Profile

View and edit personal profile (except username & password).

Tab 2: Jobs

Available Jobs: Apply to open job postings.

Applied Jobs: Track all applied jobs.

Recruiter can see these applications in their dashboard.

---

Future Improvements:-
 
- Add password reset and email verification

- Admin dashboard for system-level monitoring

- Resume upload for candidates

- Filtering and search in job listings

Note:- I have also put seperately the frontend and backend code respectively.
