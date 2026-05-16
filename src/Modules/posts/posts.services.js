import { Post, User, Comment, sequelize } from "../../DB/models/Models.js";

export const createPost = async (req, res) => {
  try {
    const { title, context, user_id } = req.body;

    const newPost = new Post({ title, context, user_id });
    await newPost.save();

    res
      .status(201)
      .json({ message: "Post created successfully.", post: newPost });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((e) => e.message);
      return res
        .status(400)
        .json({ message: "Validation failed.", errors: messages });
    }
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { user_id } = req.body;

    const post = await Post.findByPk(postId, { paranoid: false });
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (post.user_id !== Number(user_id)) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this post." });
    }

    await post.destroy();
    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

export const getPostsDetails = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ["id", "title"],
      include: [
        { model: User, attributes: ["id", "name"] },
        { model: Comment, attributes: ["id", "context"] },
      ],
    });

    res.status(200).json({ posts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

export const getPostsCommentCount = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: [
        "id",
        "title",
        [sequelize.fn("COUNT", sequelize.col("Comments.id")), "commentCount"],
      ],
      include: [{ model: Comment, attributes: [] }],
      group: ["Post.id"],
    });

    res.status(200).json({ posts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};
