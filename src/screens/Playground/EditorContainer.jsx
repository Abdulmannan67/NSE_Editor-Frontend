import React, { useState } from "react";
import { FaPlay } from "react-icons/fa";
import CodeEditor from "./CodeEditor";
import styled from "styled-components";
import { BiExport, BiSave } from "react-icons/bi";
import Select from "react-select";
import { useEffect } from "react";

const StyledEditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const UpperToolBar = styled.div`
  position: sticky; /* Sticky positioning */
  height: 9vh; 
  top: 0; /* Stick to the top of the container */
  border-bottom: 2px solid rgba(82, 77, 77, 0.83);
  background: rgb(30, 30, 30); /* Add background color to avoid transparency */
  z-index: 10; /* Ensure it stays on top of other elements */
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: 0.4rem 1.4rem;

  @media (max-width: 540px) {
    height: 8rem;
  }
`;

const Header = styled.div`
  position: sticky; /* Sticky positioning */
  top: 0; /* Stick to the top of the container */
  z-index: 15; /* Higher than the UpperToolBar for layered visibility */
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 540px) {
    width: 100%;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-right: 2.3rem;
  font-size: 1.3rem;
  @media (min-width: 540px) {
    margin-right: 1rem;
  }
`;

const SelectBars = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  & > div {
    width: 8rem;
  }

  & > div:last-child {
    width: 10rem;
  }
`;



const CodeEditorContainer = styled.div`
  height: calc(100% - 4rem);
  width: 90vw;

  & > div {
    height: 100%;
  }
`;

const SaveIconContainer = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
      color: #27c127;


   &:hover::after {
    content: "Save code";
    position: absolute;
    left: 0%;
    bottom: -28px; /* Position text on the right */
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 7px;
    border-radius: 5px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
  }

  &::after {
    opacity: 0;
  }
`;



const ShareIconContainer = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
color: #007bff;
  margin-left 2vw;

  &:hover::after {
    content: "Export code";
    position: absolute;
    left: 0%;
    bottom: -28px; /* Position text on the right */
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 7px;
    border-radius: 5px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
  }

  &::after {
    opacity: 0;
  }
`;

const PlayIconContainer = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
  color : hsla(11, 100%, 62.2%, 1);
  margin-left 2vw;

  &:hover::after {
    content: "Run Code";
    position: absolute;
    right: -80px; /* Position text on the right */
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
  }

  &::after {
    opacity: 0;
  }
`;

const EditorContainer = ({
  title,
  currentLanguage,
  setediLanguage,
  currentCode,
  setCurrentCode,
  saveCode,
  runCode,
  // getFile,
  isFullScreen,
}) => {
  const themeOptions = [
    { value: "githubDark", label: "githubDark" },
    { value: "githubLight", label: "githubLight" },
    { value: "bespin", label: "bespin" },
    { value: "duotoneDark", label: "duotoneDark" },
    { value: "duotoneLight", label: "duotoneLight" },
    { value: "dracula", label: "dracula" },
    { value: "xcodeDark", label: "xcodeDark" },
    { value: "xcodeLight", label: "xcodeLight" },
    { value: "vscodeDark", label: "vscodeDark" },
    { value: "vscodeLight", label: "vscodeLight" },
    { value: "okaidia", label: "okaidia" },
  ];

  useEffect(() => {
    
    if (currentLanguage === "sql") {
      setlanguageOptions([
        { value: "sql", label: "hiveQL" },
        { value: "sql", label: "Impala" },
      ]);
    } else if (currentLanguage === "py") {
      setlanguageOptions([{ value: "py", label: "PySpark" }]);
    }
  }, [currentLanguage]);

  const [languageOptions, setlanguageOptions] = useState([]);

  const handleThemeChange = (selectedOption) => {
    setCurrentTheme(selectedOption);
  };



  const handleLanguageChange = (selectedOption) => {
    setLanguage(selectedOption);
    setediLanguage(selectedOption.label);
    // setCurrentCode(languageMap[selectedOption.value].defaultCode)
    // console.log(selectedOption.label)
  };

  // console.log(currentCode)

  const [currentTheme, setCurrentTheme] = useState({
    value: "githubDark",
    label: "githubDark",
  });

  const [language, setLanguage] = useState(() => {
    for (let i = 0; i < languageOptions.length; i++) {
      if (languageOptions[i].value === currentLanguage) {
        return languageOptions[i];
      }
    }
    return languageOptions[0];
  });

  return (
    <StyledEditorContainer isFullScreen={isFullScreen}>
      <UpperToolBar>
        <Header>
          <Title style={{color:"white"}} >
            <h3>{title}</h3>
          </Title>
          <SaveIconContainer onClick={saveCode}>
    <BiSave size={24}  />
  </SaveIconContainer>



  <ShareIconContainer>
            <a
              href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                currentCode
              )}`}
              download="code.txt"
            >
              <BiExport size={24}  />
            </a>
          </ShareIconContainer>


          <PlayIconContainer onClick={runCode}>
            <FaPlay size={20}  />
          </PlayIconContainer>
          
  

        </Header>
        <SelectBars>
          <Select
            options={languageOptions}
            value={language}
            onChange={handleLanguageChange}
          />
          <Select
            options={themeOptions}
            value={currentTheme}
            onChange={handleThemeChange}
          />
        </SelectBars>
      </UpperToolBar>

      <div className="editorMiddle" style={{ display: "flex" }}>
        <CodeEditorContainer>
          <CodeEditor
            currentLanguage={currentLanguage}
            currentTheme={currentTheme.value}
            currentCode={currentCode}
            setCurrentCode={setCurrentCode}
          />
        </CodeEditorContainer>

       
      </div>
    </StyledEditorContainer>
  );
};

export default EditorContainer;
