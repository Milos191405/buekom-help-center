import  { useState} from "react";
import { format } from "date-fns";

function FolderView({
  tagDir,
  handleFileClick,
  handleFileDelete,
  deletingFile,
  toggleFolder,
  expandedFolders,
  activeMenu,
}) {



 
  return (
    <div className="md:grid md:grid-cols-3 ">
      {Object.entries(tagDir)
      .sort(([tagA], [tagB]) => tagA.localeCompare(tagB))
        .map(([tag, files]) => (
        <div key={tag} className="folder-container mb-4 border pt-2 ">
          <h3
            className="font-bold text-lg cursor-pointer"
            onClick={() => toggleFolder(tag)}
          >
            {tag} {expandedFolders[tag] ? "▼" : "►"}
          </h3>

          {expandedFolders[tag] && (
            <div className="">
              <ul className="mt-2  gap-3 justify-center  mx-auto ">
                {files
                  .sort((a, b) => a.originalName.localeCompare(b.originalName))
                  .map((file) => (
                  <li key={file.filename} className="mb-2 justify-center ">
                    <span
                      className="text-blue-500 cursor-pointer hover:underline"
                      onClick={() => handleFileClick(file.filename)}
                    >
                      {file.originalName}
                    </span>
                    {activeMenu === "update-files" && (
                      <button
                        className="ml-4 text-red-500 hover:underline"
                        onClick={() => handleFileDelete(file.filename)}
                        disabled={deletingFile === file.filename}
                      >
                        {deletingFile === file.filename
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    )}
                    <p>
                      Last Update:{" "}
                      {format(new Date(file.updatedAt), ` MMMM dd yyyy`)}
                    </p>
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
