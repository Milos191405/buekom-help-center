import { useState } from "react";

function FolderView({
  tagDir,
  handleFileClick,
  handleFileDelete,
  deletingFile,
  toggleFolder,
  expandedFolders,
}) {
  return (
    <div className="grid grid-cols-4">
      {Object.entries(tagDir).map(([tag, files]) => (
        <div key={tag} className="folder-container mb-4 border p-3 ">
          <h3
            className="font-bold text-lg cursor-pointer"
            onClick={() => toggleFolder(tag)}
          >
            {tag} {expandedFolders[tag] ? "▼" : "►"}
          </h3>

          {expandedFolders[tag] && (
            <div className="w-screen">
              <ul className="mt-2  gap-3 justify-center  mx-auto ">
                {files.map((file) => (
                  <li key={file.filename} className="mb-2 justify-center ">
                    <span
                      className="text-blue-500 cursor-pointer hover:underline"
                      onClick={() => handleFileClick(file.filename)}
                    >
                      {file.originalName}
                    </span>
                    <button
                      className="ml-4 text-red-500 hover:underline"
                      onClick={() => handleFileDelete(file.filename)}
                      disabled={deletingFile === file.filename}
                    >
                      {deletingFile === file.filename
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default FolderView;
