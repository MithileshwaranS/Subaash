import User from "../models/userModel.js";

export const registerUser = async (req, res) => {
  try {
    const { username } = req.body;

    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = new User({ username });
    await user.save();

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ message: "Error in registering user" });
  }
};
