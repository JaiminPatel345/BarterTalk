import User from "../models/user.js";
import generateToken from "./token.js";

const useGoogleSignup = async (googleUser, res) => {
  //find user in db
  const dbUser = await User.findOne({
    email: googleUser.email,
  });
  if (dbUser) {
    const token = generateToken(dbUser._id);
    return res.status(222).json({
      user: dbUser,
      token,
      message: "Already registered , no need to signup",
    });
  }
  const newUser = new User({
    name: googleUser.name || googleUser.given_name,
    email: googleUser.email,
    username: googleUser.email,
    profileUrl: `https://avatar.iran.liara.run/public/boy?username=${googleUser.email}`,
  });

  const user = await newUser.save();
  const token = generateToken(user._id);

  return res.status(201).json({
    message: "User created successfully",
    user,
    token,
  });
};

export default useGoogleSignup;
