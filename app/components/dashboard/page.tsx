"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../navbar/navbar";
import { decodeToken } from "@/app/util/token";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("auth_token");
      if (!token) {
        router.push("/");
        return;
      }
      const decoded = decodeToken(token);
      if (!decoded) {
        router.push("/");
      }
    }
  }, [router]);

  return (
    <div>
      <Navbar />
    </div>
  );
}
