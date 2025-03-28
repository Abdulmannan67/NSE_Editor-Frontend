import { BrowserRouter, Route, Routes , Navigate } from 'react-router-dom';
import Home from './screens/Home';
import Playground from './screens/Playground';
import Error404 from './screens/Error404';
import { GlobalStyle } from './style/global';
import ModalProvider from './context/ModalContext';
import PlaygroundProvider from './context/PlaygroundContext';
import Login from './screens/Home/Login';

function App() {

  const isAuthenticated = () => {
      
    return !!localStorage.getItem('token'); // Return true if token exists
};

// const handleLogout = () => {
//     localStorage.removeItem('token'); // Clear token from local storage on logout
// };

  return (
    <PlaygroundProvider>
      <ModalProvider>
        <BrowserRouter>
          <GlobalStyle />
          <Routes>
  {/* <Route path="/" element={isAuthenticated() ? <Navigate to="/home" /> : <Login />} /> */}
  <Route path="/" element={ <Login />} />
  <Route path="/home" element={isAuthenticated() ? <Home /> : <Navigate to="/" />} />
  <Route path="/playground/:folderId/:playgroundId" element={isAuthenticated() ? <Playground /> : <Navigate to="/" />} />
  <Route path="*" element={<Error404 />} />
</Routes>

        </BrowserRouter>
      </ModalProvider>
    </PlaygroundProvider>
  );
}

export default App;
