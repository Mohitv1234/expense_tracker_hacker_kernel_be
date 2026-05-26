const { Tag } = require("../models");
const ErrorHander = require("../utils/errorHandler.util");

exports.createTag = async (req, res, next) => {
  try {
    const tag = await Tag.create({
      user_id: req.user.id,
      name: req.body.name,
    });

    return res.status(201).json({
      success: true,
      data: tag,
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
};

exports.getTags = async (req, res, next) => {
  try {
    const tags = await Tag.findAll({
      where: {
        user_id: req.user.id,
      },
    });

    return res.json({
      success: true,
      data: tags,
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
};

exports.deleteTag = async (req, res, next) => {
  try {
    const tag = await Tag.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!tag) return next(new ErrorHander("Tag not found", 404));

    await tag.destroy();

    return res.json({
      success: true,
      message: "Tag deleted",
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
};
