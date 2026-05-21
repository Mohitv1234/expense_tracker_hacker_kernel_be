// controllers/auth.controller.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models');


// =====================================
// REGISTER
// =====================================

exports.register = async (
  req,
  res
) => {

  try {

    const {
      name,
      email,
      password,
      phone
    } = req.body;

    const existingUser =
      await User.findOne({
        where: { email }
      });

    if (existingUser) {

      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await User.create({

        name,

        email,

        password: hashedPassword,

        phone

      });

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
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
// LOGIN
// =====================================

exports.login = async (
  req,
  res
) => {

  try {

    const {
      email,
      password
    } = req.body;

    const user =
      await User.findOne({
        where: { email }
      });

    if (!user) {

      return res.status(404).json({
        success: false,
        message: 'Invalid credentials'
      });

    }

    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!validPassword) {

      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });

    }

    const token = jwt.sign(

      {
        id: user.id,
        email: user.email
      },

      process.env.JWT_SECRET,

      {
        expiresIn: '7d'
      }

    );

    return res.json({
      success: true,
      token,
      user
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =====================================
// GET PROFILE
// =====================================

exports.getMe = async (
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