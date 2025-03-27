import { NextRequest, NextResponse } from "next/server";
import databaseConnection from "@/app/config/database-config";
import { encryptData } from "@/app/util/cipher";
import User from "@/app/model/UserModel";
import Otp from "@/app/model/Otp";
import { sendOtpEmail } from "@/app/config/email-config";
import { randomInt } from "crypto";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await databaseConnection();
    const { email } = await request.json();
    const encryptedEmail = encryptData(email);
    
    const existingUser = await User.findOne({ email: encryptedEmail });
    if (!existingUser) {
      return NextResponse.json(
        { error: "Email does not exist" },
        { status: 400 }
      );
    }

    const otp = randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 2 * 60 * 1000);

    await Otp.findOneAndUpdate(
      { email: encryptedEmail },
      { otp, expiry },
      { upsert: true, new: true }
    );

    await sendOtpEmail(email, otp);
    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
