const Product = require("../models/product");
const Category = require("../models/category");
const slugify = require("slugify");
const fs = require("fs");
const { validateProduct } = require("../middlewares/validate");

// ---------- Admin Section ----------

// List all products
exports.list = async (req, res) => {
  const products = await Product.find({ isDeleted: false }).populate("category").lean();
  res.render("admin/products", { title: "Products", products });
};

// Show Add Product Form
exports.addForm = async (req, res) => {
  const categories = await Category.find({ isDeleted: false }).lean();
  res.render("admin/addProduct", { title: "Add Product", product: {}, categories });
};

// Create Product
exports.create = async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) {
    req.flash("error", error.details[0].message);
    return res.redirect("/admin/products/add");
  }

  const product = new Product({
    name: req.body.name,
    slug: slugify(req.body.name, { lower: true }),
    category: req.body.category,
    description: req.body.description,
    image: req.file ? req.file.filename : null
  });

  await product.save();
  req.flash("success", "Product added successfully");
  res.redirect("/admin/products");
};

// Show Edit Product Form
exports.editForm = async (req, res) => {
  const product = await Product.findById(req.params.id).lean();
  const categories = await Category.find({ isDeleted: false }).lean();
  res.render("admin/editProduct", { title: "Edit Product", product, categories });
};

// Update Product
exports.update = async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) {
    req.flash("error", error.details[0].message);
    return res.redirect("/admin/products/edit/" + req.params.id);
  }

  const product = await Product.findById(req.params.id);

  let newImage = product.image;
  if (req.file) {
    if (product.image && fs.existsSync("public/uploads/" + product.image)) {
      fs.unlinkSync("public/uploads/" + product.image);
    }
    newImage = req.file.filename;
  }

  await Product.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    slug: slugify(req.body.name, { lower: true }),
    category: req.body.category,
    description: req.body.description,
    image: newImage
  });

  req.flash("success", "Product updated successfully");
  res.redirect("/admin/products");
};

// Delete Product (Soft Delete)
exports.delete = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product.image && fs.existsSync("public/uploads/" + product.image)) {
    fs.unlinkSync("public/uploads/" + product.image);
  }
  await Product.findByIdAndUpdate(req.params.id, { isDeleted: true });

  req.flash("success", "Product deleted successfully");
  res.redirect("/admin/products");
};

// ---------- Customer Section ----------

// List products for customer homepage
exports.listProducts = async (req, res) => {
  const { category, search } = req.query;
  let filter = { isDeleted: false };

  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: "i" };

  const products = await Product.find(filter).populate("category").lean();
  const categories = await Category.find({ isDeleted: false }).lean();

  res.render("customer/home", {
    title: "Homepage",
    products,
    categories,
    selectedCategory: category || "",
    search: search || ""
  });
};

// Product Detail Page
exports.productDetail = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isDeleted: false }).populate("category").lean();
  if (!product) {
    req.flash("error", "Product not found");
    return res.redirect("/");
  }

  res.render("customer/productDetail", {
    title: product.name,
    product
  });
};
