"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { IoMdCloudUpload } from "react-icons/io";
import { FaFileWord } from "react-icons/fa";
import { decodeToken } from "@/app/util/token";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UploadResume() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("auth_token");

      if (!token) {
        router.push("/");
        return;
      }

      try {
        const decoded = decodeToken(token);
        if (!decoded || !decoded.email) {
          router.push("/");
          return;
        }
        setEmail(decoded.email);
      } catch (error) {
        console.error("Invalid token:", error);
        router.push("/");
      }
    }
  }, [router]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      // Check file extension manually
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      if (fileExt !== "docx") {
        toast.error("Only .docx files are allowed!");
        return;
      }

      setUploadedFile(file);
    }
  }, []);

  const uploadFile = async () => {
    if (!uploadedFile || !email) return;

    setUploading(true);
    const formData = new FormData();

    // Determine the correct filename format
    const fileExt = uploadedFile.name.split(".").pop();
    const filename = `${email}.${fileExt}`;

    formData.append("file", uploadedFile, filename);

    try {
      const response = await fetch("/api/auth/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "File uploaded successfully!");
        setUploadedFile(null);
      } else {
        toast.error(result.error || "Upload failed. Try again.");
      }
    } catch (error) {
      toast.error("An error occurred while uploading.");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"]
    },
    multiple: false,
  });

  return (
    <div>
      <div className="flex flex-col items-center justify-center bg-white p-6 lg:my-36">
        <p className="text-violet-500 lg:text-4xl md:text-2xl sm:text-xl font-semibold py-6">
          Upload Your Resume & Get Perfect Job Match 🚀
        </p>

        <div
          {...getRootProps()}
          className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg text-center border-2 border-dashed border-yellow-400 hover:border-purple-600 cursor-pointer transition-all flex flex-col items-center justify-center gap-4"
        >
          <IoMdCloudUpload className="text-7xl text-violet-700" />
          <input {...getInputProps()} />
          <p className="text-gray-700 font-medium text-center text-lg">
            {isDragActive
              ? "Drop the file here..."
              : "Drag & drop your resume here, or click to select a .docx file"}
          </p>
        </div>

        {uploadedFile && (
          <div className="mt-4 bg-white p-4 rounded-xl shadow-lg w-full max-w-md">
            <div className="flex items-center gap-2 text-gray-700">
              <FaFileWord className="text-blue-500 text-xl" />
              <span className="text-sm font-medium">{uploadedFile.name}</span>
            </div>
            <button
              onClick={uploadFile}
              className="mt-4 w-full bg-yellow-400 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload File"}
            </button>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
}
