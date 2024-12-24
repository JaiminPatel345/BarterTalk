import User from "../models/user.js";
import generateTokenAndSetCookies from "./token.js";

const useGoogleSignup = async (googleUser, res) => {
  //find user in db
  const dbUser = await User.findOne({
    email: googleUser.email,
  });
  if (dbUser) {
    //generate token and set cookies
    generateTokenAndSetCookies(dbUser._id, res);
    return res.status(222).json({
      user: dbUser,
      message: "Already registered , no need to signup",
    });
  }
  const newUser = new User({
    name: googleUser.name || googleUser.given_name,
    email: googleUser.email,
    username: googleUser.email,
  });

  const user = await newUser.save();
  generateTokenAndSetCookies(user._id, res);

  return res.status(201).json({
    message: "User created successfully",
    user,
  });
};

export default useGoogleSignup;
