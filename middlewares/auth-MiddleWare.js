import JWT from "jsonwebtoken";
import UserModel from "../Model/UserModel.js";

//Protected Routes token base
// export const isLoggedIn = async (req, res, next) => {
//   try {
//     const check = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
//     req.user = check; // cannot get id untill it decode
//     next();
//   } catch (error) {
//     console.log("Error", error);
//     res.status(401).send({
//       success: false,
//       message: "Error in Login middleware",
//       error,
//     });
//   }
// };
export const isLoggedIn = async (req, res, next) => {
  try {
    // Get the JWT token from the Authorization header
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    // Verify the token using the JWT_SECRET
    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    // Attach the user information to the request object
    req.user = decoded;

    // Continue to the next middleware or route
    next();
  } catch (error) {
    console.error("Error in isLoggedIn middleware:", error);
    return res.status(401).send({
      success: false,
      message: "Unauthorized: Invalid token",
    });
  }
};

//admin acccess
export const isAdmin = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    console.log(user);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
    
  } catch (error) {
    console.log("Error", error);
    res.status(401).send({
      success: false,
      message: "Error in Admin middleware",
      error,
    });
  }
};
