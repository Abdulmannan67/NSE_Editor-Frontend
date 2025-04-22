import React, { useContext, useState } from 'react'
import { Header, CloseButton } from '../Modal'
import { IoCloseSharp } from 'react-icons/io5'
import { ModalContext } from '../../context/ModalContext'
import { PlaygroundContext } from '../../context/PlaygroundContext'
import Select from 'react-select';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'
const InputWithSelect = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.5fr;
  gap: 1rem;
  margin-top: 1.2rem;
  align-items: center;

  input {
    flex-grow: 1;
    height: 2rem;
  }

  button {
    background: #241f21;
    height: 2.5rem;
    color: white;
    padding: 0.3rem 2rem;
  }

  & > div {
    width: 8rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const NewPlayground = () => {
  const { isOpenModal, closeModal } = useContext(ModalContext);
  const navigate = useNavigate(); // Hook for navigation

  const { addfile ,upsucces} = useContext(PlaygroundContext);

  const languageOptions = [
    { value: "py", label: "PySpark" },
    { value: "sql", label: "HiveQL" },
    { value: "sql", label: "Impala" },

  ];

  const {folderId} = isOpenModal.identifiers;
  const [cardTitle, setCardTitle] = useState("");
  const [language, setLanguage] = useState(languageOptions[0]);

  const handleLanguageChange = (selectedOption) => {
    setLanguage(selectedOption);
  };
  
  const handleAdd=()=>{
    if (!cardTitle.trim()) {
      alert('Title cannot be empty!'); // Prevent updating with an empty or blank title
      return;
    }
    addfile(folderId, cardTitle, language.value)
    closeModal();
    if (upsucces) {
      
      navigate(`/Editor/${encodeURIComponent(folderId)}/${cardTitle}.${language.value}`);
    }
  }

  return (
    <>
      <Header>
        <h2>Create New File</h2>
        <CloseButton onClick={() => closeModal()}>
          <IoCloseSharp />
        </CloseButton>
      </Header>
      <InputWithSelect>
        <input
          type='text'
          onChange={(e) => setCardTitle(e.target.value)}
        />
        <Select
          options={languageOptions}
          value={language}
          onChange={handleLanguageChange}
        />
        <button onClick={handleAdd}> Create New File</button>
      </InputWithSelect>
    </>
  )
}

export default NewPlayground