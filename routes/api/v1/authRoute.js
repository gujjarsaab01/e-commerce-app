import express from "express";
import {
  loginController,
  registerController,
  forgotPasswordController,
  testController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  OrderStatusController,
} from "../../../controllers/api/v1/auth-controller.js";
import { isAdmin, isLoggedIn } from "../../../middlewares/auth-MiddleWare.js";

//router object
const router = express.Router();

//rotuing
//Register || method post
router.post("/register", registerController);

//Login || POST
router.post("/login", loginController);

//forgotPassword
router.post("/forgot-password", forgotPasswordController);

//test routes
router.get("/test", isLoggedIn, isAdmin, testController);

//protected user route_auth
router.get("/user-auth", isLoggedIn, (req, res) => {
  res.status(200).json({ok: true})
});

//protected admin route_auth
router.get("/admin-auth", isLoggedIn, isAdmin, (req, res) => {
  res.status(200).json({ok: true})
});

//update Profile
router.put('/profile', isLoggedIn, updateProfileController)

//orders
router.get('/orders', isLoggedIn, getOrdersController)

//all orders 
router.get('/all-orders', isLoggedIn, isAdmin, getAllOrdersController);

// order Status
router.put('/order-status/:orderId', isLoggedIn, isAdmin, OrderStatusController);
export default router;
