import { createContext, useState, useEffect } from "react";
import { v4 as uuid } from 'uuid';

export const PlaygroundContext = createContext();

export const languageMap = {
    "cpp": {
        id: 54,
        defaultCode:
            "#include <iostream>\n"
            + "using namespace std;\n\n"
            + "int main() {\n"
            + '\tcout << "Hello World!";\n'
            + "\treturn 0;\n"
            + "}",
    },
    "java": {
        id: 62,
        defaultCode: `public class Main {
            public static void main(String[] args) {
                System.out.println("Hello World!");
            }
    }`,
    },
    "python": {
        id: 71,
        defaultCode: `print("Hello World!")`,
    },
    "javascript": {
        id: 63,
        defaultCode: `console.log("Hello World!");`,
    }
}

const PlaygroundProvider = ({ children }) => {

    const [folders, setFolders] = useState([]); // Keep this as an array to store folder structure

    

    const fetchFiles = async () => {
        // const token = localStorage.getItem('userToken'); // Obtain token
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/auth/files', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch files');
            }

            const data = await response.json()
            // Update state with the fetched folders structure
            setFolders(data.files || []); // Store folders in state


        } catch (error) {
            console.error('Error fetching files:', error);
            setFolders([]); // Reset to empty on error
        }
    };

    // Using an empty dependency array for component mount to prevent re-fetching
    useEffect(() => {
      
        fetchFiles();
        
      }, []); // Fetch only once on mount
      








    //add files and folder

    const addPlaygroundAndFolder = async (folderName, playgroundName, cardLanguage) => {

        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        const response = await fetch('http://localhost:5000/auth/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
            },
            body: JSON.stringify({ folderName, playgroundName, cardLanguage }),
        });

        if (response.ok) {
            alert('File saved successfully');
            fetchFiles();


        } else {
            const errorMessage = await response.text(); // Retrieve and display error message
            alert(`Failed to save file: ${response.status} ${errorMessage}`);
        }
    }






    //add files 
    
    const addfile = async (folderName, fileName, cardLanguage) => {

        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        const response = await fetch(`http://localhost:5000/auth/filesave/${folderName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
            },
            body: JSON.stringify({ folderName, fileName, cardLanguage }),
        });

        if (response.ok) {
            alert('File saved successfully');
            fetchFiles();


        } else {
            const errorMessage = await response.text(); // Retrieve and display error message
            alert(`Failed to save file: ${response.status} ${errorMessage}`);
        }
    }






    //delete folder 


    const deleteFolder = async (folderName) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/auth//folder/${folderName}`, {
                method: 'DELETE',
                headers: {
                    // Authorization: `Bearer ${localStorage.getItem('userToken')}`,
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete folder');
            }

            alert('Folder deleted successfully');
            fetchFiles(); // Refresh files after deletion
        } catch (error) {
            console.error('Error deleting folder:', error);
            alert('Error deleting folder');
        }
    };










    //delete file
    const deleteFile = async (folderName, filename) => {
        const token = localStorage.getItem('token');
        // console.log(filename)
        try {
            const response = await fetch(`http://localhost:5000/auth/files/${folderName}/${filename}`, {
                method: 'DELETE',
                headers: {
                    // Authorization: `Bearer ${localStorage.getItem('userToken')}`,
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete file');
            }

            alert('File deleted successfully');
            fetchFiles(); // Refresh files after deletion
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('Error deleting file');
        }
    };






    //update file name
    const updateFileContent = async (folderName, filename, content,filexten) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/auth/files/${folderName}/${filename}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content , filexten}),
            });

            if (!response.ok) {
                throw new Error('Failed to update file');
            }

            alert('File update');
            fetchFiles(); // Refresh the file list if needed
        } catch (error) {
            console.error('Error updating file:', error);
            alert('Error updating file');
        }
    };




    //update folder name 
    const updateFolder = async (folderName,newFolderName) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/auth/foledit/${folderName}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ newFolderName}),
            });

            if (!response.ok) {
                throw new Error('Failed to update file');
            }

            alert('File updated successfully');
            fetchFiles(); // Refresh the file list if needed
        } catch (error) {
            console.error('Error updating file:', error);
            alert('Error updating file');
        }
    };





    

    const PlayGroundFeatures = {
        folders,
        fetchFiles,
        deleteFile,
        deleteFolder,
        updateFileContent,
        updateFolder,
        addPlaygroundAndFolder,
        addfile 
        
    };

    return (
        <PlaygroundContext.Provider value={PlayGroundFeatures}>
            {children}
        </PlaygroundContext.Provider>
    )
}

export default PlaygroundProvider;