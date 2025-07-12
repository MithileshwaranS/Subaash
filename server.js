// server.js
import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.js";

// Load environment variables
dotenv.config();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
import connectDB from "./config/db.js";
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", userRoutes);

// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Catch-all route for SPA (send index.html)
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
