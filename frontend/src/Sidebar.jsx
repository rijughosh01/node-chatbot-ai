import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

function Sidebar({ onShowLogin, onShowRegister, onCloseSidebar, onLogout }) {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
    isAuthenticated,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/thread`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
    // Close sidebar on mobile after creating new chat
    if (onCloseSidebar) onCloseSidebar();
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/thread/${newThreadId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await response.json();
      console.log(res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
      // Close sidebar on mobile after changing thread
      if (onCloseSidebar) onCloseSidebar();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/thread/${threadId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await response.json();
      console.log(res);

      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="w-80 md:w-80 lg:w-80 h-screen bg-gradient-to-b from-dark-800 to-dark-900 border-r border-gray-700/50 flex flex-col">
      {/* Mobile Close Button */}
      <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-700/50 md:hidden">
        <h2 className="text-lg font-semibold text-white">Menu</h2>
        <button
          onClick={onCloseSidebar}
          className="text-gray-400 hover:text-white transition-colors duration-200 text-xl"
        >
          ×
        </button>
      </div>

      {/* New Chat Button */}
      <button
        onClick={createNewChat}
        className="flex items-center justify-between mx-2 md:mx-4 mt-4 p-2 md:p-3 rounded-xl border border-gray-600/30 bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-700/70 hover:to-gray-600/70 transition-all duration-300 group hover:shadow-glow"
      >
        <div className="flex items-center space-x-2 md:space-x-3">
          <img
            src="/blacklogo.png"
            alt="gpt logo"
            className="h-8 w-8 md:h-10 md:w-10 bg-white rounded-full object-cover"
          />
          <span className="text-gray-300 font-medium text-sm md:text-base">
            New Chat
          </span>
        </div>
        <i className="fa-solid fa-pen-to-square text-gray-400 group-hover:text-primary-400 transition-colors duration-200 text-sm md:text-base"></i>
      </button>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-2 md:px-4 py-4">
        <ul className="space-y-1 md:space-y-2">
          {allThreads?.map((thread, idx) => (
            <li
              key={idx}
              onClick={(e) => changeThread(thread.threadId)}
              className={`group relative p-2 md:p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                thread.threadId === currThreadId
                  ? "bg-gradient-to-r from-primary-600/20 to-primary-500/20 border border-primary-500/30 text-primary-300"
                  : "hover:bg-gray-700/30 text-gray-300 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm font-medium truncate pr-6 md:pr-8">
                  {thread.title}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteThread(thread.threadId);
                  }}
                  className="absolute right-1 md:right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-400 p-1 rounded"
                >
                  <i className="fa-solid fa-trash text-xs group-hover:text-red-500 transition-colors duration-200"></i>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Auth Buttons */}
      {!isAuthenticated && (
        <div className="p-2 md:p-4 space-y-2 md:space-y-3 border-t border-gray-700/50">
          <button
            onClick={onShowLogin}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium py-2 md:py-3 px-3 md:px-4 rounded-xl transition-all duration-300 hover:shadow-glow transform hover:-translate-y-0.5 text-sm md:text-base"
          >
            Login
          </button>
          <button
            onClick={onShowRegister}
            className="w-full bg-transparent border border-primary-500 text-primary-400 hover:bg-primary-500/10 font-medium py-2 md:py-3 px-3 md:px-4 rounded-xl transition-all duration-300 text-sm md:text-base"
          >
            Create Account
          </button>
        </div>
      )}
      {isAuthenticated && (
        <div className="p-4 border-t border-gray-700/50">
          <button
            onClick={onLogout}
            className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-medium py-2 md:py-3 px-3 md:px-4 rounded-xl transition-all duration-300 hover:shadow-glow transform hover:-translate-y-0.5 text-sm md:text-base flex items-center justify-center space-x-2 cursor-pointer"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>
      )}
    </section>
  );
}

export default Sidebar;
