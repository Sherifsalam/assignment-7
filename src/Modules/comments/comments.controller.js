import { Router } from "express";
import {
  createComments,
  updateComment,
  findOrCreateComment,
  searchComments,
  getNewestComment,
  getCommentDetails,
} from "./comments.services.js";
const router = Router();


router.post("/", createComments);
router.patch("/:commentId", updateComment);
router.post("/find_or_create", findOrCreateComment);
router.get("/search", searchComments);
router.get("/newest/:postId", getNewestComment);
router.get("/details/:commentId", getCommentDetails);

export default router;
