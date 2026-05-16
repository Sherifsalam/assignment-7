import { Router } from "express";
import {
  createPost,
  deletePost,
  getPostsDetails,
  getPostsCommentCount,
} from "./posts.services.js";


const router = Router();

router.post("/", createPost);
router.delete("/:postId", deletePost);
router.get("/details", getPostsDetails);
router.get("/comment-count", getPostsCommentCount);

export default router;
