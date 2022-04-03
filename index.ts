import { opsRouter } from "./routes/operations";
import { fundsRouter } from "./routes/funds";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { noteRouter } from "./routes/notes";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { DatabaseSingleton } from "./helpers/DatabaseSingleton";
import { dbConfig } from "./config/db";
import { userRouter } from "./routes/user";
import passport from "passport";
import session from "express-session";
import { initPassportUserStrategy } from "./passport-strategies/user";
import path from "path";

const app = express();
const PORT = 3200;
const appRoot = path.join(__dirname, "frontend_dist");

app.use(cors());
app.use(express.static(appRoot));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  session({
    secret: "very secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(dbConfig.url, { useNewUrlParser: true })
  .then((mongooseInstance) => {
    DatabaseSingleton.setInstance(mongooseInstance);
    initPassportUserStrategy(passport);

    passport.initialize();
    app.use(noteRouter);
    app.use(userRouter);
    app.use(fundsRouter);
    app.use(opsRouter);

    app.use("/", (req, res) => {
      res.sendFile(path.join(__dirname, "frontend_dist", "index.html"));
    });

    app.listen(PORT, () => {
      console.log(`server is running at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });

// DatabaseSingleton.setClient(database, 'notes');
