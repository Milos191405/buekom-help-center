import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function UpdateFiles({ isLoggedIn, username }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileExistingMessage, setFileExistingMessage] = useState(null);
  const [tagFilter, setTagFilter] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [deletingFile, setDeletingFile] = useState(null);
  const [selectedFileContent, setSelectedFileContent] = useState(null);

  // Create refs for file input elements
  const singleFileInputRef = useRef(null);
  const folderUploadInputRef = useRef(null);

  // Fetch uploaded files from the server
  const fetchUploadedFiles = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/upload");
      const files = response.data.files;

      const tagsSet = new Set();
      const enrichedFiles = await Promise.all(
        files.map(async (file) => {
          try {
            const contentResponse = await axios.get(
              `http://localhost:5000/api/upload/files/${file.filename}`
            );
            const content = contentResponse.data;

            const tagLine = content.match(/^tags:\s*(.*)$/m);
            if (tagLine) {
              const tags = tagLine[1].split(",").map((tag) => tag.trim());
              tags.forEach((tag) => tagsSet.add(tag));
              file.tags = tags;
            } else {
              file.tags = [];
            }

            return file;
          } catch (error) {
            console.error(
              `Error fetching content for ${file.filename}:`,
              error
            );
            file.tags = [];
            return file;
          }
        })
      );

      setUploadedFiles(enrichedFiles);
      setAllTags(Array.from(tagsSet));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
      setError("Failed to load files.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  // Handle single file upload
  const handleSingleFileChange = async (event) => {
    const selectedFile = event.target.files[0]; // Get the first file only
    setFileExistingMessage(null);

    if (selectedFile) {
      const existingFile = uploadedFiles.find(
        (file) => file.originalName === selectedFile.name
      );

      if (existingFile) {
        setFileExistingMessage(
          `The file "${existingFile.originalName}" already exists.`
        );
      } else {
        const formData = new FormData();
        formData.append("files", selectedFile);
        await handleFileUpload(formData);
      }
    }
  };

  // Handle folder upload
  const handleFolderChange = (event) => {
    const selectedFiles = Array.from(event.target.files); // Get all selected files
    setFileExistingMessage(null);

    const existingFiles = selectedFiles.filter((uploadedFile) =>
      uploadedFiles.some((file) => file.originalName === uploadedFile.name)
    );

    if (existingFiles.length > 0) {
      setFileExistingMessage(
        `The following files already exist: ${existingFiles
          .map((file) => file.name)
          .join(", ")}`
      );
    }

    // Only upload files that do not already exist
    const filesToUpload = selectedFiles.filter(
      (uploadedFile) =>
        !uploadedFiles.some((file) => file.originalName === uploadedFile.name)
    );

    if (filesToUpload.length > 0) {
      const formData = new FormData();
      filesToUpload.forEach((uploadedFile) => {
        formData.append("files", uploadedFile);
      });

      handleFileUpload(formData);
    }
  };

  // Upload files to the server
  const handleFileUpload = async (formData) => {
    try {
      await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchUploadedFiles();
      setFileExistingMessage(null);

      // Reset input fields after upload
      singleFileInputRef.current.value = null; // Reset single file input
      folderUploadInputRef.current.value = null; // Reset folder input
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload file.");
    }
  };

  // Fetch file content when clicked
  const handleFileClick = async (fileName) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/upload/files/${fileName}`
      );
      const content = response.data;
      setSelectedFileContent(content);
    } catch (error) {
      console.error("Error fetching the file:", error);
      setError("Failed to load file content.");
    }
  };

  // Delete a file
  const handleFileDelete = async (fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    setDeletingFile(fileName);
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/upload/${fileName}`
      );

      if (response.status === 200) {
        setUploadedFiles((prevFiles) =>
          prevFiles.filter((file) => file.filename !== fileName)
        );
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setError("Failed to delete file.");
    } finally {
      setDeletingFile(null);
    }
  };

  // Filter files based on tags
  const filteredFiles = tagFilter
    ? uploadedFiles.filter((file) => file.tags && file.tags.includes(tagFilter))
    : uploadedFiles;

  return (
    <article className="mt-[200px] bg-gray-200 p-4">
      <div>
        <h2>Upload a Single File</h2>
        <input
          type="file"
          id="file-upload"
          ref={singleFileInputRef} // Attach ref here
          onChange={handleSingleFileChange}
          className="flex flex-col mb-4 border"
        />
        {fileExistingMessage && (
          <div className="text-red-500 mb-4">{fileExistingMessage}</div>
        )}
      </div>

      <div>
        <h2>Upload a Folder</h2>
        <input
          type="file"
          id="folder-upload"
          ref={folderUploadInputRef} // Attach ref here
          onChange={handleFolderChange}
          className="flex flex-col mb-4 border"
          webkitdirectory=""
          multiple
        />
        {fileExistingMessage && (
          <div className="text-red-500 mb-4">{fileExistingMessage}</div>
        )}
      </div>

      <div className="filter-container flex items-center gap-4 mb-4">
        <label htmlFor="tagFilter" className="font-semibold">
          Filter by tag:
        </label>
        <select
          id="tagFilter"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="border border-gray-300 p-2"
        >
          <option value="">All</option>
          {allTags.map((tag, index) => (
            <option key={index} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading files...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="space-y-2">
          {filteredFiles.map((file) => (
            <li key={file.filename}>
              <button
                className="text-blue-500 hover:underline"
                onClick={() => handleFileClick(file.filename)}
              >
                {file.originalName}
              </button>
              <button
                className="ml-4 text-red-500 hover:underline"
                onClick={() => handleFileDelete(file.filename)}
                disabled={deletingFile === file.filename}
              >
                {deletingFile === file.filename ? "Deleting..." : "Delete"}
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedFileContent && (
        <div className="mt-8 bg-white p-4 rounded-md shadow-md">
          <h3 className="text-xl font-semibold mb-2">File Content</h3>
          <ReactMarkdown children={selectedFileContent} className="prose" />
        </div>
      )}
    </article>
  );
}

UpdateFiles.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string,
};

export default UpdateFiles;
