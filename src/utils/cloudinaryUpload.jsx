import { BASE_URL } from "./constant";

// utils/cloudinaryUpload.js
export const uploadToCloudinary = async (file) => {
  try {
    // 1. Get signature from backend
    const signatureResponse = await fetch(`${BASE_URL}/cloudinary/signature`, {
      credentials: "include",
    });

    if (!signatureResponse.ok) {
      const errorText = await signatureResponse.text();
      console.error("Signature error response:", errorText);

      if (signatureResponse.status === 401) {
        throw new Error("Please login to upload images");
      }
      if (signatureResponse.status === 429) {
        throw new Error("Too many upload attempts. Please wait a few minutes.");
      }
      throw new Error(
        `Failed to get upload signature: ${signatureResponse.status} ${errorText}`
      );
    }

    const signatureData = await signatureResponse.json();

    // 2. Prepare form data with signature
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signatureData.apiKey);
    formData.append("timestamp", signatureData.timestamp);
    formData.append("signature", signatureData.signature);

    // Add folder if provided
    if (signatureData.folder) {
      formData.append("folder", signatureData.folder);
    }

    // 3. Upload to Cloudinary
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      console.error("Cloudinary upload error:", errorData);
      throw new Error(errorData.error?.message || "Upload failed");
    }

    const data = await uploadResponse.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error(error.message || "Failed to upload image");
  }
};
