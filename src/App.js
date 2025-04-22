import { BrowserRouter, Route, Routes , Navigate } from 'react-router-dom';
import Playground from './screens/Playground';
import Error404 from './screens/Error404';
import { GlobalStyle } from './style/global';
import ModalProvider from './context/ModalContext';
import PlaygroundProvider from './context/PlaygroundContext';
import Login from './screens/Home/Login';

function App() {


  return (
    <PlaygroundProvider>
      <ModalProvider>
        <BrowserRouter>
          <GlobalStyle />
          <Routes>
  <Route path="/" element={ <Login />} />
  <Route path="/Editor/:folderId/:playgroundId" element={<Playground />} />
  <Route path="*" element={<Error404 />} />
</Routes>

        </BrowserRouter>
      </ModalProvider>
    </PlaygroundProvider>
  );
}

export default App;
