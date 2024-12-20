import { API_BASE_URL } from "../config.js";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import FolderView from "../components/states/FolderView";
import { toast } from "react-toastify";

function UpdateFiles({ isLoggedIn, activeMenu }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fileExistingMessage, setFileExistingMessage] = useState(null);
  const [tagFilter, setTagFilter] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [deletingFile, setDeletingFile] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({});

  const singleFileInputRef = useRef(null);
  const folderUploadInputRef = useRef(null);

  // Fetch uploaded files
  const fetchUploadedFiles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/upload`);
      const files = response.data.tagDir || {};

      const allFiles = Object.keys(files).flatMap((tag) =>
        files[tag].map((file) => ({
          originalName: file.originalName,
          filename: file.filename,
          update: file.updatedAt,
          tags: file.tags || [],
          firstTag:
            file.tags && file.tags.length > 0 ? file.tags[0] : "Untagged",
        }))
      );

      setUploadedFiles(allFiles); // Set the list of file objects

      const uniqueFirstTags = [
        ...new Set(allFiles.map((file) => file.firstTag).filter(Boolean)),
      ];

      setAllTags(uniqueFirstTags); // Set tags for filtering
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch files on mount
  useEffect(() => {
    if (isLoggedIn) {
      fetchUploadedFiles();
    }
  }, [isLoggedIn]);

  // Handle file click to view content
  const handleFileClick = async (fileName) => {
    const file = uploadedFiles.find((f) => f.filename === fileName);
    if (file) {
      try {
        const contentResponse = await axios.get(
          `${API_BASE_URL}/api/upload/files/${fileName}`
        );
        const content = contentResponse.data;
        // Do something with the file content
      } catch (error) {
        console.error("Error fetching file content:", error);
      }
    }
  };

  // Handle file deletion
  const handleFileDelete = async (fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    setDeletingFile(fileName); // Indicate deletion is in progress

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/upload/${fileName}`
      );

      if (response.status === 200) {
        fetchUploadedFiles(); // Refresh the list of uploaded files
        toast.success(`"${fileName}" has been successfully deleted!`);
      } else {
        toast.error(`Unexpected response from server: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting file:", error);

      if (error.response) {
        if (error.response.status === 404) {
          toast.error(
            `The file "${fileName}" was not found or has already been deleted.`
          );
        } else {
          toast.error(
            `Failed to delete "${fileName}". Please try again later.`
          );
        }
      } else {
        toast.error(
          "Failed to delete the file. Please check your connection and try again."
        );
      }
    } finally {
      setDeletingFile(null); // Reset deleting state
    }
  };

  // Handle file upload
  const handleFileUpload = async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchUploadedFiles(); // Refresh after upload
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Error uploading files. Please try again.");
    }
  };

  // Apply tag filtering
  const filteredFiles = tagFilter
    ? uploadedFiles.filter((file) => file.firstTag === tagFilter)
    : uploadedFiles;

  // Toggle folder visibility
  const toggleFolder = (tag) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [tag]: !prev[tag],
    }));
  };

  return (
    <article className="mt-[260px] min-h-[calc(100vh-260px)] bg-gray-200 p-4">
      <div className="lg:max-w-[1000px] xl:max-w-[1400px] lg:mx-auto lg:pt-4">
        <h1 className="text-center font-bold text-xl mb-5">Uploaded Files</h1>

        {/* File Upload Section */}
        <div className="justify-center items-center lg:grid lg:grid-cols-3">
          <div className="md:flex md:space-x-4 lg:col-span-2">
            <div className="md:w-1/2 lg:w-full">
              <h2 className="font-bold">Upload a Single File</h2>
              <input
                type="file"
                ref={singleFileInputRef}
                onChange={(e) => handleFileUpload([e.target.files[0]])}
                className="mb-4 border w-full"
              />
            </div>
            <div className="md:w-1/2 lg:w-full">
              <h2 className="font-bold">Upload a Folder</h2>
              <input
                type="file"
                ref={folderUploadInputRef}
                onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                className="mb-4 border w-full"
                webkitdirectory=""
                multiple
              />
            </div>
          </div>
        </div>

        {/* Tag Filter Section */}
        <div className="filter-container flex flex-col md:w-1/2 lg:w-full mx-auto items-left">
          <label htmlFor="tagFilter" className="font-semibold">
            Filter by tag:
          </label>
          <select
            id="tagFilter"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="border border-gray-300 p-3 w-full md:w-3/4"
          >
            <option value="">All</option>
            {allTags.map((tag, index) => (
              <option key={`${tag}-${index}`} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Loading Indicator */}
        {loading && <div>Loading...</div>}

        {/* Folder View (Files grouped by tag) */}
        <FolderView
          files={filteredFiles} // Pass filtered files to FolderView
          handleFileClick={handleFileClick}
          handleFileDelete={handleFileDelete}
          deletingFile={deletingFile}
          activeMenu={activeMenu}
          expandedFolders={expandedFolders} // Pass expandedFolders state to control folder visibility
          toggleFolder={toggleFolder} // Pass the toggle function
        />
      </div>
    </article>
  );
}

export default UpdateFiles;
