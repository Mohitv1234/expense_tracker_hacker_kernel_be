// controllers/user.controller.js

const bcrypt = require('bcrypt');

const { User } = require('../models');


// =====================================
// GET PROFILE
// =====================================

exports.getProfile = async (
  req,
  res
) => {

  try {

    const user =
      await User.findByPk(
        req.user.id
      );

    return res.json({
      success: true,
      data: user
    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// =====================================
// UPDATE PROFILE
// =====================================

exports.updateProfile = async (
  req,
  res
) => {

  try {

    const user =
      await User.findByPk(
        req.user.id
      );

    if (!user) {

      return res.status(404).json({
        success: false,
        message: 'User not found'
      });

    }

    await user.update(req.body);

    return res.json({
      success: true,
      message: 'Profile updated',
      data: user
    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// =====================================
// CHANGE PASSWORD
// =====================================

exports.changePassword = async (
  req,
  res
) => {

  try {

    const {
      oldPassword,
      newPassword
    } = req.body;

    const user =
      await User.findByPk(
        req.user.id
      );

    const validPassword =
      await bcrypt.compare(
        oldPassword,
        user.password
      );

    if (!validPassword) {

      return res.status(400).json({
        success: false,
        message: 'Old password incorrect'
      });

    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.password =
      hashedPassword;

    await user.save();

    return res.json({
      success: true,
      message: 'Password changed'
    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};