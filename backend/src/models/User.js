const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
          return passwordRegex.test(value);
        },
        message:
          "Password must be between 6 and 20 characters and contain both uppercase and lowercase letters.",
      },
    },
  },
  {
    timestamps: true,
  }
);



UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
