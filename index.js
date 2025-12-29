require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static frontend files

// Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("WARNING: Supabase URL or Key is missing in .env file");
}

const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder"
);

// Middleware to inject supabase client
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// Import Routes
const authRoutes = require("./backend/routes/auth");
const itemRoutes = require("./backend/routes/items");
const favoriteRoutes = require("./backend/routes/favorites");
const scrapingRoutes = require("./backend/routes/scraping");
const ratingsRoutes = require("./backend/routes/ratings");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/scraping", scrapingRoutes);
app.use("/api/ratings", ratingsRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Bakery Management System API is running",
  });
});

// Handle SPA routing (return index.html for unknown non-API routes)
app.get(/(.*)/, (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  } else {
    res.status(404).json({ success: false, message: "API route not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
