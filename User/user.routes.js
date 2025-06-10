import e from "express";
import {
  createUserHandler,
  currentUserHandler,
  loginUserHandler,
} from "./user.controllers.js";
import passport from "passport";
import { generateToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";
import { sql } from "../utils/db.js";

const router = e.Router();

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/check",
    failureRedirect: "/login",
  });
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await sql.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    });

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({
          message: "Login failed",
          error: err.message,
        });
      }
      // console.log("User logged in successfully");
      res.redirect("/check");
    });

    res.status(201).json({
      message: "User created successfully",
      user: user,
    });
  } catch (error) {
    res.status(400).json({
      message: "Registration failed",
      error: error.message,
    });
  }
});

router.get("/current", currentUserHandler);

router.get("/status", (req, res) => {
  if (req.isAuthenticated()) {
    const user = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      image: req.user.image,
    };

    // ✅ Sign a short-lived JWT token for WebSocket auth
    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return res.status(200).json({
      isAuthenticated: true,
      user,
      token, // 👈 include JWT here
    });
  }

  return res.status(200).json({ isAuthenticated: false });
});

export default router;
