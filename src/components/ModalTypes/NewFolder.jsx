import React, { useContext, useState } from 'react'
import { Header, CloseButton, Input } from '../Modal'
import { IoCloseSharp } from 'react-icons/io5'
import { ModalContext } from '../../context/ModalContext'
import { PlaygroundContext } from '../../context/PlaygroundContext'
const NewFolder = () => {
  const {isOpenModal, closeModal } = useContext(ModalContext);
  const { addFolder,nestAddFolder } = useContext(PlaygroundContext)
  const [folderTitle, setFolderTitle] = useState("");
  
  const {folderId} = isOpenModal.identifiers;

  const handleAdd=()=>{
    if (!folderTitle.trim()) {
      alert('Title cannot be empty!'); // Prevent updating with an empty or blank title
      return;
    } else if (folderId==="") {
      addFolder(folderTitle)
     closeModal()
    } else if(folderId && folderId.trim() !== "") {
      nestAddFolder(folderId,folderTitle)
      closeModal()
    }
    
  }

  


  return (
    <>
      <Header>
        <h2>Create New Folder</h2>
        <CloseButton onClick={() => closeModal()}>
          <IoCloseSharp />
        </CloseButton>
      </Header>
      <Input>
        <input type="text" onChange={(e) => setFolderTitle(e.target.value)} />
        <button onClick={handleAdd}> Create Folder</button>
      </Input>
    </>
  )
}

export default NewFolder