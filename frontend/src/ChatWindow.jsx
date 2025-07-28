import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

function ChatWindow({ onToggleSidebar }) {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
    isAuthenticated,
    setShowAuthModal,
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserInfo(payload.username || payload.email || null);
      } catch {
        setUserInfo(null);
      }
    } else {
      setUserInfo(null);
    }
  }, [isAuthenticated]);

  const getReply = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setLoading(true);
    setNewChat(false);
    const token = localStorage.getItem("token");
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, options);
      const res = await response.json();
      setReply(res.reply);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  //Append new chat to prevChats
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }
    setPrompt("");
  }, [reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Header/Navbar */}
      <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-700/50 bg-gradient-to-r from-dark-800/50 to-dark-700/50 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center space-x-3">
          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden text-gray-400 hover:text-white transition-colors duration-200 p-1"
          >
            <i className="fa-solid fa-bars text-lg"></i>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-lg md:text-xl font-semibold text-white">
              NodeGPT
            </span>
            <i className="fa-solid fa-chevron-down text-gray-400 text-xs md:text-sm"></i>
          </div>
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={handleProfileClick}
            className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full hover:from-primary-400 hover:to-primary-500 transition-all duration-300 shadow-glow hover:shadow-glow-lg"
          >
            <i className="fa-solid fa-user text-white text-xs md:text-sm"></i>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div
              className="absolute right-0 top-10 md:top-12 w-40 md:w-48 bg-gradient-to-b from-dark-700 to-dark-800 border border-gray-600/30 rounded-xl shadow-2xl animate-slide-down z-[100]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-2 md:p-3 border-b border-gray-600/30">
                <div className="text-primary-400 font-semibold text-xs md:text-sm">
                  {userInfo || "User"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 min-h-0 relative">
        <Chat />
      </div>

      {/* Loading Spinner (for input area, optional) */}
      {loading && (
        <div className="flex justify-center py-3 md:py-4 flex-shrink-0">
          <ScaleLoader color="#3b82f6" />
        </div>
      )}

      {/* Chat Input */}
      <div className="p-3 md:p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <input
              placeholder="Ask anything..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
              disabled={loading}
              className="w-full bg-gray-800/50 border border-gray-600/30 rounded-2xl px-4 md:px-6 py-3 md:py-4 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 backdrop-blur-sm text-sm md:text-base"
            />
            <button
              onClick={getReply}
              disabled={loading || !prompt.trim()}
              className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all duration-300 shadow-glow hover:shadow-glow-lg disabled:shadow-none"
            >
              <i className="fa-solid fa-paper-plane text-white text-xs md:text-sm"></i>
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-2 md:mt-3">
            NodeGPT can make mistakes. Check important info. See Cookie
            Preferences.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
