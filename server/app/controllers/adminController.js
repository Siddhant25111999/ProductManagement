// app/controllers/dashboardController.js
const Product = require("../models/product");
const Category = require("../models/category");

exports.dashboard = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ isDeleted: false });
    const totalCategories = await Category.countDocuments({ isDeleted: false });

    res.render("admin/dashboard", {
      totalProducts,
      totalCategories,
      title: "Dashboard",
      success: req.flash("success"),
      error: req.flash("error")
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong");
    res.redirect("/admin");
  }
};
