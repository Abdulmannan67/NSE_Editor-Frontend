// RightComponent.jsx
import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { IoTrashOutline } from "react-icons/io5";
import { BiEditAlt } from "react-icons/bi";
import { FcOpenedFolder } from "react-icons/fc";
import { ModalContext } from "../../context/ModalContext";
import { PlaygroundContext } from "../../context/PlaygroundContext";
import { useNavigate } from "react-router-dom";

// Styled components
const StyledRightComponent = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 60%;
  padding: 2rem;

  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    padding: 1rem 0.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #989898;
  margin-bottom: 1rem;
`;

const Heading = styled.h3`
  font-size: ${(props) => (props.size === "small" ? "1.25rem" : "1.75rem")};
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  span {
    font-weight: 700;
  }
`;

const AddButton = styled.div`
  font-size: 1rem;
  border-radius: 30px;
  color: black;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  span {
    font-size: 1.5rem;
    font-weight: 700;
  }

  &:hover {
    cursor: pointer;
  }
`;

const FolderCard = styled.div`
  margin-bottom: 1rem;
`;

const FolderIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  cursor: pointer;
`;

const PlayGroundCards = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 428px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  box-shadow: 0 0 4px 0px #989898;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    scale: 1.05;
    box-shadow: 0 0 8px 0px #989898;
  }
`;

const CardContainer = styled.div`
  display: flex;
  align-items: center;
`;

const CardContent = styled.div``;

const RightComponent = () => {
  const navigate = useNavigate();
  const { openModal } = useContext(ModalContext);
  const {deleteFolder, folders, fetchFiles, deleteFile, updateFileContent } =
    useContext(PlaygroundContext);

  useEffect(() => {
    // This will not cause an infinite loop because fetchFiles does not modify state relating to useEffect itself.
    // console.log("Fetching files...");
    fetchFiles();
  }, []); // Only runs once when component mounts

  const updateFile = async (folder, file, content) => {
    try {
      const response = await fetch(`http://localhost:5000/auth/files/${file}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to update file");
      }

      alert("File updated successfully");
      fetchFiles(); // Refresh files
    } catch (error) {
      console.error("Error updating file:", error);
      alert("Error updating file");
    }
  };

  return (
    <StyledRightComponent>
      <Header>
        <Heading size="large">
          My <span>File Explorer</span>
        </Heading>
        {/* <AddButton
          onClick={() =>
            openModal({
              show: true,
              modalType: 1,
              identifiers: { folderId: "", cardId: "" },
            })
          }
        >
          <span>+</span> New Folder
        </AddButton> */}
      </Header>

      {Array.isArray(folders) &&
        folders.map((folderData) => (


          <FolderCard key={folderData.folder}>
            <Header>
              <Heading size="small">
                <FcOpenedFolder /> {folderData.folder}
              </Heading>
              <FolderIcons>
                <IoTrashOutline
                  onClick={() =>
                    
                      deleteFolder(folderData.folder)
                  }
                />
                <BiEditAlt
                  onClick={() =>
                   
                    openModal({
                      show: true,
                      modalType: 4,
                      identifiers: {
                        folderName: folderData.folder,
                        cardId: folderData.folder,
                    
                      },
                    })
                  }
                />
                <AddButton
                  onClick={() =>
                    openModal({
                      show: true,
                      modalType: 2,
                      identifiers: { folderId: folderData.folder, cardId: "" },
                    })
                  }
                >
                  <span>+</span>
                </AddButton>
              </FolderIcons>
            </Header>




            <PlayGroundCards>
              {Array.isArray(folderData.files) &&
                folderData.files.map((fileEntry) => (
                  <Card
                    key={fileEntry.file}
                    onClick={() =>
                      navigate(
                        `/playground/${folderData.folder}/${fileEntry.file}`
                      )
                    }
                  >
                    <CardContainer>
                      <CardContent>
                        <p>{fileEntry.file}</p>
                      </CardContent>
                    </CardContainer>
                    <FolderIcons onClick={(e) => e.stopPropagation()}>
                      <IoTrashOutline
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering parent click events
                          deleteFile(folderData.folder, fileEntry.file); // Call the delete function
                        }}
                      />

                      <BiEditAlt
                        onClick={() =>
                          openModal({
                            show: true,
                            modalType: 5,
                            identifiers: {
                              folderId: folderData.folder,
                              cardId: fileEntry.file,
                            },
                          })
                        }
                      />
                    </FolderIcons>
                  </Card>
                ))}
            </PlayGroundCards>
          </FolderCard>
        ))}
    </StyledRightComponent>
  );
};

export default RightComponent;
