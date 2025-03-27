"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { isTokenExpired } from "@/app/util/token";

interface JwtPayload {
  email: string;
  exp?: number;
}

interface Job {
  id: string;
  position: string;
  company: string;
  tags: string[];
  location: string;
  salaryMin: number;
  salaryMax: number;
  applyUrl: string;
}

export default function Jobs() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    const fetchRecommendedJobs = async () => {
      if (!email) return;
      try {
        const response = await fetch("/api/auth/suggestion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (response.ok) {
          setRecommendedJobs(data.jobs || []);
        }
      } catch (error) {
        setError("Failed to load recommended jobs.");
      }
    };
    fetchRecommendedJobs();
  }, [email]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/auth/jobs");
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading)
    return <div className="text-center text-lg">Loading jobs...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const currentJobs = jobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  return (
    <div className="py-5md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 lg:my-10">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Jobs</h2>
          <div className="grid grid-cols-1 gap-4 space-y-3">
            {currentJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white shadow-md rounded-md p-4 border lg:border-l-8 border-violet-800 flex flex-col space-y-1"
              >
                <h3 className="text-2xl font-semibold">{job.position}</h3>
                <p className="text-gray-900 font-medium text-lg">{job.company}</p>
                <p className="text text-gray-700">
                  Location: {job.location}
                </p>
                <p className="text text-gray-500">
                  Tags: {job.tags.join(", ")}
                </p>
                <p className="text text-gray-500">
                  Salary: ${job.salaryMin} - ${job.salaryMax}
                </p>
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 bg-violet-500 text-white px-4 py-2 rounded-md transition text-center"
                >
                  Apply Now
                </a>
              </div>
            ))}
          </div>

          {/* Updated Pagination */}
          <div className="flex justify-center mt-6 space-x-2 p-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>

            <span className="px-4 py-2 border rounded-md bg-violet-700 text-white">
              {currentPage}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        <div className="hidden lg:block bg-white">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recommended Jobs
          </h2>
          {recommendedJobs.length > 0 ? (
            recommendedJobs.map((job) => (
              <div
                key={job.id}
                className="p-4 mb-4 shadow-sm rounded-md border border-gray-100 bg-white transition-transform transform hover:scale-105 hover:shadow-xl"
              >
                <div className="bg-gradient-to-r from-violet-500 to-indigo-900 text-white p-3 rounded-t-lg">
                  <h3 className="font-semibold text-lg">{job.position}</h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 flex items-center gap-2">
                    <span className="font-semibold">Company:</span>{" "}
                    {job.company}
                  </p>
                  <p className="text-gray-700 flex items-center gap-2">
                    <span className="font-semibold">Location:</span>{" "}
                    {job.location}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Salary:</span> $
                    {job.salaryMin} - ${job.salaryMax}
                  </p>
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block bg-black text-white px-5 py-2 rounded-md text-center font-medium hover:bg-gray-900 transition"
                  >
                    View Job
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No recommendations available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
