import CategoryModel from "../../../Model/CategoryModel.js";
import slugify from "slugify";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: " Name Is required" });
    }
    const existingCategpry = await CategoryModel.findOne({ name });
    if (existingCategpry) {
      return res.status(200).send({
        success: false,
        message: "Category Already Exists",
      });
    }

    const category = await new CategoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "New Category created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Category Controller",
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    ); // new user to updated object

    res.status(201).send({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.log("error in update controller", error);
    res.status(500).send({
      success: false,
      error,
      message: " Error While updating Category",
    });
  }
};

export const getAllCategoryController = async (req, res) => {
  try {
    const category = await CategoryModel.find({});

    res.status(200).send({
      success: true,
      message: " All Categories Fetched successfully",
      category,
    });
  } catch (error) {
    console.log("Error in Getting categories", error);
    res.status(500).send({
      success: false,
      message: "Error in Getting Category",
      error,
    });
  }
};

export const singleCategoryController = async (req, res) => {
  try {
    const category = await CategoryModel.findOne({
      slug: req.params.slug,
    });
    res.status(200).send({
      success: true,
      message: "Single Category List Fetched successfully",
      category,
    });
  } catch (error) {
    console.log("Error in single category", error);
    res.status(500).send({
      success: false,
      message: "Error While Fetching Single Category",
      error,
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await CategoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Category Deleted successfully",
    });
  } catch (error) {
    console.log("Error in Deleting Category");
    res.status(500).send({
      success: false,
      message: "Error while deleting category",
      error,
    });
  }
};
