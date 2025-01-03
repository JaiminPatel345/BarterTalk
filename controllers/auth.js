import mongoose from "mongoose";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateTokenAndSetCookies from "../utilities/token.js";
import useGoogleLogin from "../utilities/useGoogleLogin.js";
import useGoogleSignup from "../utilities/useGoogleSignup.js";

const login = async (req, res) => {
  const isByGoogle = req.query.bygoogle;
  if (isByGoogle) {
    await useGoogleLogin(req.body, res);
    return;
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      message: "Please fill all the required fields",
    });
  }

  User.findOne({
    username: username,
  })
    .then((user) => {
      if (!user) {
        throw {
          status: 400,
          message: "Invalid credentials",
        };
      }
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (!isValidPassword) {
        throw {
          status: 401,
          message: "Invalid credentials",
        };
      }
      generateTokenAndSetCookies(user._id, res);
      res.json({
        user,
        message: "Login successfully",
      });
    })
    .catch((error) => {
      res.clearCookie("token");
      return res.status(error.status || 500).json({
        message: error.message || "An error occurred during login",
      });
    });
};

const signup = async (req, res) => {
  const isByGoogle = req.query.bygoogle;
  if (isByGoogle) {
    await useGoogleSignup(req.body, res);
    return;
  }
  const { name, username, password, gender, email } = req.body;
  if (!name || !username || !password || !gender || !email) {
    return res.status(401).json({
      message: "Please fill all the required fields",
    });
  }

  User.findOne({
    username,
  })
    .then((data) => {
      if (data) {
        throw {
          status: 400,
          message: "Username already exists",
        };
      }
      let profileUrl = req.body.profileUrl;
      if (!profileUrl) {
        if (gender === "female") {
          profileUrl = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        } else {
          profileUrl = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        }
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const user = new User({
        name,
        username,
        password: hashedPassword,
        gender,
        email,
        profileUrl,
      });

      return user.save();
    })
    .then((data) => {
      generateTokenAndSetCookies(data._id, res);
      return res.json({
        message: "User save successfully",
        data,
      });
    })
    .catch((error) => {
      console.log("Signup error", error);

      return res.status(error.status || 500).json({
        message: error.message || "An error occurred during signup",
      });
    });
};

const logout = (req, res) => {
  res.clearCookie("token");
  // req.session.destroy()
  res.json({
    message: "logout successfully",
  });
};

export default {
  login,
  signup,
  logout,
};
