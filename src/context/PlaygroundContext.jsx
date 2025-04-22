import { createContext, useState, useEffect } from "react";
export const PlaygroundContext = createContext();

const PlaygroundProvider = ({ children }) => {
  const [folders, setFolders] = useState({}); // Keep this as an array to store folder structure
  const [userDetails, setuserDetails] = useState([]);

  //for params
  const [upsucces, setupsucces] = useState(false);

  const fetchFiles = async () => {
    const token = localStorage.getItem("token"); // Retrieve token safely

    if (!token) {
      console.error("Missing authentication token");
      setFolders([]); // Reset to empty if token is missing
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/crud/files", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch files: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setFolders(data); // Store folders in state correctly
    } catch (error) {
      console.error("Error fetching files:", error.message);
      setFolders({}); // Reset to empty on error
    }
  };







  //fetch user details
  const fetchUserDetails = async () => {
    const token = localStorage.getItem("token"); // Retrieve token from local storage

    if (!token) {
      console.error("Authentication token missing");
      return null; // Handle missing token gracefully
    }

    try {
      const response = await fetch("http://localhost:5000/auth/user/details", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token in headers
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch user details: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setuserDetails(data.user);
    } catch (error) {
      console.error("Error fetching user details:", error.message);
      return null; // Handle errors gracefully
    }
  };







  // Using an empty dependency array for component mount to prevent re-fetching
  useEffect(() => {
    fetchUserDetails();
    fetchFiles();
  }, []); // Fetch only once on mount







  //add  folder

  const addFolder = async (folderName) => {
    const token = localStorage.getItem("token"); // Retrieve the token from local storage
    const response = await fetch("http://localhost:5000/crud/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
      body: JSON.stringify({ folderName }),
    });

    if (response.ok) {
      alert("Folder saved successfully");
      fetchFiles();
    } else {
      const errorMessage = await response.text(); // Retrieve and display error message
      alert(`Failed to save folder: ${response.status} ${errorMessage}`);
    }
  };







  //add files

  const addfile = async (folderName, fileName, cardLanguage) => {
    const token = localStorage.getItem("token"); // Retrieve the token from local storage
    const response = await fetch(`http://localhost:5000/crud/filesave/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
      body: JSON.stringify({ folderName, fileName, cardLanguage }),
    });

    if (response.ok) {
      alert("File saved successfully");
      setupsucces(true);
      fetchFiles();
    } else {
      const errorMessage = await response.text(); // Retrieve and display error message
      alert(`Failed to save file: ${response.status} ${errorMessage}`);
    }
  };







  // add nested folder
  const nestAddFolder = async (folderpath, folderTitle) => {
    const token = localStorage.getItem("token"); // Retrieve the token from local storage
    const response = await fetch(
      `http://localhost:5000/crud/foldersave/${folderTitle}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify({ folderpath }),
      }
    );

    if (response.ok) {
      alert("Folder saved successfully");
      setupsucces(true);
      fetchFiles();
    } else {
      const errorMessage = await response.text(); // Retrieve and display error message
      alert(`Failed to save folder: ${response.status} ${errorMessage}`);
    }
  };







  //delete folder

  const deleteFolder = async (folderPath) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/crud/folder/${encodeURIComponent(folderPath)}`, // ✅ Send full nested folder path
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete folder: ${response.status}`);
      }

      alert(`Folder "${folderPath}" deleted successfully`);
      fetchFiles(); // Refresh files after deletion
    } catch (error) {
      console.error("Error deleting folder:", error);
      alert(`Error deleting folder: ${error.message}`);
    }
  };






  //delete file
  const deleteFile = async (folderName, filename) => {
    const token = localStorage.getItem("token");
    // console.log(filename)
    try {
      const response = await fetch(
        `http://localhost:5000/crud/files/${encodeURIComponent(
          folderName
        )}/${filename}`,
        {
          method: "DELETE",
          headers: {
            // Authorization: `Bearer ${localStorage.getItem('userToken')}`,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      alert("File deleted successfully");
      fetchFiles(); // Refresh files after deletion
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file");
    }
  };

  //update file name
  const updateFilename = async (folderName, filename, content, filexten) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5000/crud/files/${encodeURIComponent(
          folderName
        )}/${filename}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content, filexten }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update file");
      }

      alert("File update");
      setupsucces(true);
      fetchFiles(); // Refresh the file list if needed
    } catch (error) {
      console.error("Error updating file:", error);
      alert("Error updating file");
    }
  };

  //update file data

  const updateFileData = async (folderName, filename, content) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5000/crud/fil/${encodeURIComponent(
          folderName
        )}/${filename}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update file");
      }

      alert("File update");

      await fetchFiles(); // Refresh the file list if needed
    } catch (error) {
      console.error("Error updating file:", error);
      alert("Error updating file");
    }
  };

  //update folder name
  const updateFolder = async (folderName, newFolderName) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5000/crud/foledit/${encodeURIComponent(folderName)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newFolderName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update file");
      }

      alert("File updated successfully");
      fetchFiles(); // Refresh the file list if needed
    } catch (error) {
      console.error("Error updating file:", error);
      alert("Error updating file");
    }
  };

  const PlayGroundFeatures = {
    folders,
    fetchFiles,
    deleteFile,
    deleteFolder,
    updateFilename,
    updateFolder,
    addFolder,
    nestAddFolder,
    upsucces,
    addfile,
    updateFileData,
    userDetails,
    setuserDetails,
  };

  return (
    <PlaygroundContext.Provider value={PlayGroundFeatures}>
      {children}
    </PlaygroundContext.Provider>
  );
};

export default PlaygroundProvider;
