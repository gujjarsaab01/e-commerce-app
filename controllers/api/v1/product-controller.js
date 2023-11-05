import slugify from "slugify";
import ProductModel from "../../../Model/ProductModel.js";
import fs from "fs";
import CategoryModel from "../../../Model/CategoryModel.js";
import braintree from "braintree";
import OrderModel from "../../../Model/OrderModel.js";
import dotenv from 'dotenv';

dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name Is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "Photo is Required and should be less than 1mb" });
    }

    const products = new ProductModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created successfully",
      products,
    });
  } catch (error) {
    console.log("Error in Creating Product", error);
    res.status(500).send({
      success: false,
      message: "Error in creating Product",
      error,
    });
  }
};
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, quantity, category, shipping } =
      req.fields;
    const { photo } = req.files;

    //Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !description:
        return res.status(500).send({ error: "Description is required" });
      case !price:
        return res.status(500).send({ error: "Price is required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is required" });
      case !category:
        return res.status(500).send({ error: "Category is required" });
      case photo && photo.size > 1000000:
        return res.status(500).send({ error: "Photo is required" });
    }
    const products = await ProductModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated successfully",
      products,
    });
  } catch (error) {
    console.log("Error in Updating Product");
    res.status(500).send({
      success: false,
      message: "Error while Updating Product",
      error,
    });
  }
};
export const deleteProductController = async (req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log("Error in Delete Product", error);
    res.status(500).send({
      success: false,
      message: "Error while Deleting Product",
      error,
    });
  }
};
export const getAllProductController = async (req, res) => {
  try {
    const products = await ProductModel.find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      totalCount: products.length,
      message: "Products Feteched successfully",
      products,
    });
  } catch (error) {
    console.log("Error in getting product", error);
    res.status(500).send({
      success: false,
      message: "Error while feteching Products",
      error: error.message,
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const product = await ProductModel.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Feteched successfully",
      product,
    });
  } catch (error) {
    console.log("Error in single Product", error);
    res.status(500).send({
      success: false,
      message: "Error while fetching Single Product",
      error,
    });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(" Error in feteching Photo");
    res.status(500).send({
      success: false,
      message: "Error while feteching Photo",
      error,
    });
  }
};

export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await ProductModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log("Error in Filter Prices", error);
    res.status(400).send({
      success: false,
      message: "Error while Filter products by prices",
      error: error.message,
    });
  }
};

// product count
export const productCountCOntroller = async (req, res) => {
  try {
    const total = await ProductModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in product count",
      error,
    });
  }
};

//product list base on page
export const productListCOntroller = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await ProductModel.find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in product list count",
      error,
    });
  }
};

//product search
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await ProductModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).select("-photo");
    res.json(results);
  } catch (error) {
    console.log("Error in Product Search Ctrl");
    res.status(400).send({
      success: false,
      message: "error in serach ctrl",
      error,
    });
  }
};

//related product
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;

    const products = await ProductModel.find({
      category: cid,
      _id: { $ne: pid }, //$ne = not include pid
    })
      .select("-photo")
      .limit(5)
      .populate("category");
    res.status(200).send({
      success: false,
      message: "Similar Products Feteched",
      products,
    });
  } catch (error) {
    console.log("Error in related product ctrl", error);
    res.status(400).send({
      success: false,
      message: "Error in related Product Ctrl",
      error,
    });
  }
};

export const productCategoryController = async (req, res) => {
  try {
    const category = await CategoryModel.findOne({ slug: req.params.slug });
    const products = await ProductModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      message: "Product fetched successfully",
      category,
      products,
    });
  } catch (error) {
    console.log("Error in product category ctrl", error);
    res.status(400).send({
      success: false,
      message: "Error while fetching product category",
      error,
    });
  }
};

//payment gateway api // token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log("Error in token Ctrl");
    res.status(400).send({
      success: false,
      message: "Error in token  ctrl",
      error,
    });
  }
};

//payments
export const braintreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((i) => (total += i.price));
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new OrderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error)
        }
      }
    );
  } catch (error) {
    console.log("Error in payment ctrl");
    res.status(400).send({
      success: false,
      message: "Error in Payment  ctrl",
      error,
    });
  }
};
