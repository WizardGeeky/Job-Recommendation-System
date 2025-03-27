import { NextRequest, NextResponse } from "next/server";
import databaseConnection from "@/app/config/database-config";
import { encryptData } from "@/app/util/cipher";
import Otp from "@/app/model/Otp";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await databaseConnection();
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are both required" },
        { status: 400 }
      );
    }

    // Encrypt email for security (but only for checking in the database)
    const encryptedEmail = encryptData(email);
    const existingOtpDetails = await Otp.findOne({ email: encryptedEmail });

    // Log for debugging OTP matching
    console.log("Stored OTP:", existingOtpDetails?.otp);
    console.log("Entered OTP:", otp);

    if (!existingOtpDetails) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const currentTime = new Date();

    // Check if OTP is valid and has not expired
    if (otp === existingOtpDetails.otp) {
      if (currentTime > existingOtpDetails.expiry) {
        return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
      }

      return NextResponse.json({ message: "true" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
