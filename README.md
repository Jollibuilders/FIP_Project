# FIP Project

A Tinder-like application that matches job seekers with recruiters.

---

## Prerequisites

Before you can run the project, ensure the following are installed:

- **Node.js** (LATEST version recommended)
- **npm** (comes with Node.js)

---

## Project Structure

The project consists of two main parts:

- **`fip-project/backend/`**: Fastify backend server  
- **`fip-project/frontend/`**: React frontend application

---

## Setup Instructions

### Cloning the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/Jollibuilders/FIP_Project.git

2. Navigate to the project directory:
   ```bash
   cd FIP_Project

### Backend Setup

1. Navigate to the backend folder:
<code>cd backend</code>

2. Install dependencies:
<code>npm install</code> 

3. Start the Fastify backend server:
<code>node server.js</code> 

4. Access the backend: The backend should now be running at: `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend folder:
<code>cd frontend</code> 

2. Install dependencies:
<code>npm install</code> 

3. Start the React frontend server:
<code>npm run dev</code> 

4. Access the frontend: The React frontend should now be running at: `http://localhost:5173`

--- 

## Environment Variables Setup

1. **Create the `.env` file:**

   Navigate to the `frontend` folder and create a `.env` file. This file will store all your environment-specific variables. You can find the code to include in this file in our developer chat on discord.

2. **PREVENT the `.env` file from being pushed to GitHub:**

   Ensure that your `.env` file is added to your `.gitignore` file. This is IMPORTANT AND CRUCIAL to avoid exposing sensitive information. You can add the following line to your `.gitignore`:

   ```gitignore
   # Ignore environment variables file
   .env


---

## TOOLS AND TECHNOLOGIES

### Frontend:

- React
- Tailwind CSS (v4)

### Backend:

- Fastify
- @fastify/cors

---

## CONTACT

For any questions or suggestions, feel free to contact Ethan Santos.
