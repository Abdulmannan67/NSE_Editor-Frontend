import React from 'react'
import styled from 'styled-components'
import { BiImport } from 'react-icons/bi'
export const Console = styled.div`
  background: rgb(30, 30, 30);
  color: white;
  display: flex;
  flex-direction: column;
`

export const Header = styled.div`
  height: 5vh;
  border-top: 2px solid rgba(82, 77, 77, 0.83);
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.16);
  padding: 0 1rem;
  z-index: 2;
  font-size: 1.25rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky; /* Added sticky positioning */
  top: 0; /* Ensures it stays at the top when scrolling */
  input {
    display: none;
  }
  label, a {
    font-weight: 400;
    display: flex;
    align-items: center;
    gap: 0.7rem;
    color: black;
  }
`;

export const TextArea = styled.textarea`
  flex-grow: 1;
  resize: none;
  border: 0;
  outline: 0;
  padding: 0.25rem;
  padding-top: 0.5rem;
  font-size: 1.1rem;
  min-height: 250px;
`
const InputConsole = ({ currentInput, setCurrentInput, getFile }) => {
  return (
    <Console>
      <Header>
        Input: 
        <label htmlFor="inputfile">
          <input type="file" accept="." id="inputfile" onChange={(e) => getFile(e, setCurrentInput)} /> <BiImport /> Import Input
        </label>
      </Header>
      <TextArea
        onChange={(e) => setCurrentInput(e.target.value)}
        value={currentInput}
      />
    </Console>
  )
}

export default InputConsole