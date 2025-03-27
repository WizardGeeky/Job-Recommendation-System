import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/model/UserModel";
import { extractSkillsFromResume } from "@/app/util/extractskills";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Extract filename without extension (used for identifying the user)
    const fileNameWithoutExt = file.name.split(".").slice(0, -1).join(".");

    // Ensure the user exists
    const existingUser = await User.findOne({ email: fileNameWithoutExt });
    if (!existingUser) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "resumes",
          public_id: fileNameWithoutExt, 
          resource_type: "auto",
          format: "docx",
        },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      ).end(buffer);
    });
    

    if (!uploadResponse || !(uploadResponse as any).secure_url) {
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    // Extract skills from resume
    const skills = await extractSkillsFromResume(fileNameWithoutExt);
    if (!skills || skills.length === 0) {
      return NextResponse.json({ error: "No relevant skills found in resume" }, { status: 400 });
    }

    existingUser.skills = skills;
    existingUser.resume = true;
    await existingUser.save();

    return NextResponse.json({ message: "File uploaded successfully!"}, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
