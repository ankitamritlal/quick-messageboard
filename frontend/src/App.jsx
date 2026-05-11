import { useEffect, useState } from "react";

// API base URL
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Message bubble logo component - modern gradient version
 */
const MessageLogo = ({ className = "" }) => (
  <div className={`relative ${className}`}>
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="url(#logoGradient)"
      className="w-9 h-9"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" 
        clipRule="evenodd" 
      />
    </svg>
  </div>
);

/**
 * Loading spinner component
 */
const Spinner = () => (
  <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-2"></div>
);

/**
 * Empty state illustration
 */
const EmptyState = () => (
  <div className="p-8 text-center">
    <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:scale-105 transition-transform duration-300">
      <MessageLogo className="opacity-50" />
    </div>
    <p className="text-gray-600 font-semibold text-lg">No messages yet</p>
    <p className="text-gray-400 text-sm mt-1">Start the conversation!</p>
  </div>
);

/**
 * Main App component
 * A beautiful message board where users can send and view messages
 */
function App() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  // Maximum character limit
  const MAX_CHARS = 500;

  /**
   * Fetch messages from the backend API
   * Uses async/await for non-blocking API calls
   */
  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/messages`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Send a new message to the backend
   * Disables button while sending to prevent duplicate submissions
   */
  const sendMessage = async () => {
    if (!text.trim() || sending) return;
    
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text.trim() }),
      });
      
      if (!res.ok) throw new Error("Failed to send message");
      
      // Clear input and refresh messages
      setText("");
      await fetchMessages();
    } catch (err) {
      setError(err.message);
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  // Handle Enter key to send message
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);
  const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};


  // Calculate character counter color
  function getCharCountColor() {
    const ratio = text.length / MAX_CHARS;
    if (ratio > 0.9) return "text-red-500";
    if (ratio > 0.7) return "text-amber-500";
    return "text-gray-400";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 md:p-8">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Header with Logo */}
        <header className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-indigo-100/50 border border-white/50 p-5 flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30">
            <MessageLogo />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Quick Messages
            </h1>
            <p className="text-xs text-gray-400">Share your thoughts</p>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-1.5 bg-green-100 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-medium text-green-700">Live</span>
            </div>
          </div>
        </header>

        {/* Message Input Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-indigo-100/50 border border-white/50 p-5 mb-4">
          <div className="flex flex-col gap-3">
            <textarea
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl resize-none focus:outline-none focus:border-indigo-300 focus:bg-white transition-all duration-200 text-gray-700 placeholder-gray-400"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
              onKeyPress={handleKeyPress}
              placeholder="What's on your mind?"
              disabled={sending}
            />
            
            <div className="flex items-center justify-between">
              {/* Character counter */}
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium transition-colors ${getCharCountColor()}`}>
                  {text.length}
                </span>
                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-200 ${
                      text.length / MAX_CHARS > 0.9 ? 'bg-red-500' : 
                      text.length / MAX_CHARS > 0.7 ? 'bg-amber-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${(text.length / MAX_CHARS) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Send button */}
              <button
                onClick={sendMessage}
                disabled={!text.trim() || sending}
                className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 transform ${
                  text.trim() && !sending
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    Send
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-indigo-100/50 border border-white/50 overflow-hidden">
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border-b border-red-100 p-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600 text-sm">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="p-12 text-center">
              <Spinner />
              <p className="text-gray-500 mt-2">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            /* Empty state */
            <EmptyState />
          ) : (
            /* Messages list */
            <div className="divide-y divide-gray-100/50 max-h-96 overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className="p-4 hover:bg-indigo-50/50 transition-all duration-200 cursor-default group"
                  style={{
                    animationDelay: `${index * 30}ms`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 mt-0.5">
                      {message.text.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 whitespace-pre-wrap break-words group-hover:text-gray-900">
                        {message.text}
                      </p>
                      <p className="text-gray-400 text-xs mt-1.5 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDate(message.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-4">
          {messages.length} message{messages.length !== 1 ? 's' : ''} • Quick Messages Board
        </p>
      </div>
    </div>
  );
}

export default App;
