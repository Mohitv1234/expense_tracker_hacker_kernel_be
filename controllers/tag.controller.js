// controllers/tag.controller.js

const {
  Tag
} = require('../models');


// =====================================
// CREATE TAG
// =====================================

exports.createTag = async (
  req,
  res
) => {

  try {

    const tag =
      await Tag.create({

        user_id: req.user.id,

        name: req.body.name

      });

    return res.status(201).json({
      success: true,
      data: tag
    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// =====================================
// GET TAGS
// =====================================

exports.getTags = async (
  req,
  res
) => {

  try {

    const tags =
      await Tag.findAll({

        where: {
          user_id: req.user.id
        }

      });

    return res.json({
      success: true,
      data: tags
    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// =====================================
// DELETE TAG
// =====================================

exports.deleteTag = async (
  req,
  res
) => {

  try {

    const tag =
      await Tag.findOne({

        where: {
          id: req.params.id,
          user_id: req.user.id
        }

      });

    if (!tag) {

      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });

    }

    await tag.destroy();

    return res.json({
      success: true,
      message: 'Tag deleted'
    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};