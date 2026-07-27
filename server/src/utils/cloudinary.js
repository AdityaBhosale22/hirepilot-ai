/**
 * Utility helper for Cloudinary storage operations.
 * Wraps file upload and deletion API calls.
 */

export const uploadToCloudinary = async (fileBuffer, folder = "hirepilot/resumes") => {
  // Cloudinary SDK upload implementation stub
  // Returns uploaded asset metadata
  return {
    fileUrl: `https://res.cloudinary.com/hirepilot/raw/upload/v123456789/resumes/sample_${Date.now()}.pdf`,
    publicId: `hirepilot/resumes/sample_${Date.now()}`,
  };
};

export const deleteFromCloudinary = async (publicId) => {
  // Cloudinary SDK deletion implementation stub
  return { result: "ok" };
};
