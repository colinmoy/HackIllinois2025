import React, { useState } from "react";
import axios from "axios";

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);

      // Automatically upload the file once it's selected
      await handleFileUpload(file);
    }
  };

  // Handle file upload to the backend
  const handleFileUpload = async (file: File) => {
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
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  return (
    <div
      className="file-upload-container"
      style={{ display: "flex", alignItems: "center" }}
    >
      {/* Image upload icon */}
      <label className="file-upload-btn">
        <img
          src="https://t4.ftcdn.net/jpg/10/14/50/31/360_F_1014503129_yhUdHKEpsSOhUUxTxglXj3FkZwzh2SZ0.jpg"
          alt="Upload Icon"
          style={{
            width: "100%", // Adjust the size of the image
            height: "45px",
            cursor: "pointer",
            marginRight: "5px", // Reduced margin for less space
          }}
        />
        <input
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }} // Hide the default file input
        />
      </label>
    </div>
  );
};

export default ImageUpload;
