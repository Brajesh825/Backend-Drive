const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

// Handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`error:${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

//  Config
dotenv.config({ path: "backend/config/config.env" });

// Connecting to database
connectDB();

const server = app.listen(4000, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

//  Unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`error:${err.message}`);
  console.log(`Shutting down the server due to unhandled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
