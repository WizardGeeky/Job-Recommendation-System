import { NextRequest, NextResponse } from "next/server";
import databaseConnection from "@/app/config/database-config";
import { encryptData } from "@/app/util/cipher";
import User from "@/app/model/UserModel";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await databaseConnection();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "email and password are both required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: encryptData(email) });
    if (!user) {
      return NextResponse.json({ error: "Email not found." }, { status: 404 });
    }

    if (user.password === encryptData(password)) {
      return NextResponse.json(
        { error: "New password cannot be the same as the old password." },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    user.password = encryptData(password);
    await user.save();

    return NextResponse.json(
      { message: "Password updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Error updating password." },
      { status: 500 }
    );
  }
}
