import React, { useContext, useState, useEffect } from 'react';
import EditorContainer from './EditorContainer';
import OutputConsole from './OutputConsole';
import Navbar from './Navbar';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { languageMap, PlaygroundContext } from '../../context/PlaygroundContext';
import { ModalContext } from '../../context/ModalContext';
import Modal from '../../components/Modal';

const MainContainer = styled.div`
  display: grid;
  grid-template-columns: ${({ isFullScreen }) => (isFullScreen ? '1fr' : '3.5fr 1fr')};
  min-height: ${({ isFullScreen }) => (isFullScreen ? '100vh' : 'calc(100vh - 4.5rem)')};
  max-width: 100%;
  box-sizing: border-box;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Consoles = styled.div`
  display: grid;
  border-left: 1px solid black;
  width: 100%;
  max-width: 100%;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  box-sizing: border-box;
  overflow: visible;
`;

const Playground = () => {
  const { folderId, playgroundId } = useParams();
  const { folders,updateFileContent,updateFileData } = useContext(PlaygroundContext);
  const { isOpenModal, openModal } = useContext(ModalContext);
  const [FileDetails, setFileDetails] = useState({});
  const { title, language, code } = FileDetails;

  const [currentLanguage, setcurrentLanguage] = useState(language);
  const [editLanguage, setediLanguage] = useState(language);
  const [currentCode, setCurrentCode] = useState(code);
  const [logs, setLogs] = useState([]); // Unified logs for Spark, Hive, Impala
  const [isFullScreen, setIsFullScreen] = useState(false);
  

  // FOR SPARK
  const [jobId, setJobId] = useState(null);
  const [applicationId, setApplicationId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  console.log(applicationId)

  useEffect(() => {
   
    if (folders && folders.length > 0) {
      const fileDetails = findFileDetails();
      setFileDetails(fileDetails);
      setCurrentCode(code)
      setcurrentLanguage(language)
    } else {
      console.warn("Folders are empty or not fetched yet");
    }
  }, [folders, folderId, playgroundId,code]);




  const findFileDetails = () => {
    if (!folders || !Array.isArray(folders) || folders.length === 0) {
      return { title: "", language: "", code: "" };
    }
    const folder = folders.find(f => f.folder === folderId);
    if (!folder || !folder.files || !Array.isArray(folder.files)) {
      return { title: "", language: "", code: "" };
    }
    const file = folder.files.find(f => f.file === playgroundId);
    if (!file) {
      return { title: "", language: "", code: "" };
    }
    return {
      title: file.file,
      language: file.file.split('.').pop(),
      code: file.content || ""
    };
  };







  const closeModal = () => {
    openModal({ show: false });
  };





  const saveCode= async ()=>{
      updateFileData( folderId,title, currentCode)
    }
  





  const runCode = async () => {
    openModal({
      show: true,
      modalType: 6,
      identifiers: { folderId: "", cardId: "" }
    });

    setLogs([]);
    

    if (editLanguage === "Impala") {
      setIsSubmitting(true);
      const response = await fetch("http://localhost:5000/auth/run-impala-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: `${currentCode}` }),
      });

      const data = await response.json();
      if (data.error) {
        setLogs([`Error: ${data.error}`]);
      } else {
        setLogs([data.result]); // Impala output as a single log entry
      }
      setIsSubmitting(false);
    } else if (editLanguage === "hiveQL") {
      setIsSubmitting(true);
      const response = await fetch("http://localhost:5000/auth/run-hive-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: `${currentCode}` }),
      });

      const data = await response.json();
      if (data.error) {
        setLogs([`Error: ${data.error}`]);
      } else {
        setLogs([data.result]); // Hive output as a single log entry
      }
      setIsSubmitting(false);
    } else if (editLanguage === "PySpark") {
      setIsSubmitting(true);
      setJobId(null);
      setApplicationId(null);

      const code = currentCode;
      const source = new EventSource(
        `http://localhost:5000/spark/submit?code=${encodeURIComponent(code)}`,
        { headers: { 'user-id': localStorage.getItem('token') } }
      );

      source.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received SSE data:', data);

        if (data.jobId) setJobId(data.jobId);
        if (data.applicationId) setApplicationId(data.applicationId);
        console.log(data.applicationId)
        if (data.log) {
          setLogs(prevLogs => [...prevLogs, data.log]);
        }
        if (data.state === 'success' || data.state === 'dead') {
          setIsSubmitting(false);
          source.close();
        }
        if (data.error) {
          setLogs(prevLogs => [...prevLogs, `Error: ${data.error}`]);
          setIsSubmitting(false);
          source.close();
        }
      };

      source.onerror = () => {
        setLogs(prevLogs => [...prevLogs, 'Error: Failed to connect to server']);
        setIsSubmitting(false);
        source.close();
      };
    } else{
      alert("Please select hive/impala/pypark")
    }

    closeModal();
  };

  return (
    <div>
      
      <Navbar isFullScreen={isFullScreen} />
      <MainContainer isFullScreen={isFullScreen}>
        <EditorContainer
          title={title}
          currentLanguage={currentLanguage}
          setediLanguage={setediLanguage}
          currentCode={currentCode}
          setCurrentCode={setCurrentCode}
          folderId={folderId}
          saveCode={saveCode}
          playgroundId={playgroundId}
          runCode={runCode}
          isFullScreen={isFullScreen}
          setIsFullScreen={setIsFullScreen}
        />
        <Consoles>
          <OutputConsole
            logs={logs}
            applicationId={applicationId}
            jobId={jobId}
            isSubmitting={isSubmitting}
            isFullScreen={isFullScreen}
            language={editLanguage}
          />
        </Consoles>
      </MainContainer>
      {isOpenModal.show && <Modal />}
    </div>
  );
};

export default Playground;