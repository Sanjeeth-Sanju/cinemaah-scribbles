  # 🎬Cinemaah-Scribbles
 Cinemaah Scribbles is a personal movie diary web application where I log the movies I’ve watched along with my thoughts and ratings. It’s built as a full-stack capstone project with a focus on clean UI, structured backend logic, and real-world deployment.

## Live Demo

Check it out here: _www.cinemaahscriblles.live_

## Features

- **Admin-only dashboard** - Secure access to add, edit, and delete movies
- **Movie search powered by TMDb API** - Easily find and discover movies with real-time data from The Movie Database
- **Fully responsive UI** - Seamless experience on desktop, tablet, and mobile devices
- **Robust error handling** - Gracefully manages API, database, and user input errors for a smooth user experience
- **Dynamic server-side rendering** - Powered by EJS for fast and efficient page loads

## Tech Stack

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![EJS](https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=black)](https://ejs.co/)

[![Axios](https://img.shields.io/badge/Axios-5A29E3?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)
[![TMDb API](https://img.shields.io/badge/TMDb-01D277?style=for-the-badge&logo=themoviedatabase&logoColor=white)](https://www.themoviedb.org/)

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

[![dotenv](https://img.shields.io/badge/dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black)](https://www.npmjs.com/package/dotenv)

**Deployment:** [RENDER](https://render.com/)

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL
- TMDb API key
   - _https://developer.themoviedb.org/docs/getting-started_

### Installation

1. **Clone the repository**
 
   ```bash
   git clone https://github.com/Sanjeeth-Sanju/cinemaah-scribbles.git
   cd cinemaah-scribbles

2. **Install dependencies**

   ```bash
   npm install

3. **Set up environment variables**

   ```env
   PORT=3000
   TMDB_TOKEN=your_tmdb_api_token
   SESSION_SECRET=your_session_secret

   DB_USER=postgres
   DB_HOST=localhost
   DB_DATABASE=cinemaah_scribbles
   DB_PASSWORD=your_db_password
   DB_PORT=5432

   # Optional (used in production)
   DATABASE_URL=postgres://username:password@host:port/database_name
   ```
   **Points to note:**
   
   - .env is excluded from version control for security
   - Local development: PostgreSQL.app / pgAdmin
   - Production: Environment variables are configured in Render Dashboard
  
4. **Set up PostgreSQL**

   - Create a PostgreSQL database named cinemaah_scribbles
   - Create required tables
   - Ensure PostgreSQL service is running
   
   _(Production uses Render PostgreSQL)_

5. **Run the application**

     ```bash
     nodemon index.js

6. **Open in browser**

   ```
   http://localhost:3000

### Admin access

- Login using the admin password set in .env
- Only the admin can add, edit, or delete movie entries

## Future improvements

- Role-based authentications
- Advanced rating analytics
- Enhanced filtering and sorting
- Customised poster uploads

## Author

**SANJEETH** - Full Stack Developer

- Builds end-to-end web applications with clean UI and solid backend logic
- Passionate about cinema, storytelling, and personal tech-driven projects
- Focused on real-world projects, deployment, and continuous learning

Linkedin: _https://www.linkedin.com/in/b-sanjeeth/_ 
