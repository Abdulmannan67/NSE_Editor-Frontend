import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiFolder, FiFile, FiEdit, FiTrash2, FiFolderPlus, FiFilePlus } from 'react-icons/fi';
import { ModalContext } from '../../context/ModalContext';

const SidebarWrapper = styled.div`
  padding: 10px;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px;
  margin-bottom: 10px;
`;

const ToolbarButton = styled.button`
  background: none;
  border: none;
  color: #d4d4d4;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    color: #fff;
  }
`;

const Folder = styled.div`
  margin-bottom: 10px;
`;

const FolderTitle = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  cursor: pointer;
  &:hover {
    background: #2a2d2e;
  }
`;

const File = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  cursor: pointer;
  &:hover {
    background: #2a2d2e;
  }
`;

const Icon = styled.span`
  margin-right: 8px;
`;

const Actions = styled.span`
  margin-left: auto;
  display: flex;
  gap: 8px;
`;

const ActionIcon = styled.span`
  cursor: pointer;
  &:hover {
    color: #fff;
  }
`;

const Sidebar = ({ folders }) => {
  const navigate = useNavigate();
  const { openModal } = useContext(ModalContext);

  const handleFileClick = (folderId, fileId) => {
    navigate(`/playground/${folderId}/${fileId}`);
  };

  const handleEditFolder = (folderId) => {
    openModal({
      show: true,
      modalType: 2, // Assuming modalType 2 is for editing folder
      identifiers: { folderId }
    });
  };

  const handleDeleteFolder = (folderId) => {
    openModal({
      show: true,
      modalType: 3, // Assuming modalType 3 is for deleting folder
      identifiers: { folderId }
    });
  };

  const handleEditFile = (folderId, fileId) => {
    openModal({
      show: true,
      modalType: 4, // Assuming modalType 4 is for editing file
      identifiers: { folderId, cardId: fileId }
    });
  };

  const handleDeleteFile = (folderId, fileId) => {
    openModal({
      show: true,
      modalType: 5, // Assuming modalType 5 is for deleting file
      identifiers: { folderId, cardId: fileId }
    });
  };

  const handleCreateFolder = () => {
    openModal({
      show: true,
      modalType: 1, // Assuming modalType 1 is for creating folder
      identifiers: {}
    });
  };

  const handleCreateFile = () => {
    openModal({
      show: true,
      modalType: 0, // Assuming modalType 0 is for creating file
      identifiers: {}
    });
  };

  return (
    <SidebarWrapper>
      <Toolbar>
        <h3 style={{ margin: 0, color: '#d4d4d4' }}>Explorer</h3>
        <div>
          <ToolbarButton onClick={handleCreateFile} title="New File">
            <FiFilePlus />
          </ToolbarButton>
          <ToolbarButton onClick={handleCreateFolder} title="New Folder">
            <FiFolderPlus />
          </ToolbarButton>
        </div>
      </Toolbar>
      {folders && folders.length > 0 ? (
        folders.map(folder => (
          <Folder key={folder.folder}>
            <FolderTitle>
              <Icon><FiFolder /></Icon>
              {folder.folder}
              <Actions>
                <ActionIcon onClick={() => handleEditFolder(folder.folder)}>
                  <FiEdit />
                </ActionIcon>
                <ActionIcon onClick={() => handleDeleteFolder(folder.folder)}>
                  <FiTrash2 />
                </ActionIcon>
              </Actions>
            </FolderTitle>
            {folder.files && folder.files.map(file => (
              <File
                key={file.file}
                onClick={() => handleFileClick(folder.folder, file.file)}
              >
                <Icon><FiFile /></Icon>
                {file.file}
                <Actions>
                  <ActionIcon onClick={(e) => { e.stopPropagation(); handleEditFile(folder.folder, file.file); }}>
                    <FiEdit />
                  </ActionIcon>
                  <ActionIcon onClick={(e) => { e.stopPropagation(); handleDeleteFile(folder.folder, file.file); }}>
                    <FiTrash2 />
                  </ActionIcon>
                </Actions>
              </File>
            ))}
          </Folder>
        ))
      ) : (
        <div style={{ padding: '10px', color: '#858585' }}>No folders</div>
      )}
    </SidebarWrapper>
  );
};

export default Sidebar;