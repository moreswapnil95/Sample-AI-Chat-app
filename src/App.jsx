import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [aiReady, setAiReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef(null);
  console.log(messages, "jj");

  useEffect(() => {
    const checkReady = setInterval(() => {
      if (
        window.puter &&
        window.puter.ai &&
        typeof window.puter.ai.chat === "function"
      ) {
        setAiReady(true);
        clearInterval(checkReady);
      }
    }, 300);
    return () => clearInterval(checkReady);
  }, []);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({
      behaviour: "smooth",
    });
  };

  useEffect(scrollToBottom, [messages]);

  const addMessages = (msg, isUser) => {
    setMessages((prev) => [
      ...prev,
      {
        content: msg,
        isUser,
        id: Date.now() + Math.random(),
      },
    ]);
  };

  const sendMessage = async () => {
    const message = inputValue.trim();
    if (!message) return;

    if (!aiReady) {
      addMessages(" AI services is still loading. Please wait...", false);
      return;
    }

    addMessages(message, true);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await window.puter.ai.chat(message);

      const reply =
        typeof response === "string"
          ? response
          : response.message?.content || "no reply received.";

      addMessages(reply, false);
    } catch (error) {
      addMessages(
        `* Error : ${error.message || "Soomething went wrong."}`,
        false
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-bl
      from-violet-950 via-emerald-700 to-purple-900 flex
      flex-col items-center justify-center p-4 gap-4"
      >
        <h1
          className="text-6xl sm:text-7xl font-medium
        bg-gradient-to-r from-green-400 via-lime-300 to-green-500
        bg-clip-text text-transparent text-center h-20"
        >
          AI Chat Bot
        </h1>

        <div
          className={`px-4 py-2 rounded-full text-sm 
        ${
          aiReady
            ? "bg-lime-200/20 text-green-100 border border-emerald-500/30"
            : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/20"
        }`}
        >
          {aiReady ? "🟣 AI Ready" : "🟡 Waiting for AI..."}
        </div>

        <div
          className="w-full max-w-6xl bg-gradient-to-r
        from-gray-800/90 to-gray-700/90 backdrop-blur-md
        border border-emerald-900 rounded-3xl p-6 shadow-2xl"
        >
          <div
            className="h-80 overflow-y-auto border-b
          border-gray-600 mb-6 p-4 bg-gradient-to-b
          from-gray-900/50 to-gray-800/50 rounded-2xl"
          >
            {messages.length === 0 && (
              <div className="text-center text-green-100 mt-20">
                👋 Start the conversation by typing a message below.
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 m-2
                rounded-2xl max-w-sm text-wrap ${
                  msg.isUser
                    ? "bg-gradient-to-r from-blue-600 to-emerald-500 text-white ml-auto text-right"
                    : "bg-gradient-to-r from-emerald-600 to-indigo-500 text-white"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            ))}

            {isLoading && (
              <div
                className="p-3 m-2 rounded-2xl
              max-w-xs bg-gradient-to-r from-emerald-600
              to-indigo-600 text-white"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="animate-spin w-4 h-4
                border-2 border-white/30 border-t-white
                rounded-full"
                  ></div>
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messageEndRef}></div>
          </div>

          <div className="flex sm:flex-col gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={
                aiReady ? "Type your message..." : "Waiting for AI to ready..."
              }
              className="flex-1 px-4 py-3 bg-gray-700/80
          border border-gray-600 rounded-2xl
          text-white placeholder-gray-400/90
          focus:outline-none focus:shadow-sky-400/80
          focus:ring-sky-500 transition duration-300
          disabled:opacity-50
          disabled:cursor-not-allowed"
            />
            <button
              onClick={sendMessage}
              disabled={!aiReady || isLoading || !inputValue.trim()}
              className="px-6 py-3 bg-gradient-to-r
          from-green-950 via-lime-700 to-green-900 hover:opacity-80
          text-white font-semibold rounded-2xl
          transition disabled:opacity-30
          disabled:cursor-not-allowed enabled:cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div
                    className="animate-spin w-4 h-4 border-2
                    border-white/30 border-t-white rounded-full"
                  ></div>
                  Sending
                </div>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
