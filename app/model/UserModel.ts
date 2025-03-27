import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  profileImage?: string;
  email: string;
  password: string;
  resume: boolean;
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    profileImage: { type: String, default: "" },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    resume: { type: Boolean, default:false},
    skills: { type: [String], default: [] },
  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", UserSchema);
export default User;
