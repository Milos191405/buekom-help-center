import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function UpdateFiles({ isLoggedIn, username }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [selectedFileContent, setSelectedFileContent] = useState(null);
  const [fileExistingMessage, setFileExistingMessage] = useState(null);

  // Fetch uploaded files
  const fetchUploadedFiles = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/upload"); // Ensure correct endpoint
      setUploadedFiles(response.data.files); // Update uploaded files with the response
      setLoading(false); // Set loading to false after fetching
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
      setError("Failed to load files.");
      setLoading(false); // Ensure loading is set to false on error
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileExistingMessage(null);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (!file) return;

    const fileExist = uploadedFiles.some(
      (uploadedFile) => uploadedFile.originalName === file.name
    );

    if (fileExist) {
      setFileExistingMessage("File already exists.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Append the file to the form data

    try {
      await axios.post("http://localhost:5000/api/upload", formData);
      fetchUploadedFiles(); // Re-fetch files after upload
      setFile(null); // Reset file input
      setFileExistingMessage(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload file.");
    }
  };

  const handleFileDelete = async (fileName) => {};

  const handleFileClick = async (fileName) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/uploads/${fileName}`
      );
      setSelectedFileContent(response.data); // Set the content of the file
    } catch (error) {
      console.error("Error fetching the file:", error);
      setError("Failed to load file content.");
    }
  };

  return (
    <>
      <article className="mt-[200px] bg-gray-200">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-center pt-[20px]">Update Files</h2>
          <form
            onSubmit={handleFileUpload}
            className="mb-6 w-3/4 mx-auto  flex flex-col"
          >
            <input
              type="file"
              onChange={handleFileChange}
              className="flex flex-col mb-4 border "
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-md w-1/3 mx-auto p-2 hover:bg-blue-600"
            >
              Upload
            </button>
            {fileExistingMessage && (
              <p className="text-red-500 text-sm mt-2">{fileExistingMessage}</p>
            )}
          </form>
        </div>

        <div className="w-full">
          {loading ? (
            <p>Loading uploaded files...</p> // Loading message
          ) : error ? (
            <p>{error}</p> // Display error message
          ) : (
            <ul>
              {uploadedFiles
                .slice()
                .sort((a, b) => a.originalName.localeCompare(b.originalName))
                .map((uploadedFile, index) => (
                  <li
                    key={index}
                    className="cursor-pointer flex items-center justify-between border p-2"
                  >
                    <span
                      onClick={() => handleFileClick(uploadedFile.filename)}
                      className="text-blue-600 hover:underline"
                    >
                      {uploadedFile.originalName}
                    </span>
                    {isLoggedIn && username === "admin" && (
                      <button
                        onClick={() => handleFileDelete(uploadedFile.filename)}
                        className="bg-red-600 text-white rounded-md px-2 hover:bg-red-700 ml-2"
                      >
                        Delete
                      </button>
                    )}
                  </li>
                ))}
            </ul>
          )}
        </div>

        <div>
          {selectedFileContent && (
            <div className="mt-6 mx-auto w-full max-w-[90%] md:max-w-[70%] lg:max-w-[60%]">
              <h3 className="text-xl font-semibold mb-2">File Content</h3>
              <div className="border p-4 bg-gray-100 overflow-x-auto">
                <ReactMarkdown
                  children={selectedFileContent}
                  className="prose"
                  components={{
                    pre: ({ node, ...props }) => (
                      <pre
                        {...props}
                        className="whitespace-pre-wrap break-words"
                      />
                    ),
                    code: ({ node, inline, ...props }) => (
                      <code
                        {...props}
                        className={`whitespace-pre-wrap break-words ${
                          inline ? "" : "block overflow-x-auto"
                        }`}
                      />
                    ),
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}

UpdateFiles.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string,
};

export default UpdateFiles;
