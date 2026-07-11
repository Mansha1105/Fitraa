import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check existing user
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // send response
    res.status(201).json({
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,

        age: user.age,
        height: user.height,
        weight: user.weight,
        gender: user.gender,

        goal: user.goal,
        workoutType: user.workoutType,

        targetWeight: user.targetWeight,
        calorieGoal: user.calorieGoal,
        waterGoal: user.waterGoal,

        profilePhoto: user.profilePhoto,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // return full profile
    res.json({
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,

        age: user.age,
        height: user.height,
        weight: user.weight,
        gender: user.gender,

        goal: user.goal,
        workoutType: user.workoutType,

        targetWeight: user.targetWeight,
        calorieGoal: user.calorieGoal,
        waterGoal: user.waterGoal,

        profilePhoto: user.profilePhoto,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ✅ SETUP PROFILE
router.put("/setup", protect, async (req, res) => {
  try {
    const {
      height,
      weight,
      age,
      gender,
      goal,
      workoutType,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        height,
        weight,
        age,
        gender,
        goal,
        workoutType,
      },
      { new: true }
    );

    res.json({
      message: "Profile completed successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ✅ UPDATE SETTINGS / PROFILE
router.put(
  "/update-profile",
  protect,
  async (req, res) => {
    try {
      const {
        name,
        email,
        age,
        height,
        weight,
        goal,
        workoutType,

        targetWeight,
        calorieGoal,
        waterGoal,

        profilePhoto,
      } = req.body;

      const user = await User.findByIdAndUpdate(
        req.userId,
        {
          name,
          email,
          age,
          height,
          weight,
          goal,
          workoutType,

          targetWeight,
          calorieGoal,
          waterGoal,

          profilePhoto,
        },
        { new: true }
      );

      res.json({
        message: "Profile updated successfully",
        user,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);
// ✅ GET CURRENT USER PROFILE
router.get(
  "/profile",
  protect,
  async (req, res) => {
    try {

      const user = await User.findById(req.userId).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.status(200).json(user);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }
  }
);
export default router;