import React, { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { motion, AnimatePresence } from 'framer-motion';
import { useState as useLocalState } from "react";

function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (reply === null) {
      setLatestReply(null); //prevchat load
      return;
    }

    if (!prevChats?.length) return;

    const content = reply.split(" "); //individual words

    let idx = 0;
    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));

      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [prevChats, reply]);

  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [prevChats, latestReply]);

  // Local state for copy feedback
  const [copiedIdx, setCopiedIdx] = useLocalState(null);
  const [copiedLatest, setCopiedLatest] = useLocalState(false);
  const handleCopy = (code, idx) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1200);
  };
  const handleCopyLatest = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedLatest(true);
    setTimeout(() => setCopiedLatest(false), 1200);
  };

  
  function extractTextFromChildren(children) {
    if (typeof children === 'string') return children;
    if (Array.isArray(children)) return children.map(extractTextFromChildren).join('');
    if (children && typeof children === 'object' && children.props && children.props.children)
      return extractTextFromChildren(children.props.children);
    return '';
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Welcome Message */}
      {newChat && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-3 md:space-y-4 animate-fade-in px-4">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              Start a New Chat!
            </h1>
            <p className="text-gray-400 max-w-md text-sm md:text-base">
              Ask me anything - I'm here to help with coding, explanations, and more.
            </p>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
      >
        <div className="max-w-4xl mx-auto px-3 md:px-4 py-6 md:py-8 space-y-4 md:space-y-6">
          <AnimatePresence initial={false}>
            {prevChats?.slice(0, -1).map((chat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 100 }}
                className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] md:max-w-3xl ${chat.role === "user" ? "order-2" : "order-1"}`}>
                  {chat.role === "user" ? (
                    <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-4 md:px-6 py-3 md:py-4 rounded-2xl shadow-lg">
                      <p className="text-xs md:text-sm leading-relaxed">{chat.content}</p>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4 rounded-2xl shadow-lg">
                      <div className="prose prose-invert max-w-none text-gray-100 text-xs md:text-sm leading-relaxed">
                        <ReactMarkdown 
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            code: ({node, inline, className, children, ...props}) => {
                              const match = /language-(\w+)/.exec(className || '');
                              let codeString = extractTextFromChildren(children).replace(/\n$/, "");
                              return !inline && match ? (
                                <div className="relative group">
                                  <pre className="bg-gray-900/80 rounded-lg p-2 md:p-3 overflow-x-auto my-3 md:my-4 text-xs md:text-sm">
                                    <code className={className} {...props}>
                                      {children}
                                    </code>
                                  </pre>
                                  <button
                                    className="absolute top-2 right-2 bg-gray-800/80 hover:bg-primary-500 text-xs text-white px-2 py-1 rounded transition-all duration-200 opacity-80 group-hover:opacity-100"
                                    onClick={() => handleCopy(codeString, idx)}
                                  >
                                    {copiedIdx === idx ? "Copied!" : "Copy"}
                                  </button>
                                </div>
                              ) : (
                                <code className="bg-gray-700/50 px-1 md:px-2 py-0.5 md:py-1 rounded text-primary-300 text-xs md:text-sm" {...props}>
                                  {children}
                                </code>
                              );
                            },
                            p: ({children}) => <p className="mb-3 md:mb-4 last:mb-0">{children}</p>,
                            h1: ({children}) => <h1 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">{children}</h1>,
                            h2: ({children}) => <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-white">{children}</h2>,
                            h3: ({children}) => <h3 className="text-base md:text-lg font-bold mb-2 text-white">{children}</h3>,
                            ul: ({children}) => <ul className="list-disc list-inside mb-3 md:mb-4 space-y-0.5 md:space-y-1">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal list-inside mb-3 md:mb-4 space-y-0.5 md:space-y-1">{children}</ol>,
                            li: ({children}) => <li className="text-gray-300">{children}</li>,
                            blockquote: ({children}) => (
                              <blockquote className="border-l-4 border-primary-500 pl-3 md:pl-4 italic text-gray-300 mb-3 md:mb-4">
                                {children}
                              </blockquote>
                            ),
                            a: ({children, href}) => (
                              <a href={href} className="text-primary-400 hover:text-primary-300 underline" target="_blank" rel="noopener noreferrer">
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {chat.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Latest Reply with Typewriter Effect */}
          <AnimatePresence initial={false}>
            {prevChats.length > 0 && (
              <motion.div
                key={"latest-reply"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 100 }}
                className="flex justify-start"
              >
                <div className="max-w-[85%] md:max-w-3xl">
                  {latestReply === null ? (
                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4 rounded-2xl shadow-lg">
                      <div className="prose prose-invert max-w-none text-gray-100 text-xs md:text-sm leading-relaxed">
                        <ReactMarkdown 
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            code: ({node, inline, className, children, ...props}) => {
                              const match = /language-(\w+)/.exec(className || '');
                              let codeString = extractTextFromChildren(children).replace(/\n$/, "");
                              return !inline && match ? (
                                <div className="relative group">
                                  <pre className="bg-gray-900/80 border border-gray-600/30 rounded-lg p-2 md:p-3 overflow-x-auto my-3 md:my-4 text-xs md:text-sm">
                                    <code className={className} {...props}>
                                      {children}
                                    </code>
                                  </pre>
                                  <button
                                    className="absolute top-2 right-2 bg-gray-800/80 hover:bg-primary-500 text-xs text-white px-2 py-1 rounded transition-all duration-200 opacity-80 group-hover:opacity-100"
                                    onClick={() => handleCopyLatest(codeString)}
                                  >
                                    {copiedLatest ? "Copied!" : "Copy"}
                                  </button>
                                </div>
                              ) : (
                                <code className="bg-gray-700/50 px-1 md:px-2 py-0.5 md:py-1 rounded text-primary-300 text-xs md:text-sm" {...props}>
                                  {children}
                                </code>
                              );
                            },
                            p: ({children}) => <p className="mb-3 md:mb-4 last:mb-0">{children}</p>,
                            h1: ({children}) => <h1 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">{children}</h1>,
                            h2: ({children}) => <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-white">{children}</h2>,
                            h3: ({children}) => <h3 className="text-base md:text-lg font-bold mb-2 text-white">{children}</h3>,
                            ul: ({children}) => <ul className="list-disc list-inside mb-3 md:mb-4 space-y-0.5 md:space-y-1">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal list-inside mb-3 md:mb-4 space-y-0.5 md:space-y-1">{children}</ol>,
                            li: ({children}) => <li className="text-gray-300">{children}</li>,
                            blockquote: ({children}) => (
                              <blockquote className="border-l-4 border-primary-500 pl-3 md:pl-4 italic text-gray-300 mb-3 md:mb-4">
                                {children}
                              </blockquote>
                            ),
                            a: ({children, href}) => (
                              <a href={href} className="text-primary-400 hover:text-primary-300 underline" target="_blank" rel="noopener noreferrer">
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {prevChats[prevChats.length - 1].content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4 rounded-2xl shadow-lg">
                      <div className="prose prose-invert max-w-none text-gray-100 text-xs md:text-sm leading-relaxed">
                        <ReactMarkdown 
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            code: ({node, inline, className, children, ...props}) => {
                              const match = /language-(\w+)/.exec(className || '');
                              let codeString = extractTextFromChildren(children).replace(/\n$/, "");
                              return !inline && match ? (
                                <div className="relative group">
                                  <pre className="bg-gray-900/80 border border-gray-600/30 rounded-lg p-2 md:p-3 overflow-x-auto my-3 md:my-4 text-xs md:text-sm">
                                    <code className={className} {...props}>
                                      {children}
                                    </code>
                                  </pre>
                                  <button
                                    className="absolute top-2 right-2 bg-gray-800/80 hover:bg-primary-500 text-xs text-white px-2 py-1 rounded transition-all duration-200 opacity-80 group-hover:opacity-100"
                                    onClick={() => handleCopyLatest(codeString)}
                                  >
                                    {copiedLatest ? "Copied!" : "Copy"}
                                  </button>
                                </div>
                              ) : (
                                <code className="bg-gray-700/50 px-1 md:px-2 py-0.5 md:py-1 rounded text-primary-300 text-xs md:text-sm" {...props}>
                                  {children}
                                </code>
                              );
                            },
                            p: ({children}) => <p className="mb-3 md:mb-4 last:mb-0">{children}</p>,
                            h1: ({children}) => <h1 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">{children}</h1>,
                            h2: ({children}) => <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-white">{children}</h2>,
                            h3: ({children}) => <h3 className="text-base md:text-lg font-bold mb-2 text-white">{children}</h3>,
                            ul: ({children}) => <ul className="list-disc list-inside mb-3 md:mb-4 space-y-0.5 md:space-y-1">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal list-inside mb-3 md:mb-4 space-y-0.5 md:space-y-1">{children}</ol>,
                            li: ({children}) => <li className="text-gray-300">{children}</li>,
                            blockquote: ({children}) => (
                              <blockquote className="border-l-4 border-primary-500 pl-3 md:pl-4 italic text-gray-300 mb-3 md:mb-4">
                                {children}
                              </blockquote>
                            ),
                            a: ({children, href}) => (
                              <a href={href} className="text-primary-400 hover:text-primary-300 underline" target="_blank" rel="noopener noreferrer">
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {latestReply}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Chat;
