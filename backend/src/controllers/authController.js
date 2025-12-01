const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.login = async (req, res) => {
  const { email, password, identifier } = req.body;
  const lookup = email || identifier;

  const user = await User.findOne({ $or: [{ email: lookup }, { username: lookup }] });
  if (!user) return res.status(401).json({ message: "Invalid Credentials" });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ message: "Invalid Credentials" });

  const token = createToken(user);
  res.cookie(process.env.COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({
    message: "Login successful",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

exports.logout = (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME);
  res.json({ message: "logged out" });
};

exports.me = async (req, res) => {
  const user = await User.findById(req.userId).select("username email id");
  res.json({
    message: "User retrieved",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 6–20 characters and include both uppercase and lowercase letters.",
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username is already taken. Try another one." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email is already registered. Try logging in." });
    }

    const user = await User.create({ username, email, password });

    const token = createToken(user);

    res.cookie(process.env.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({ message: "Server error during signup" });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { userId, username, password } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) {
      user.username = username;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      alert("Wrong password. Please try again.");
      return;
    }
    user.password = password;

    const savedUser = await user.save();

    res.json({
      message: "User info updated successfully",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      },
    });
  } catch (err) {
    console.error("Error in updateMe:", err);
    res.status(500).json({ error: err.message });
  }
};
