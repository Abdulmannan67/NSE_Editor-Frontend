import React, { useState, useContext, useEffect } from "react";
import logo from "../../assets/logo.png";
import styled from "styled-components";
import {
  BiFolder,
  BiFile,
  BiEditAlt,
  BiTrash,
  BiMenu,
  BiX,
  BiFolderPlus,
  BiPlus,
} from "react-icons/bi";
import { ModalContext } from "../../context/ModalContext";
import { PlaygroundContext } from "../../context/PlaygroundContext";
import { useNavigate } from "react-router-dom";
import SidebarFooter from "./SidebarFooter";

const SidebarContainer = styled.div`
  position: fixed;
  border-right: 2px solid #524d4dd4;
  top: 0;
  left: 0;
  width: ${({ isOpen }) => (isOpen ? "200px" : "75px")};
  height: 100vh;
  background: #1e1e1e;
  color: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #666 transparent;
  transition: width 0.3s ease;
  z-index: 100;
  display: flex;
  flex-direction: column;
  padding: ${({ isOpen }) => (isOpen ? "0rem" : "0")};

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background: #666;
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    width: ${({ isOpen }) => (isOpen ? "200px" : "0")};
  }
`;

const ToggleButton = styled.div`
  position: fixed;
  top: 1rem;
  left: ${({ isOpen }) => (isOpen ? "145px" : "1rem")};
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 102;
  background: #333;
  padding: 0.5rem;
  border-radius: 4px;
  transition: left 0.3s ease;
`;

const SidebarContent = styled.div`
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  flex-direction: column;
  flex: 1;
`;

const ActionBar = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  justify-content: flex-start;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #ccc;
  }
`;

const FolderList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  overflow-y: auto;
`;

const FolderItem = styled.li`
  padding: 0.5rem;
  color: orange;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: space-between;
  border-bottom: 1px solid #524d4dd4;

  &:hover {
    background: #333;
  }
`;

const FileList = styled.ul`
  list-style: none;
  padding-left: 1rem;
  color: #7d7de6e3;
  margin: 0;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
`;

const FileItem = styled.li`
  margin-top: 0.7rem;
  border-bottom: 1px solid rgba(59, 46, 46, 0.83);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: space-between;

  &:hover {
    background: #333;
  }
`;

const IconButton = styled.span`
  font-size: 0.9rem;
  margin-left: 0.3rem;
  color: #ccc;
  cursor: pointer;

  &:hover {
    color: blue;
  }
`;

const EmptyMessage = styled.div`
  padding: 0.5rem;
  color: #ccc;
`;

const Logo = styled.img`
  width: 45px;
  margin-top: 2vh;
`;

const MainHeading = styled.h1`
  font-size: 1.5rem;
  margin-top: 1vh;
  font-weight: 400;
  color: #fff;
  span {
    font-weight: 700;
  }
`;

