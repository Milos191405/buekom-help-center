import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import FolderView from "../components/states/FolderView";

function UpdateFiles({ isLoggedIn, username, activeMenu}) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileExistingMessage, setFileExistingMessage] = useState(null);
  const [tagFilter, setTagFilter] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [deletingFile, setDeletingFile] = useState(null);
  const [selectedFileContent, setSelectedFileContent] = useState(null);
  const[expandedFolders, setExpandedFolders] = useState({});


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
            const tagLine = content.match(/^tags:\s*(.*)$/m); // Extract tags from content
            if (tagLine) {
              const tags = tagLine[1]
                .split(",")
                .map((tag) => tag.trim().replace(/^[-\s]+/, "")); // Clean up the tags
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
   // Confirm file deletion
   if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
     return; // If the user cancels, return early
   }

   setDeletingFile(fileName); // Set the state indicating the file is being deleted
   try {
     // Send DELETE request to the server to delete the file
     const response = await axios.delete(
       `http://localhost:5000/api/upload/${fileName}`
     );

     // If the response is successful (status 200), remove the file from the state
     if (response.status === 200) {
       setUploadedFiles(
         (prevFiles) => prevFiles.filter((file) => file.filename !== fileName) // Remove deleted file from the list
       );
     }
   } catch (error) {
     // Handle any errors that occur during the delete request
     console.error("Error deleting file:", error);
     setError("Failed to delete file.");
   } finally {
     setDeletingFile(null); // Reset the deleting state, regardless of success or failure
   }
 };


  // Filter files based on tags
  const filteredFiles = tagFilter
    ? uploadedFiles.filter((file) => file.tags && file.tags.includes(tagFilter))
    : uploadedFiles;

  //making dir basic on tags

  const tagDir = {};
  filteredFiles.forEach((file) => {
    file.tags.forEach((tag) => {
      if (!tagDir[tag]) {
        tagDir[tag] = [];
      }
      tagDir[tag].push(file);
    });
  });

  const toggleFolder = (tag) => {
    setExpandedFolders((prevState) => ({
      ...prevState,
      [tag]: !prevState[tag],
    }));
  };


  return (
    <article className="mt-[260px] min-h-[calc(100vh-260px)] bg-gray-200 p-4 ">
      <div className="lg:max-w-[1000px] xl:max-w-[1400px] lg:mx-auto lg:pt-4">
        <h1 className="text-center font-bold text-xl mb-5">Upload Files</h1>

        <div className="justify-center items-center lg:grid lg:grid-cols-3">
          <div className="md:flex md:space-x-4 lg:col-span-2">
            <div className="md:w-1/2 lg:w-full">
              <h2 className="font-bold">Upload a Single File</h2>
              <input
                type="file"
                id="file-upload"
                ref={singleFileInputRef}
                onChange={handleSingleFileChange}
                className="mb-4 border w-full"
              />
              {fileExistingMessage && (
                <div className="text-red-500 mb-4">{fileExistingMessage}</div>
              )}
            </div>

            <div className="md:w-1/2 lg:w-full">
              <h2 className="font-bold">Upload a Folder</h2>
              <input
                type="file"
                id="folder-upload"
                ref={folderUploadInputRef}
                onChange={handleFolderChange}
                className="mb-4 border w-full"
                webkitdirectory=""
                multiple
              />
              {fileExistingMessage && (
                <div className="text-red-500 mb-4">{fileExistingMessage}</div>
              )}
            </div>
          </div>

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
                <option key={index} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h2 className="text-center font-bold text-xl mt-8">Uploaded Files</h2>

        {/* Folder view */}
        <FolderView
          tagDir={tagDir}
          handleFileClick={handleFileClick}
          handleFileDelete={handleFileDelete}
          deletingFile={deletingFile}
          toggleFolder={toggleFolder}
          expandedFolders={expandedFolders}
          activeMenu={activeMenu}
        />

        {/* on click open file  */}
        {selectedFileContent && (
          <div className="mt-8 bg-white p-4 rounded-md shadow-md">
            <h3 className="text-xl font-semibold mb-2">File Content</h3>
            <ReactMarkdown children={selectedFileContent} className="prose" />
          </div>
        )}
      </div>
    </article>
  );
}

UpdateFiles.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string,
};

export default UpdateFiles;
