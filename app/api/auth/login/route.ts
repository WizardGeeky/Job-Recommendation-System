import { NextResponse, NextRequest } from "next/server";
import User from "@/app/model/UserModel";
import databaseConnection from "@/app/config/database-config";
import { encryptData, decryptData } from "@/app/util/cipher";
import { createToken } from "@/app/util/token";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await databaseConnection();

    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const encryptedEmail = encryptData(email);
    const existingUser = await User.findOne({ email: encryptedEmail });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const decryptedPassword = decryptData(existingUser.password);
    if (password !== decryptedPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT Token with correct payload format
    const token = createToken({ email: existingUser.email });

    return NextResponse.json(
      {
        message: "Login successful",
        token: token,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error: " + error },
      { status: 500 }
    );
  }
}
