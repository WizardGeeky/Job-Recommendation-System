import { NextResponse, NextRequest } from "next/server";
import User from "@/app/model/UserModel";
import databaseConnection from "@/app/config/database-config";
import { encryptData } from "@/app/util/cipher";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await databaseConnection();
    const { fullName, email, password } = await request.json();
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const encryptedFullname = encryptData(fullName);
    const encryptedEmail = encryptData(email);
    const encryptedPassword = encryptData(password);
    const existingUser = await User.findOne({ email: encryptedEmail });

    if (existingUser) {
      return NextResponse.json(
        { message: "user already exist with this email" },
        { status: 200 }
      );
    }

    const newUser = new User({
      fullName: encryptedFullname,
      email: encryptedEmail,
      resume: false,
      password: encryptedPassword,
    });
    await newUser.save();

    return NextResponse.json(
      { message: "User created successfully" + newUser },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "internal server error" + error },
      { status: 500 }
    );
  }
}
