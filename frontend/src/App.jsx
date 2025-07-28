import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import {MyContext} from "./MyContext.jsx";
import { useState } from 'react';
import {v1 as uuidv1} from "uuid";
import Login from "./Login.jsx";
import Register from "./Register.jsx";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); //stores all chats of curr threads
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [showRegister, setShowRegister] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };
  const handleShowRegister = () => setShowRegister(true);
  const handleShowLogin = () => setShowRegister(false);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    isAuthenticated,
    setShowAuthModal
  };

  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
        <Sidebar onShowLogin={() => { setShowAuthModal(true); setShowRegister(false); }} onShowRegister={() => { setShowAuthModal(true); setShowRegister(true); }} />
        <ChatWindow />
        {showAuthModal && (
          <div className="auth-modal">
            <div className="auth-modal-content">
              <button className="auth-modal-close" onClick={() => setShowAuthModal(false)}>×</button>
              {showRegister ? (
                <>
                  <Register onRegister={handleShowLogin} />
                  <p>Already have an account? <button onClick={handleShowLogin}>Login</button></p>
                </>
              ) : (
                <>
                  <Login onLogin={handleLogin} />
                  <p>Don't have an account? <button onClick={handleShowRegister}>Register</button></p>
                </>
              )}
            </div>
          </div>
        )}
      </MyContext.Provider>
    </div>
  )
}

export default App;