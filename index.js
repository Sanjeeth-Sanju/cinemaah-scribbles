import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();


const app = express();
const port = process.env.PORT || 3000;
const API_Token = process.env.TMDB_TOKEN;

const db = new pg.Client(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false  
        }
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      }
);


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24 * 7, 
    secure: process.env.NODE_ENV === "production",
    httpOnly: true
  }
}));


(async () => {
  try {
    await db.connect();
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed", err.message);
    process.exit(1);
  }
})();

function requireLogin(req, res, next) {
  if (req.session.loggedIn) {
    return next();
  }
  return res.redirect("/login?error=Login required to perform this action");
}


let movieData =[];



// GET login page
app.get("/login", (req, res) => {
  const error = req.query.error;
  res.render("login.ejs", { errorMessage: error });
});

// POST login 
app.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    req.session.loggedIn = true;
    return res.redirect("/");
  }
  return res.redirect("/login?error=Wrong password, try again");
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Home page
app.get("/", async (req, res)=>{
      const errorMessage = req.query.error;
      let query1;
      try{
        query1 = await db.query("SELECT * FROM movie_list");
      }catch(error){
        console.log("DB error", error.message);
        return res.redirect("/?error=We're having trouble performing this action. Please try again later.");
      }

      movieData = query1.rows;
      res.render("index.ejs",{
        movieData: movieData,
        errorMessage: errorMessage,
        session: req.session,
      });
});

// Movie Search Engine
app.post("/new", requireLogin, async (req, res)=>{
    const movieName = req.body.movieName;
    if(!movieName || movieName.trim().length === 0){
      return res.redirect("/?error=Please enter a movie name");
    }
    let apiCall1
  try{
     apiCall1 = await axios.get("https://api.themoviedb.org/3/search/movie", {
          params: {
             query: movieName,
          },
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_Token}`,
    }});
    if(!apiCall1.data?.results?.length){
      return res.redirect("/?error=No Movie Found");
    }
  } catch(error){
    console.log("API error", error.message);
    return res.redirect("/?error=API error. Please try again.");
  }
  
  const resultArray = apiCall1.data.results;
             res.render("movieList.ejs", {
               movies: resultArray,
             });


});

// New Post route
app.get("/newMovie",requireLogin, async (req, res)=>{
     const movieId = req.query.movieId;
     if(!movieId){
      return res.redirect("/");
     }
     let apiCall2;
     let apiCall3;
     try{
      apiCall2 = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`,{
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_Token}`,
    }
     });
    if(!apiCall2.data?.id){
      return res.redirect("/?error=No Movie Found");
    }     
       apiCall3 = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`,{
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_Token}`,
    }
     });
    if(!apiCall3.data?.crew?.length){
      return res.redirect("/?error=No Movie Found");
    }     
    }catch(error){
        console.log("API error", error.message);
        return res.redirect("/?error=API error. Please try again.");
    }

     const movieName = apiCall2.data.title;
     const languageCode = apiCall2.data.original_language;
     const poster_path = apiCall2.data.poster_path;
     let genre = " ";
     apiCall2.data.genres.forEach((i)=>{
        genre = genre + i.name + ", "
     });
     genre = genre.slice(0, -1);
     const year = apiCall2.data.release_date? apiCall2.data.release_date.substring(0,4): "N/A";
     let directorName;
     let query2;
     let languageName;
     apiCall3.data.crew.forEach((i)=>{
        if(i.job === "Director"){
            directorName = i.name;
        }
     });

      try{
        query2 =  await db.query("SELECT language_name FROM language WHERE language_code = $1", [languageCode]);
        languageName = query2.rows[0].language_name;

      }catch(error){
        console.log("DB error", error.message);
        return res.redirect("/?error=We're having trouble performing this action. Please try again later.");
      }

    res.render("newPost.ejs", {
      posterPath: poster_path,
      movieName,
      movieId,
      languageCode,
      directorName,
      year,
      genre,
      languageName,
    });
});

// Thoughts route
app.post("/review", requireLogin, async (req,res)=>{
  const {
    thoughts,
    rating,
    tmdbId,
    movieName,
    languageCode,
    directorName,
    year,
    genre,
    posterPath,
    languageName,
  } = req.body;
     if(!thoughts || thoughts.trim().length===0 || !rating){
      return res.redirect("/?error=Pour your thoughts and rate the selected movie");
     }

    let newInsertedMovie;

    try{
        newInsertedMovie = await db.query("INSERT INTO movie_list(tmdb_id,title,languagecode,directorname,year,genre,poster_path,language_name,my_thoughts,my_rating) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
        [tmdbId,movieName,languageCode,directorName,year,genre,posterPath,languageName,thoughts,rating]);
        return res.redirect("/");
     } catch(error){
         if(error.code ===  "23505"){
        console.log("DB error", error.message);
        return res.redirect("/?error=Movie already exists in your diary.");          
         }

        console.log("DB error", error.message);
        return res.redirect("/?error=We're having trouble performing this action. Please try again later.");
      }


});

//EditForm route
app.post("/editForm", requireLogin, async (req, res)=>{
  const movie_id = req.body.movieId;
    if(!movie_id){
      return res.redirect("/");
     }  
  let query;
  try{
  query = await db.query("SELECT title, poster_path, my_thoughts,my_rating FROM movie_list WHERE tmdb_id = $1", [movie_id]);
  }catch(error){
        console.log("DB error", error.message);
        return res.redirect("/?error=We're having trouble performing this action. Please try again later.");
  }
  const result = query.rows[0];
  if (!result) {
  return res.redirect("/?error=Movie not found");
}
  const rating = result.my_rating;

  res.render("editPost.ejs",{
      posterPath: result.poster_path,
      movieName: result.title,
      movieId: movie_id,
      myThoughts: result.my_thoughts,
      rating: rating,
  });
});

// Edit route
app.post("/edit", requireLogin, async (req, res)=>{
  const movieId = req.body.movieId;
    if(!movieId){
      return res.redirect("/");
     }
  const thoughts = req.body.thoughts;
  const rating= req.body.rating;
  if(!thoughts || thoughts.trim().length===0 || !rating){
    return res.redirect("/?error=Pour your thoughts and rate the selected movie");
  }
  let query;
  try{
    query = await db.query("UPDATE movie_list SET my_thoughts = $1, my_rating = $2 WHERE tmdb_id = $3", [thoughts,rating,movieId]);   
    if(query.rowCount === 0){
    return res.redirect("/?error=Movie not found");
  } 
}catch(error){
        console.log("DB error", error.message);
        return res.redirect("/?error=We're having trouble performing this action. Please try again later.");
      }
  res.redirect("/");
});

// Delete route
app.post("/delete", requireLogin, async (req, res)=>{
  const movieId = req.body.movieId;
    if(!movieId){
      return res.redirect("/");
     }
  let query;
  try{
  query = await db.query("DELETE FROM movie_list WHERE tmdb_id = $1",[movieId]);
  if(query.rowCount === 0){
    return res.redirect("/?error=Movie not found");
  }

  }catch(error){
        console.log("DB error", error.message);
        return res.redirect("/?error=We're having trouble performing this action. Please try again later.");
      }
  res.redirect("/");
});


app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});