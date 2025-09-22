const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middlewares/upload");

router.get("/", productController.list);
router.get("/add", productController.addForm);
router.post("/add", upload.single("image"), productController.create);
router.get("/edit/:id", productController.editForm);
router.post("/edit/:id", upload.single("image"), productController.update);
router.get("/delete/:id", productController.delete);

module.exports = router;
