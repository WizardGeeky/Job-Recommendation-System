import { Schema, model, models, Document } from "mongoose";

const OtpSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    expiry: { type: Date, required: true },
  },
  { timestamps: true }
);

interface IOtp extends Document {
  email: string;
  otp: string;
  expiry: Date;
}

const Otp = models.Otp || model<IOtp>("Otp", OtpSchema);

export default Otp;
