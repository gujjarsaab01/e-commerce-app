import express, { urlencoded } from "express";
import morgan from "morgan";
import routes from "./routes/routes.js";
import cors from "cors";
import path from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, './client/build')))


app.use("/", routes);

app.use('*', function (req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})

export default app;