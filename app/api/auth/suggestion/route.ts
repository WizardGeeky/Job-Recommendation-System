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
      return NextResponse.json(
        { message: "Upload your resume to get perfect job matches.", resume: true },
        { status: 200 }
      );
    }

    const response = await fetch("https://remoteok.com/api", {
      headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
    });

    const jobs = await response.json();
    if (Array.isArray(jobs) && jobs.length > 0) jobs.shift();

    const userSkills = user.skills?.map((skill: string) => skill.toLowerCase()) || [];

    const matchedJobs = jobs
      .filter((job: any) => job.tags?.some((tag: string) => userSkills.includes(tag.toLowerCase())))
      .slice(0, 3); // Only top 3 jobs

    if (matchedJobs.length === 0) {
      return NextResponse.json(
        { message: "No job matches found. Upload your resume for better matches.", resume: true },
        { status: 200 }
      );
    }

    const formattedJobs = matchedJobs.map((job: any) => ({
      id: job.id,
      position: job.position,
      company: job.company,
      tags: job.tags || [],
      location: job.location || "Not specified",
      salaryMin: job.salary_min || 0,
      salaryMax: job.salary_max || 0,
      applyUrl: job.url,
    }));

    return NextResponse.json({ resume: false, jobs: formattedJobs }, { status: 200 });

  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
