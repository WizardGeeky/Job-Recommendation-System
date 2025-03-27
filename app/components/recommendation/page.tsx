"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { isTokenExpired } from "@/app/util/token";
import UploadResume from "../upload/page";

interface JwtPayload {
  email: string;
  exp?: number;
}

interface Job {
  company: string;
  position: string;
  tags: string[];
  location: string;
  salary_min: string | number;
  salary_max: string | number;
  apply_url: string;
}

export default function JobSuggestions() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [resumeRequired, setResumeRequired] = useState<boolean | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 3;

  useEffect(() => {
    const token = sessionStorage.getItem("auth_token");

    if (!token) {
      router.push("/");
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (isTokenExpired(decoded)) {
        router.push("/");
        return;
      }

      setEmail(decoded.email);
    } catch (error) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!email) return;

      try {

        const response = await fetch("/api/auth/recommendation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          setResumeRequired(data.resume);
          setJobs(data.jobs || []);
        } else {
        }
      } catch (error) {
      }
    };

    fetchUserDetails();
  }, [email]);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col items-center justify-center">
      {resumeRequired === null ? (
        <p>Loading...</p>
      ) : resumeRequired ? (
        <div className="lg:p-20 w-full">
          <UploadResume />
        </div>
      ) : jobs.length > 0 ? (
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Recommended Jobs</h2>
          <p className="text-gray-500 mb-2">Total Jobs: {jobs.length}</p>

          {currentJobs.map((job, index) => (
            <div key={index} className="border p-4 rounded-lg shadow-md mb-4 w-full">
              <h3 className="text-lg font-semibold">{job.position}</h3>
              <p className="text-gray-700">{job.company}</p>
              <p className="text-gray-500">{job.location}</p>
              <p className="text-green-600">
                Salary: {job.salary_min} - {job.salary_max}
              </p>
              <p className="text-sm text-gray-600">Tags: {job.tags.join(", ")}</p>
              <a
                href={job.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 font-semibold mt-2 block"
              >
                Apply Now
              </a>
            </div>
          ))}

          <div className="flex justify-center mt-4">
            {Array.from({ length: Math.ceil(jobs.length / jobsPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`px-3 py-1 mx-1 rounded ${
                  currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-red-600 font-semibold text-center">
          No job recommendations found.
        </p>
      )}
    </div>
  );
}
