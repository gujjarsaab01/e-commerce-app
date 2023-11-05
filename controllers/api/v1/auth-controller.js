import OrderModel from "../../../Model/OrderModel.js";
import UserModel from "../../../Model/UserModel.js";
import { comparePassword, hashPassword } from "../../../helpers/authHelper.js";
import JWT from "jsonwebtoken";

//POST Register
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    //validation
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Mobile number is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is Required" });
    }

    //check User already registerd

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User with this email already registered, Please login",
      });
    }

    //register user
    const passwordHashed = await hashPassword(password);

    const user = await new UserModel({
      name,
      email,
      password: passwordHashed,
      phone,
      address,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Registerd Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

//POST Login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    //check user is registered or not
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not Registered",
      });
    }

    //validation to match password with hashed password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid Password",
      });
    }

    //token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "LoggedIn Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(" Login- controller Error", error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error: error.message,
    });
  }
};

//forgot Password Controller Post
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }

    //check email or question"s answer
    const user = await UserModel.findOne({ email, answer });

    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Question",
      });
    }

    const hashed = await hashPassword(newPassword);
    await UserModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

//test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({
      error,
    });
  }
};

//update profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await UserModel.findById(req.user._id);
    if (password && password.length < 6) {
      return res.json({ error: "Password Required And Must 6 Character Long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.password,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "User Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log("error in update profile", error);
    res.status(400).send({
      success: false,
      message: "Error while updating profile",
      error,
    });
  }
};

//order
export const getOrdersController = async (req, res) => {
  try {
    const bOrders = await OrderModel.find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.status(200).json({
      success: true,
      message: "Orders Fetched Successfully",
      bOrders,
    });
  } catch (error) {
    console.log("Error in Order Ctrl", error);
    res.status(400).send({
      success: false,
      message: "Error while getting Orders Details",
      error,
    });
  }
};

//all orders
export const getAllOrdersController = async (req, res) => {
  try {
    const allOrders = await OrderModel.find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.status(200).send({
      success: true,
      message: "All Orders Fetched",
      allOrders,
    });
  } catch (error) {
    console.log("Error in all orders ctrl", error);
    res.status(500).send({
      success: false,
      message: "Error in getting all orders",
      error,
    });
  }
};

//order-Status
export const OrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const OrderStatus = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In changing Order Status",
      error,
    });
  }
};
