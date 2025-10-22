import { useState } from "react";
import { X, FileText, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { http } from "../../services/http";

export function AttachFileComponent({ onAttach, onClose }) {
  const [link, setLink] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  // ✅ Choose file
  const handleChooseFile = () => document.getElementById("fileInput").click();

  // ✅ When user selects a file
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setLink("");
      // 🔍 Create preview if image
      if (selectedFile.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        setPreview(null);
      }
    }
  };

  // ✅ Upload or attach link
const handleInsert = async () => {
  try {
    if (!file && !link.trim()) {
      alert("Please select a file or paste a link first.");
      return;
    }

    setUploading(true);

    // Case 1: link
    if (link.trim() && !file) {
      const attached = { name: link.trim(), url: link.trim(), type: "link" };
      onAttach(attached);
      alert("✅ Link attached successfully!");
      onClose();
      return;
    }

    // Case 2: file upload
    const formData = new FormData();
    formData.append("file", file);
    console.log("📤 Uploading file:", file.name);

    const res = await http.post("/files", formData);

    console.log("✅ File uploaded:", res);

    // ✅ Normalize response
    const uploadedFile = res?.data || res || {};
    const uploadedUrl =
      uploadedFile.url ||
      uploadedFile.uri ||
      uploadedFile.fileUrl ||
      uploadedFile.downloadUrl ||
      null;

    if (uploadedUrl) {
      const attached = {
        name: uploadedFile.name || file.name,
        url: uploadedUrl,
        type: file.type.startsWith("image/") ? "image" : "file",
      };
      onAttach(attached);
      alert("✅ File uploaded successfully!");
      console.log("📎 Attached:", attached);
    } else {
      console.warn("⚠️ Uploaded but no URL field found:", uploadedFile);
      alert("⚠️ Uploaded but no file URL found in the response.");
    }

    setFile(null);
    setLink("");
    setPreview(null);
    onClose();
  } catch (err) {
    console.error("❌ File upload failed:", err);
    alert(`Upload failed: ${err.message || "Unknown error"}`);
  } finally {
    setUploading(false);
  }
};


  return (
    <div className="w-full max-w-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg p-6 shadow-lg space-y-4 relative transition-all duration-200">
      {/* ❌ Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-3 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      <h3 className="text-xl font-semibold text-center mb-4">Attach</h3>

      {/* 📁 File Upload */}
      <div className="space-y-2">
        <label className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
          Attach file from your computer
        </label>
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={handleChooseFile}
          disabled={uploading}
          className="border border-gray-300 dark:border-gray-700 w-full py-2 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-semibold"
        >
          {file ? `Selected: ${file.name}` : "Choose a file"}
        </button>
      </div>

      {/* 🔍 Image Preview */}
      {preview && (
        <div className="mt-2 flex justify-center">
          <img
            src={preview}
            alt="Preview"
            className="max-h-40 rounded-lg border border-gray-200"
          />
        </div>
      )}

      {/* 🔗 Link Input */}
      <div className="space-y-2">
        <label className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
          Paste a link
        </label>
        <input
          type="text"
          placeholder="Paste a link here"
          value={link}
          onChange={(e) => {
            setLink(e.target.value);
            setFile(null);
            setPreview(null);
          }}
          className="w-full border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 🚀 Action Button */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={handleInsert}
          disabled={uploading || (!file && !link.trim())}
          className={`px-4 py-2 rounded-md transition font-medium ${
            uploading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary/90"
          }`}
        >
          {uploading ? "Uploading..." : "Insert"}
        </button>
      </div>
    </div>
  );
}
