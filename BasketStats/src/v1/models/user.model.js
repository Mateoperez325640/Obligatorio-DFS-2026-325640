import mongoose from "mongoose";
import { Role, Roles } from "../constants/role.constants.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: Roles,
    default: Role.user,
  },
  plan: {
    type: String,
    enum: ["plus", "premium"],
    default: "plus",
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;

    delete ret._id;
    delete ret.password;
    delete ret.__v;

    return ret;
  },
});

const User = mongoose.model("User", userSchema);

export default User;
