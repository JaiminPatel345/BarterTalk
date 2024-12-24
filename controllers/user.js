import User from "../models/user.js";

const getUsers = (req, res) => {
  const loggedInUserId = req.user._id;
  User.find({
    _id: {
      $ne: loggedInUserId,
    },
  })
    .then((users) => {
      if (!users) {
        throw {
          message: "No users found",
        };
      }
      return res.json(users);
    })
    .catch((error) => {
      res.status(error.status || 500).json({
        message: error.message,
      });
    });
};

const UpdateProfile = (req, res) => {
  const userId = req.user._id;
  const { profileUrl, name } = req.body;

  let payload;

  if (profileUrl && name) {
    payload = {
      profileUrl,
      name,
    };
  } else if (profileUrl) {
    payload = {
      profileUrl,
    };
  } else if (name) {
    payload = {
      name,
    };
  }

  if (!payload) {
    return res.status(400).json({
      message: "No data provided",
    });
  }

  User.findByIdAndUpdate(userId, payload, {
    new: true,
  })
    .then((user) => {
      if (!user) {
        throw {
          message: "User not found",
          status: 404,
        };
      }
      return res.status(201).json({ user, message: "Updated successfully" });
    })
    .catch((error) => {
      console.log(error);
      res.status(error.status || 500).json({
        message: error.message,
      });
    });
};

export default {
  getUsers,
  UpdateProfile,
};
