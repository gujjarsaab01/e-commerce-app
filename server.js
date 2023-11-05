import pkg from "colors";
import dotenv from "dotenv";
import initDb from "./config/db.js";
import app from "./app.js";

//configure env
dotenv.config();
//PORT
const PORT = process.env.PORT || 8080;
function startApp() {
  //setup database
  initDb();

  //run listen
  app.listen(PORT, (err) => {
    if (err) {
      console.log(`Error while starting server ${err}`.bgYellow.white);
    }
    console.log(`Server Is Running on ${PORT}`.bgMagenta.white);
  });
}

startApp();
