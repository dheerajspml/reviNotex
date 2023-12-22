import React, { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import CreateFolderForm from "~/components/createFolderForm";
import FolderList from "~/components/FolderList";

export default function MyNotePage() {
  const { folders, currentFolder } = useLoaderData();
  const [subFolders, setSubFolders] = useState([]);
  const [showCreateFolderForm, setShowCreateFolderForm] = useState(false);
  const handleCreateFolder = (folderName) => {
    console.log(`Creating folder: ${folderName}`);
  };
  const handleFolderClick = (folderId) => {
    console.log(`Loading subfolders for folder with id: ${folderId}`);
  };
  const handleCreateFolderClick = () => {
    setShowCreateFolderForm(true);
  };
  return (
    <main>
      <header>
        <h1>{currentFolder ? `Notes in ${currentFolder}` : "All Notes"}</h1>
        {showCreateFolderForm ? (
          <CreateFolderForm onSubmit={handleCreateFolder} />
        ) : (
          <>
            <button onClick={handleCreateFolderClick}>Create New Folder</button>
            {folders && folders.length > 0 ? (
              <FolderList folders={folders} onFolderClick={handleFolderClick} />
            ) : (
              <p>No folders found.</p>
            )}
          </>
        )}
      </header>
      {/* Render your note list and other components here */}
    </main>
  );
}
export async function loader() {
  const folders = await getFolders();

  return { folders, currentFolder: null };
}

async function getFolders() {
  // Implement logic to retrieve folders from your data source
  // Example: const allFolders = await getAllFolders(); return allFolders;
}
