import { Router } from "express";
import { createUser, upsertUser, findUserByEmail, findUserById } from "./users.services.js";

const router = Router();

router.post("/signup", createUser);
router.put("/:id", upsertUser);
router.get("/email/:email", findUserByEmail);
router.get("/:id", findUserById);

export default router;


