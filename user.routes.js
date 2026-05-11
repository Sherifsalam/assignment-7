import {Router} from "express";
const router = Router();
import { User } from "./Models.js";


router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const newUser = User.build({ name, email, password, role });
    await newUser.save();

    res.status(201)
      .json({ message: "User created successfully.", user: newUser });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((e) => e.message);

      return res.status(400)
        .json({ message: "Validation failed.", errors: messages });
    }
    res.status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
});




router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;


        const [user, created] = await User.upsert(
        { id, name, email, password, role },
        { validate: false },
        );

    res.status(200).json({
      message: created
        ? "User created successfully."
        : "User updated successfully.",
      user,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((e) => e.message);
      return res
        .status(400)
        .json({ message: "Validation failed.", errors: messages });
    }

    res.status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
});


router.get("/email/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user });

  } catch (error) {
    res.status(500).json({ message: "Something went wrong.", error: error.message });
  }
});



router.get("/:id", async (req,res)=>{
const {id} = req.params;
try {
  const user = await User.findByPk(id, { attributes: { exclude: ["role"] } });
    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ user });
} catch (error) {
    res.status(500).json({ message: "Something went wrong.", error: error.message });
}
})


export default router;