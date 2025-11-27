const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  // validation logics to be added here
  const user = await User.create({ username, email, password });
  const token = createToken(user);
  res.cookie(process.env.COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(201).json({
    message: "Signup successful",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

exports.login = async (req, res) => {
  console.log("---------- login process running ----------");
  const { email, password, identifier } = req.body;
  const lookup = email || identifier;
  console.log(`login attempt lookup=${lookup}`);

  // login by EMAIL or USERNAME
  const user = await User.findOne({ $or: [{ email: lookup }, { username: lookup }] });
  console.log(`[login] userFound=${!!user} for lookup=${lookup}`);
  if (!user) return res.status(401).json({ message: "Invalid Credentials" });

  //check passwords
  const isMatch = await user.comparePassword(password);
  console.log(`[login] passwordMatch=${!!isMatch} for user=${user._id}`);
  if (!isMatch) return res.status(401).json({ message: "Invalid Credentials" });

  // all checked, all good, now generate a token
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
  console.log("login successful.");
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
