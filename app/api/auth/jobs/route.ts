import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://remoteok.com/api", {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      data.shift();
    }

    const jobs = data.map((job: any) => ({
      id: job.id,
      position: job.position,
      company: job.company,
      tags: job.tags || [],
      location: job.location || "Remote",
      salaryMin: job.salary_min || 0,
      salaryMax: job.salary_max || 0,
      applyUrl: job.url,
    }));

    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching jobs", error},
      { status: 500 }
    );
  }
}