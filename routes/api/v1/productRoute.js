import express from "express";
import { isAdmin, isLoggedIn } from "../../../middlewares/auth-MiddleWare.js";
import {
  braintreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getAllProductController,
  getSingleProductController,
  productCategoryController,
  productCountCOntroller,
  productFiltersController,
  productListCOntroller,
  productPhotoController,
  relatedProductController,
  searchProductController,
  updateProductController,
} from "../../../controllers/api/v1/product-controller.js";
import formidable from "express-formidable";

const router = express.Router();

//create product
router.post(
  "/create-product",
  isLoggedIn,
  isAdmin,
  formidable(),
  createProductController
);

//update product
router.put(
  "/update-product/:pid",
  isLoggedIn,
  isAdmin,
  formidable(),
  updateProductController
);

//Get All Products
router.get("/get-product", getAllProductController);

//single product
router.get("/single-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//Delete Product
router.delete("/delete-product/:pid", deleteProductController);

//filter product
router.post("/product-filter", productFiltersController)

//procduct count
router.get('/product-count', productCountCOntroller);

//product per Page
router.get('/product-list/:page', productListCOntroller);

//product search 
router.get('/search/:keyword', searchProductController);

//similar Products
router.get('/related-product/:pid/:cid', relatedProductController);

//product wise category
router.get('/product-category/:slug', productCategoryController)

//payment gateway // token
router.get('/braintree/token', braintreeTokenController)

//payments
router.post('/braintree/payment', isLoggedIn, braintreePaymentController)


export default router;