const Sidebar = ({ isSidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { folders, deleteFile, deleteFolder, userDetails, fetchFiles, error, loading } =
    useContext(PlaygroundContext);
  const { openModal } = useContext(ModalContext);
  const [openFolders, setOpenFolders] = useState({});

  useEffect(() => {
    fetchFiles();
  }, []);



  const toggleFolder = (folderId) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const truncateName = (name, maxLength = 12) => {
    return name && typeof name === "string" && name.length > maxLength
      ? name.substring(0, maxLength) + ".."
      : name || "Untitled";
  };

  const username = userDetails.USERNAME|| "Guest";

  const containerStyle = {
    height: "15vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "5vh",
    borderBottom: "2px solid transparent",
    borderImage:
      "linear-gradient(90deg, rgba(62, 58, 180, 1) 0%, rgba(253, 29, 29, 1) 50%, rgba(252, 176, 69, 1) 100%)",
    borderImageSlice: 1,
  };

  const gradientTextStyle = {
    backgroundImage:
      "linear-gradient(90deg, rgba(62, 58, 180, 1) 0%, rgba(253, 29, 29, 1) 50%, rgba(252, 176, 69, 1) 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  const renderFolder = (folder, depth = 0, path = "") => {
    if (!folder || !folder.folder) {
      return null;
    }

    const currentPath = path ? `${path}/${folder.folder}` : folder.folder;

    return (
      <div key={currentPath}>
        <FolderItem
          onClick={() => toggleFolder(folder.folder)}
          style={{ paddingLeft: `${depth * 1}rem` }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <BiFolder />
            {truncateName(folder.folder)}
          </div>
          <div>
            <IconButton
              onClick={() =>
                openModal({
                  show: true,
                  modalType: 1,
                  identifiers: { folderId: currentPath, cardId: "" },
                })
              }
              title="Add Folder"
            >
              <BiFolderPlus />
            </IconButton>
            <IconButton
              onClick={() =>
                openModal({
                  show: true,
                  modalType: 2,
                  identifiers: { folderId: currentPath, cardId: "" },
                })
              }
              title="New File"
            >
              <BiPlus />
            </IconButton>
            <IconButton
              onClick={() =>
                openModal({
                  show: true,
                  modalType: 4,
                  identifiers: { folderName: folder.folder, folderId: currentPath },
                })
              }
              title="Edit Folder"
            >
              <BiEditAlt />
            </IconButton>
            <IconButton
              onClick={() => deleteFolder(currentPath)}
              title="Delete Folder"
            >
              <BiTrash />
            </IconButton>
          </div>
        </FolderItem>
        <FileList isOpen={openFolders[folder.folder]}>
          {folder.files?.length ? (
            folder.files.map((file) => (
              <FileItem
  key={file.file}
  onClick={() => {
    const encodedPath = encodeURIComponent(currentPath);
    const encodedFile = encodeURIComponent(file.file);
    navigate(`/Editor/${encodedPath}/${encodedFile}`);
  }}
  style={{ paddingLeft: `${depth * 1}rem` }}
>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <BiFile />
                  {truncateName(file.file,7)}
                </div>
                <div>
                  <IconButton
                    onClick={() =>
                      openModal({
                        show: true,
                        modalType: 5,
                        identifiers: { folderId: currentPath, cardId: file.file },
                      })
                    }
                    title="Edit File"
                  >
                    <BiEditAlt />
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(currentPath, file.file);
                    }}
                    title="Delete File"
                  >
                    <BiTrash />
                  </IconButton>
                </div>
              </FileItem>
            ))
          ) : (
            <EmptyMessage>No files in this folder</EmptyMessage>
          )}
        </FileList>
        {folder.children?.length > 0 && openFolders[folder.folder] && (
          <FolderList>
            {folder.children.map((child) => renderFolder(child, depth + 1, currentPath))}
          </FolderList>
        )}
      </div>
    );
  };

  return (
    <>
      <ToggleButton
        isOpen={isSidebarOpen}
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <BiX /> : <BiMenu />}
      </ToggleButton>
      <SidebarContainer isOpen={isSidebarOpen}>
        <SidebarContent isOpen={isSidebarOpen}>
          <div className="logo" style={containerStyle}>
            <Logo src={logo} />
            <MainHeading>
              <span style={gradientTextStyle}>Code</span>Catalyst
            </MainHeading>
          </div>
          <h3 style={{ padding: "0.5rem", margin: "0", color: "yellow" }}>
            Explorer
          </h3>
          <ActionBar>
            <ActionButton
              onClick={() =>
                openModal({
                  show: true,
                  modalType: 1,
                  identifiers: { folderId: folders.folder || "", cardId: "" },
                })
              }
              title="New Folder"
            >
              <BiFolderPlus /> New Folder
            </ActionButton>
          </ActionBar>
          {loading ? (
            <EmptyMessage>Loading...</EmptyMessage>
          ) : error ? (
            <EmptyMessage>Error: {error}</EmptyMessage>
          ) : !folders.children || !Array.isArray(folders.children) || folders.children.length === 0 ? (
            <EmptyMessage>No folders available</EmptyMessage>
          ) : (
            <FolderList>
              {folders.children.map((child) => renderFolder(child, 0))}
            </FolderList>
          )}
          <SidebarFooter username={username} />
        </SidebarContent>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;