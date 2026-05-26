const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models");
const ErrorHander = require("../utils/errorHandler.util");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    const existingUser = await User.findOne({ where: { email }});

    if (existingUser) return next(new ErrorHander("Email already exists", 400));

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, phone });

    return res.status(201).json({ success: true, message: "Registration successful", data: user});

  } catch (error) {
      return next(new ErrorHander(error.message, 500))
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email }});
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword || !user) return next(new ErrorHander("Invalid credentials", 400));

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d"});

    return res.json({ success: true, token, user });

  } catch (error) {
      return next(new ErrorHander(error.message, 500))
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500))
  }
};
