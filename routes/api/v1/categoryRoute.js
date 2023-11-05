import express from "express";
import { isAdmin, isLoggedIn } from "../../../middlewares/auth-MiddleWare.js";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoryController,
  singleCategoryController,
  updateCategoryController,
} from "../../../controllers/api/v1/category-controller.js";

const router = express.Router();

//route
//create category
router.post("/create-category", isLoggedIn, isAdmin, createCategoryController);

//update category
router.put(
  "/update-category/:id",
  isLoggedIn,
  isAdmin,
  updateCategoryController
);

//Get ALl category
router.get("/get-category", getAllCategoryController);

//single category
router.get("/single-category/:slug", singleCategoryController);

//delete category
router.delete(
  "/delete-category/:id",
  isLoggedIn,
  isAdmin,
  deleteCategoryController
);

export default router;
