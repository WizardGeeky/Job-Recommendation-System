import mongoose, { Schema, Document } from "mongoose";

// Define an interface for TypeScript support
export interface IJob extends Document {
  company: string;
  position: string;
  tags: string[];
  location: string;
  salaryMin: number;
  salaryMax: number;
  applyUrl: string;
}

// Define the Job Schema
const JobSchema: Schema = new Schema(
  {
    company: { type: String, required: true },
    position: { type: String, required: true },
    tags: { type: [String], default: [] },
    location: { type: String, default: "Remote" },
    salaryMin: { type: Number, required: false },
    salaryMax: { type: Number, required: false },
    applyUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export const JobModel = mongoose.model<IJob>("Job", JobSchema);
