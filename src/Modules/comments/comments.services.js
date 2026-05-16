import { Op } from "sequelize";
import { Comment, User, Post } from "../../DB/models/Models.js";

export const createComments = async (req, res) => {
  try {
    const comments = req.body.comments;

    const newComments = await Comment.bulkCreate(comments, { validate: true });

    res.status(201).json({ message: "Comments created successfully.", comments: newComments });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({ message: "Validation failed.", errors: messages });
    }
    res.status(500).json({ message: "Something went wrong.", error: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { context, user_id } = req.body;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    if (comment.user_id !== Number(user_id)) {
      return res.status(403).json({ message: "You are not the owner of this comment." });
    }

    comment.context = context || comment.context;
    await comment.save();

    res.status(200).json({ message: "Comment updated successfully.", comment });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({ message: "Validation failed.", errors: messages });
    }
    res.status(500).json({ message: "Something went wrong.", error: error.message });
  }
};

export const findOrCreateComment = async (req, res) => {
  try {
    const { context, user_id, post_id } = req.body;

    const [comment, created] = await Comment.findOrCreate({
      where: { context, user_id, post_id },
    });

    res.status(200).json({
      message: created ? "Comment created successfully." : "Comment already exists.",
      comment,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({ message: "Validation failed.", errors: messages });
    }
    res.status(500).json({ message: "Something went wrong.", error: error.message });
  }
};

export const searchComments = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({ message: "Keyword is required." });
    }

    if (keyword.length > 30) {
      return res.status(400).json({ message: "Keyword is too long." });
    }

    const safeKeyword = keyword.replace(/[%_\\]/g, "\\$&");

    const comments = await Comment.findAndCountAll({
      where: {
        context: { [Op.like]: `%${safeKeyword}%` },
      },
    });

    if (comments.count === 0) {
      return res.status(404).json({ message: "No comments found." });
    }

    res.status(200).json({ message: "Comments found.", comments });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong.", error: error.message });
  }
};

export const getNewestComment = async (req, res) => {
  try {
    const { postId } = req.params;

    const comment = await Comment.findOne({
      where: { post_id: postId },
      order: [["createdAt", "DESC"]],
    });

    if (!comment) {
      return res.status(404).json({ message: "No comments found for this post." });
    }

    res.status(200).json({ message: "Newest comment found.", comment });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong.", error: error.message });
  }
};

export const getCommentDetails = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findByPk(commentId, {
      attributes: ["id", "context"],
      include: [
        { model: User, attributes: ["id", "name"] },
        { model: Post, attributes: ["id", "title"] },
      ],
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    res.status(200).json({ message: "Comment found.", comment });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong.", error: error.message });
  }
};