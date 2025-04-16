import DBconnect from "./db/db.js";
import dotenv from "dotenv";
import app from "../src/server.js";

dotenv.config({
  path: "../.env", // Corrected path to .env
});

DBconnect()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("App listening at port::", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed !!", error);
  });
