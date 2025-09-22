// app.js
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const adminRoutes = require("./app/routes/adminRoutes");
const app = express();

// DB Connection
mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/productdb")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method')); // for PUT/DELETE in forms
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session & Flash
app.use(session({
  secret: process.env.SESSION_SECRET || 'secretkey',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// Global Flash Messages
app.use((req, res, next) => {
  res.locals.success = req.flash('success') || '';
  res.locals.error = req.flash('error') || '';
  next();
});

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes (keeping ./app/ paths)
app.use("/admin/categories", require("./app/routes/categoryRoutes"));
app.use("/admin/products", require("./app/routes/productRoutes"));
app.use("/", require("./app/routes/customerRoutes"));

app.use("/admin", adminRoutes);


// 404 Page
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
