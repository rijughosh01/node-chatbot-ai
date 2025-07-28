import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import {MyContext} from "./MyContext.jsx";
import { useState } from 'react';
import {v1 as uuidv1} from "uuid";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import { Toaster } from 'react-hot-toast';
import { useSwipeable } from 'react-swipeable';

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
  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setShowAuthModal(true);
    setPrevChats([]);
    setAllThreads([]);
    setCurrThreadId(uuidv1());
    setPrompt("");
    setReply(null);
    setNewChat(true);
  };

  const handleShowRegister = () => setShowRegister(true);
  const handleShowLogin = () => setShowRegister(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Swipe handlers for mobile sidebar
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setShowSidebar(false),
    onSwipedRight: () => setShowSidebar(true),
    delta: 50,
    trackTouch: true,
    trackMouse: false,
    preventScrollOnSwipe: true,
  });

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
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-gray-100 font-sans"> 
      <MyContext.Provider value={providerValues}>
        <Toaster position="top-right" toastOptions={{
          className: 'bg-gray-800 text-white dark:bg-white dark:text-gray-900',
          style: { borderRadius: '8px', fontSize: '1rem' }
        }} />
        <div className="flex h-screen relative" {...swipeHandlers}>
          {/* Mobile Sidebar Overlay */}
          {showSidebar && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setShowSidebar(false)}
            />
          )}
          
          {/* Sidebar */}
          <div className={`fixed md:relative z-50 transform transition-transform duration-300 ease-in-out ${
            showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}>
            <Sidebar 
              onShowLogin={() => { setShowAuthModal(true); setShowRegister(false); }} 
              onShowRegister={() => { setShowAuthModal(true); setShowRegister(true); }}
              onCloseSidebar={() => setShowSidebar(false)}
              onLogout={handleLogout}
            />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <ChatWindow onToggleSidebar={toggleSidebar} onLogout={handleLogout} />
          </div>
        </div>
        
        {/* Auth Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="relative bg-gradient-to-br from-dark-800 to-dark-700 border border-gray-600/30 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl animate-scale-in">
              {/* Close Button */}
              <button 
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 text-2xl font-light"
                onClick={() => setShowAuthModal(false)}
              >
                ×
              </button>
              
              {/* Modal Content */}
              <div className="space-y-6">
                {showRegister ? (
                  <>
                    <Register onRegister={handleShowLogin} />
                    <div className="text-center text-gray-300">
                      <p>Already have an account? 
                        <button 
                          onClick={handleShowLogin}
                          className="ml-2 text-primary-400 hover:text-primary-300 transition-colors duration-200 font-medium"
                        >
                          Login
                        </button>
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Login onLogin={handleLogin} />
                    <div className="text-center text-gray-300">
                      <p>Don't have an account? 
                        <button 
                          onClick={handleShowRegister}
                          className="ml-2 text-primary-400 hover:text-primary-300 transition-colors duration-200 font-medium"
                        >
                          Register
                        </button>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </MyContext.Provider>
    </div>
  )
}

export default App;