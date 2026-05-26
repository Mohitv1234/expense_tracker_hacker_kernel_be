const { Attachment, Transaction } = require("../models");
const ErrorHander = require("../utils/errorHandler.util");

exports.uploadAttachment = async (req, res, next) => {
  try {
    const { transaction_id } = req.body;
    const transaction = await Transaction.findOne({
      where: { id: transaction_id, user_id: req.user.id },
    });

    if (!transaction) {
      return next(new ErrorHander("Transaction not found", 404));
    }

    const attachment = await Attachment.create({
      transaction_id,
      file_url: req.file.path,
      file_type: req.file.mimetype,
    });

    return res.status(201).json({
      success: true,
      data: attachment,
    });

  } catch (error) {
      return next(new ErrorHander(error.message, 500));
  }
};

exports.getAttachments = async (req, res, next) => {
  try {
    const attachments = await Attachment.findAll();
    return res.status(200).json({
      success: true,
      data: attachments,
    });
  } catch (error) {
      return next(new ErrorHander(error.message, 500));
  }
};
