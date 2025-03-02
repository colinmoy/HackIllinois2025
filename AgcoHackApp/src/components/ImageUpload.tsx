import React, { useState } from "react";
import axios from "axios";

interface ImageUploadProps {
  onUpload: (imageUrl: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);

      // Automatically upload the file once it's selected
      const imageUrl = await handleFileUpload(file);
      if (imageUrl) {
        onUpload(imageUrl);
      }
    }
  };

  // Handle file upload to the backend
  const handleFileUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://your-backend-url/upload", // Replace with your backend URL
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File uploaded successfully", response.data);
      // Assume the response contains the image URL in response.data.imageUrl
      return response.data.imageUrl || null;
    } catch (error) {
      console.error("Error uploading file", error);
      return null;
    }
  };

  return (
    <div
      className="file-upload-container"
      style={{ display: "flex", alignItems: "center" }}
    >
      <label
        className="file-upload-btn"
        style={{
          width: "40px",
          height: "40px",
          cursor: "pointer",
          backgroundColor: "#444",
          borderRadius: "50%",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.3s ease-in-out",
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="white"
        >
          {/* Using a commonly accepted upload icon (box with upward arrow) */}
          <path d="M5 20h14v-2H5v2zm7-16L5.33 11h3.84v4h4.66v-4h3.84L12 4z" />
        </svg>
      </label>
    </div>
  );
};

export default ImageUpload;
