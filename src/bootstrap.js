import express from "express";
import { sequelize } from "./DB/models/Models.js";
import userController from "./Modules/Users/users.controller.js";
import postController from "./Modules/Posts/posts.controller.js";
import commentController from "./Modules/Comments/comments.controller.js";

export const bootstrap = async () => {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  await sequelize.sync({ force: false });
  console.log("Tables synced successfully.");

  app.use("/users", userController);
  app.use("/posts", postController);
  app.use("/comments", commentController);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
