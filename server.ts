import dotenv from "dotenv";
import { app } from "./app";

dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 5000;

const start = async () => {
  console.log("Starting up...");
  app.listen(PORT, () => {
    console.log("Listening on port", PORT);
  });
};

start();
