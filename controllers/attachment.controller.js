// controllers/attachment.controller.js

const {
  Attachment,
  Transaction
} = require('../models');


// =====================================
// UPLOAD ATTACHMENT
// =====================================

exports.uploadAttachment = async (
  req,
  res
) => {

  try {

    const {
      transaction_id
    } = req.body;

    const transaction =
      await Transaction.findOne({

        where: {
          id: transaction_id,
          user_id: req.user.id
        }

      });

    if (!transaction) {

      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });

    }

    const attachment =
      await Attachment.create({

        transaction_id,

        file_url:
          req.file.path,

        file_type:
          req.file.mimetype

      });

    return res.status(201).json({
      success: true,
      data: attachment
    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// =====================================
// GET ATTACHMENTS
// =====================================

exports.getAttachments = async (
  req,
  res
) => {

  try {

    const attachments =
      await Attachment.findAll();

    return res.json({
      success: true,
      data: attachments
    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};