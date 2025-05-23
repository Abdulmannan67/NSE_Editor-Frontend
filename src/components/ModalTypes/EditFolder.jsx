import React, { useContext, useState } from 'react'
import { Header, CloseButton, Input } from '../Modal'
import { IoCloseSharp } from 'react-icons/io5'
import { ModalContext } from '../../context/ModalContext'
import { PlaygroundContext } from '../../context/PlaygroundContext'

const EditFolder = () => {
  const { closeModal, isOpenModal } = useContext(ModalContext);
  const { updateFolder } = useContext(PlaygroundContext);

  const {folderId} = isOpenModal.identifiers || {};
 
  const [folderTitle, setFolderTitle] = useState(folderId);

  return (
    <>
      <Header>
        <h2>Edit Folder Title</h2>
        <CloseButton onClick={() => closeModal()}>
          <IoCloseSharp />
        </CloseButton>
      </Header>
      <Input>
        <input type="text" onChange={(e) => setFolderTitle(e.target.value)} />
        <button onClick={() => {
          updateFolder(folderId, folderTitle)
          closeModal()
        }} >Update Title</button>
      </Input>
    </>
  )
}

export default EditFolder;