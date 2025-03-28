import React, { useContext, useState } from 'react';
import { Header, CloseButton, Input } from '../Modal';
import { IoCloseSharp } from 'react-icons/io5';
import { ModalContext } from '../../context/ModalContext';
import { PlaygroundContext } from '../../context/PlaygroundContext';
import Select from 'react-select';
const EditPlaygroundTitle = () => {

  const languageOptions = [
    { value: "py", label: "PySpark" },
    { value: "sql", label: "HiveQL" },
    { value: "sql", label: "Impala" },

  ];
  const { isOpenModal, closeModal } = useContext(ModalContext); // Access modal state and close handler
  const { updateFileContent, folders } = useContext(PlaygroundContext); // Access the context for editing

  const { folderId, cardId } = isOpenModal.identifiers || {}; // Destructure folder and card identifiers safely
  const [language, setLanguage] = useState(languageOptions[0]);
  const [playgroundTitle, setPlaygroundTitle] = useState(
    folders[folderId]?.playgrounds[cardId]?.title || '' // Default title or an empty string
  );



  
  const handleLanguageChange = (selectedOption) => {
    setLanguage(selectedOption);
  };

  const handleUpdate = () => {
    if (!playgroundTitle.trim()) {
      alert('Title cannot be empty!'); // Prevent updating with an empty or blank title
      return;
    }
   
    // editPlaygroundTitle(folderId, cardId, playgroundTitle); // Call context function to update
    updateFileContent(folderId, cardId, playgroundTitle,language.value)
    closeModal(); // Close modal after successful update
  };

  return (
    <>
      <Header>
        <h2>Edit Card Title</h2>
        <CloseButton onClick={() => closeModal()}>
          <IoCloseSharp />
        </CloseButton>
      </Header>
      <Input>
        <input
          type="text"
          value={playgroundTitle} // Controlled input for title
          onChange={(e) => setPlaygroundTitle(e.target.value)} // Update state as user types
          placeholder="Enter new title"
          maxLength={50} // Optional: Limit title length
        />
        <Select
          options={languageOptions}
          value={language}
          onChange={handleLanguageChange}
        />
        <button onClick={handleUpdate}>Update Title</button>
      </Input>
    </>
  );
};

export default EditPlaygroundTitle;
