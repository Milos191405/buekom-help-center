import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import FolderView from "../components/states/FolderView";

function Search({ isLoggedIn, username }) {
  const [uploadedFiles, setUploadedFiles] = useState([]); // Initialize uploaded files state
  const [loading, setLoading] = useState(false); // Initialize loading state
  const [error, setError] = useState(null);
  const [tagFilter, setTagFilter] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [selectedFileContent, setSelectedFileContent] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({});

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

  // Filter files based on tags
  const filteredFiles = tagFilter
    ? uploadedFiles.filter((file) => file.tags && file.tags.includes(tagFilter))
    : uploadedFiles;

  // Making dir based on tags
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
    <article className="mt-[260px] bg-gray-200 min-h-[calc(100vh-260px)] p-2 items-center    ">
      <div className="lg:max-w-[1000px] xl:max-w-[1400px] lg:mx-auto lg:pt-4">
        <h1 className="text-center font-bold text-xl mb-5">Search Files</h1>
        <div className=" flex flex-col justify-center items-center w-3/4 md:w-1/2 lg:w-1/3 lg:pb-5 mx-auto">
          <div className="filter-container  w-3/4  ">
            <label htmlFor="tagFilter" className="font-semibold text-left ">
              Filter by tag:
            </label>
          </div>

          <select
            id="tagFilter"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="border border-gray-300 p-2 w-3/4"
          >
            <option value="">All</option>
            {allTags.map((tag, index) => (
              <option key={index} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Folder view */}
        <FolderView
          tagDir={tagDir}
          handleFileClick={handleFileClick}
          toggleFolder={toggleFolder}
          expandedFolders={expandedFolders}
        />

        {/* Display file content when clicked */}
        {selectedFileContent && (
          <div className="mt-8 bg-white p-4 rounded-md shadow-md">
            <ReactMarkdown children={selectedFileContent} className="prose" />
          </div>
        )}

        {/* Loading and error handling */}
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </article>
  );
}

Search.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string,
};

export default Search;
