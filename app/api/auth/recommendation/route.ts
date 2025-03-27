import { NextRequest, NextResponse } from "next/server";
import User from "@/app/model/UserModel";
import databaseConnection from "@/app/config/database-config";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await databaseConnection();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.resume) {
      return NextResponse.json({ resume: true }, { status: 200 }); // Prompt to upload resume
    }

    const response = await fetch("https://remoteok.com/api", {
      headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
    });

    const jobs = await response.json();
    if (Array.isArray(jobs) && jobs.length > 0) jobs.shift();

    const userSkills = user.skills?.map((skill: string) => skill.toLowerCase()) || [];

    const matchedJobs = jobs.filter((job: any) =>
      job.tags?.some((tag: string) => userSkills.includes(tag.toLowerCase()))
    );

    const formattedJobs = matchedJobs.map((job: any) => ({
      company: job.company,
      position: job.position,
      tags: job.tags || [],
      location: job.location || "Not specified",
      salary_min: job.salary_min || "Not specified",
      salary_max: job.salary_max || "Not specified",
      apply_url: job.apply_url,
    }));

    return NextResponse.json({ resume: false, jobs: formattedJobs }, { status: 200 });

  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
