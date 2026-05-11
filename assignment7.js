import express from "express";
import { User, Post, Comment, sequelize } from "./Models.js";
import userRoutes from "./user.routes.js";
import postRoutes from "./post.routes.js";
import commentRoutes from "./comments.routes.js";


const app = express();
app.use(express.json());
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);




const testconnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

testconnection();

sequelize.sync({ alter: false });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
