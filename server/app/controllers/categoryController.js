const Category = require("../models/category");
const slugify = require("slugify");
const { validateCategory } = require("../middlewares/validate");

exports.list = async (req, res) => {
  const categories = await Category.find({ isDeleted: false });
  res.render("admin/categories", {
    categories,
    success: req.flash('success'),
    error: req.flash('error'),
    title: 'All Categories'   // <-- pass the title
  });
};

exports.addForm = (req, res) => {
  res.render("admin/addCategory", {
    category: {},
    title: 'Add Category'
  });
};

exports.create = async (req, res) => {
  const { error } = validateCategory(req.body);
  if (error) return res.send(error.details[0].message);

  const category = new Category({
    name: req.body.name,
    slug: slugify(req.body.name, { lower: true })
  });
  await category.save();
  req.flash('success', 'Category created successfully');
  res.redirect("/admin/categories");
};

exports.editForm = async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.render("admin/editCategory", {
    category,
    title: 'Edit Category'
  });
};

exports.update = async (req, res) => {
  const { error } = validateCategory(req.body);
  if (error) return res.send(error.details[0].message);

  await Category.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    slug: slugify(req.body.name, { lower: true })
  });
  req.flash('success', 'Category updated successfully');
  res.redirect("/admin/categories");
};

exports.delete = async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, { isDeleted: true });
  req.flash('success', 'Category deleted successfully');
  res.redirect("/admin/categories");
};
