import { format } from "date-fns"; // Import date-fns for formatting

function FolderView({
  files = [], // Files data (default to empty array)
  handleFileClick, // Function to handle file clicks
  handleFileDelete, // Function to handle file deletion
  deletingFile, // State indicating if a file is being deleted
  toggleFolder, // Function to toggle folder visibility
  expandedFolders, // State to track which folders are expanded
  activeMenu, // Current active menu for conditional UI logic
}) {
  // Group files by their firstTag (or "Other Files" if no firstTag)
  const groupedByTag = files.reduce((acc, file) => {
    const tag = file.firstTag || "Other Files"; // Default to "Other Files" if no firstTag
    if (!acc[tag]) acc[tag] = [];
    acc[tag].push(file);
    return acc;
  }, {});

  // Deduplicate files: Use both filename and firstTag to determine uniqueness
  const deduplicatedFiles = files.filter((file, index, self) => {
    return (
      index ===
      self.findIndex(
        (f) => f.filename === file.filename && f.firstTag === file.firstTag
      )
    );
  });

  return (
    <div className="md:grid md:grid-cols-3 gap-4">
      {/* Iterate through each tag group */}
      {Object.entries(groupedByTag)
        .sort(([tagA], [tagB]) => tagA.localeCompare(tagB)) // Sort tags alphabetically
        .map(([tag, files]) => {
          const isFolderExpanded = expandedFolders[tag]; // Check if the folder is expanded

          return (
            <div
              key={tag}
              className="folder-container mb-2 border p-1 rounded-md"
            >
              {/* Folder Header */}
              <h3
                className="font-bold text-lg cursor-pointer flex justify-between items-center"
                onClick={() => toggleFolder(tag)} // Toggle folder visibility
              >
                {tag} {isFolderExpanded ? "▼" : "►"}
              </h3>

              {/* Render files only if the folder is expanded */}
              {isFolderExpanded && (
                <ul className="mt-2">
                  {deduplicatedFiles
                    .filter((file) => file.firstTag === tag) // Filter files by the current tag
                    .sort((a, b) =>
                      a.originalName.localeCompare(b.originalName)
                    ) // Sort files alphabetically
                    .map((file) => {
                      // Format the `updatedAt` date properly
                      const formattedDate = file.update
                        ? format(
                            new Date(file.update),
                            "MMMM dd, yyyy"
                          )
                        : "N/A"; // Default if `update` is missing

                      return (
                        <li
                          key={
                            file.fileId ||
                            `${file.filename}-${file.originalName}-${file.update}`
                          }
                          className="mb-2"
                        >
                          <div className="flex justify-between items-center">
                            {/* File Name */}
                            <span
                              className="text-blue-500 cursor-pointer hover:underline"
                              onClick={() => handleFileClick(file.filename)}
                            >
                              {file.originalName}
                            </span>

                            {/* Delete Button (Visible only in 'update-files' menu) */}
                            {activeMenu === "update-files" && (
                              <button
                                className="text-red-500 hover:underline ml-4"
                                onClick={() => handleFileDelete(file.filename)}
                                disabled={deletingFile === file.filename} // Disable during deletion
                              >
                                {deletingFile === file.filename
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            )}
                          </div>
                          {/* File Last Update */}
                          <p className="text-sm text-gray-500">
                            Last Update: <span className="font-bold">{formattedDate}</span>
                          </p>
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>
          );
        })}
    </div>
  );
}

export default FolderView;
