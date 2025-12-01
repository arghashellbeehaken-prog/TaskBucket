const mongoose = require("mongoose");

exports.connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✔ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("X MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};
