const bcrypt = require("bcrypt");
const { User } = require("../models");
const ErrorHander = require("../utils/errorHandler.util");

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) return next(new ErrorHander("User not found", 404));

    await user.update(req.body);

    return res.json({
      success: true,
      message: "Profile updated",
      data: user,
    });
  } catch (error) {
    return next(new ErCrorHander(error.message, 500));
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    const validPassword = await bcrypt.compare(oldPassword, user.password);

    if (!validPassword)
      return next(new ErrorHander("Old password incorrect", 400));

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    return res.json({
      success: true,
      message: "Password changed",
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
};
