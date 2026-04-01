const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  role: { 
    type: String, 
    enum: ["student", "admin"], 
    default: "student" 
  },

  usn: {
    type: String,
    required: function () {
      return this.role === "student";
    }
  },

  branch: {
    type: String,
    required: function () {
      return this.role === "student";
    }
  },

  cgpa: {
    type: Number,
    required: function () {
      return this.role === "student";
    }
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);