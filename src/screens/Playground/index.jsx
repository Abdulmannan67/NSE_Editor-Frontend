import React, { useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import EditorContainer from './EditorContainer';
import OutputConsole from './OutputConsole';
import Sidebar from '../Playground/Sidebar';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { PlaygroundContext } from '../../context/PlaygroundContext';
import { ModalContext } from '../../context/ModalContext';
import Modal from '../../components/Modal';

const MainContainer = styled.div`
  display: flex;
  min-height: ${({ isFullScreen }) => (isFullScreen ? '100vh' : 'calc(100vh - 4.5rem)')};
  max-width: 100%;
  box-sizing: border-box;
`;

const ContentContainer = styled.div`
  width: ${({ isSidebarOpen }) => (isSidebarOpen ? 'calc(100% - 200px)' : 'calc(100% - 75px)')};
  margin-left: ${({ isSidebarOpen }) => (isSidebarOpen ? '200px' : '75px')};
  min-height: 100%;
  transition: margin-left 0.3s ease, width 0.3s ease;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    width: 100%;
    margin-left: 0;
  }
`;

const Consoles = styled.div`
  display: grid;
  width: 100%;
  max-width: 100%;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  box-sizing: border-box;
  overflow: visible;
`;

const Playground = () => {
  const { folderId, playgroundId } = useParams();
  const { folders, updateFileData } = useContext(PlaygroundContext);
  const { isOpenModal, openModal } = useContext(ModalContext);
  const [FileDetails, setFileDetails] = useState({});
  const { title, language, code } = FileDetails;

  const [currentLanguage,setcurrentLanguage] = useState(language);
  const [editLanguage, setediLanguage] = useState(language);
  const [currentCode, setCurrentCode] = useState(code);
  const [logs, setLogs] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [applicationId, setApplicationId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();


  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/")
    }    
      const fileDetails = findFileDetails(folders, folderId, playgroundId);
    
      if (fileDetails) {
        // console.log(fileDetails.code)
        setFileDetails(fileDetails);
        setCurrentCode(fileDetails.code); // ✅ Extract code from fileDetails
        setcurrentLanguage(fileDetails.language); // ✅ Extract language
      }
  
  }, [folders, folderId, playgroundId,code]);



  
  

  const findFileDetails = (folderTree, folderId, playgroundId) => {
    if (!folderTree || !Array.isArray(folderTree.children)) {
      return { title: '', language: '', code: '' };
    }
  
    const searchFolder = (folders, targetFolder, targetFile) => {
      for (const folder of folders) {
        const currentPath = folder.folder;
  
        // Check if targetFolder starts with currentPath
        if (targetFolder === currentPath || targetFolder.startsWith(`${currentPath}/`)) {
          if (folder.files?.length) {
            const file = folder.files.find((f) => f.file === targetFile);
            if (file) {
              return {
                title: file.file,
                language: file.file.split('.').pop(),
                code: file.content || '',
              };
            }
          }
  
          // Recursively search children
          if (folder.children?.length) {
            // Remove the currentPath prefix and clean up slashes
            const remainingPath = targetFolder === currentPath 
              ? '' 
              : targetFolder.slice(currentPath.length + 1);
            const result = searchFolder(folder.children, remainingPath, targetFile);
            if (result.title) return result;
          }
        }
      }
      return { title: '', language: '', code: '' };
    };
  
    // Decode folderId to handle encoded URLs
    const decodedFolderId = decodeURIComponent(folderId);
    const decodedPlaygroundId = decodeURIComponent(playgroundId);
    return searchFolder(folderTree.children, decodedFolderId, decodedPlaygroundId);
  };




  const saveCode = (folderId, fileId, code) => {
    if (folderId===":folderId" || playgroundId===":playgroundId" ) {
      alert("Please create file first")
      
    }else if(folderId !==":folderId" || playgroundId !==":playgroundId"){
      updateFileData(folderId, fileId, code);
    
    }
   
  };

  const closeModal = () => {
    openModal({ show: false });
  };

  const runCode = async () => {
    openModal({
      show: true,
      modalType: 6,
      identifiers: { folderId: "", cardId: "" }
    });

    setLogs([]);
    

    if (editLanguage === "Impala") {
      setIsSubmitting(true);
      const response = await fetch("http://localhost:5000/query/run-impala-query", {
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
      const response = await fetch("http://localhost:5000/query/run-hive-query", {
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

        if (data.jobId) setJobId(data.jobId);
        if (data.applicationId) setApplicationId(data.applicationId);
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
      Swal.fire({
        title: "Action Required!",
        text: "First, create a file (.py or .sql), then choose Hive, Impala, or PySpark to execute.",
        icon: "info",
        confirmButtonText: "Got it!"
      });
    }
    closeModal();
  };

  return (
    <MainContainer isFullScreen={isFullScreen}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        saveCode={(folderId, fileId) => saveCode(folderId, fileId, currentCode)}
      />
      <ContentContainer isFullScreen={isFullScreen} isSidebarOpen={isSidebarOpen}>
        <EditorContainer
          title={title}
          currentLanguage={currentLanguage}
          setediLanguage={setediLanguage}
          currentCode={currentCode}
          setCurrentCode={setCurrentCode}
          folderId={folderId}
          playgroundId={playgroundId}
          saveCode={() => saveCode(folderId, playgroundId, currentCode)}
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
            language={editLanguage}
            isFullScreen={isFullScreen}
          />
        </Consoles>
      </ContentContainer>
      {isOpenModal.show && <Modal />}
    </MainContainer>
  );
};

export default Playground;