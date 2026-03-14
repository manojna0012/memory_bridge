import { MessageCircle, Send, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const FloatingAI = () => {

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "Hey, how may I help you?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  const messagesEndRef = useRef(null);

  // auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
  };

  const sendMessage = async () => {

  if (!message.trim()) return;

  const userMessage = message;

  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  // show user message
  setMessages(prev => [
    ...prev,
    { type: "user", text: userMessage, time },
    { type: "ai", text: "Thinking...", time }
  ]);

  setMessage("");

  try {

    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await res.json();

    const aiTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    // replace "Thinking..." with real reply
    setMessages(prev => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        type: "ai",
        text: data.reply,
        time: aiTime
      };
      return updated;
    });

    speak(data.reply);

  } catch (error) {

    setMessages(prev => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        type: "ai",
        text: "Sorry, backend not responding.",
        time
      };
      return updated;
    });

  }

};

  return (
    <>
      {/* Floating Button */}

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 translate-x-40 bg-primary text-white p-4 rounded-full shadow-card z-50"
      >
        <MessageCircle size={20} />
      </button>

      {/* Chat Window */}

      {open && (

        <div className="fixed bottom-40 left-1/2 -translate-x-1/4 translate-x-30 w-72 bg-card border border-border rounded-2xl shadow-card z-50 flex flex-col overflow-hidden">

          {/* Header */}

          <div className="flex items-center justify-between px-4 py-3 bg-primary text-white">

            <span className="text-sm font-medium">
              MemoryBridge AI
            </span>

            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>

          </div>

          {/* Messages */}

          <div className="flex-1 p-3 space-y-2 max-h-60 overflow-y-auto bg-background">

            {messages.map((m, i) => (

              <div
                key={i}
                className={`flex ${m.type === "user" ? "justify-end" : "justify-start"}`}
              >

                <div
                  className={`px-3 py-2 rounded-xl text-xs max-w-[70%]
                  ${m.type === "user"
                      ? "bg-primary text-white"
                      : "bg-muted text-foreground"
                    }`}
                >

                  <p>{m.text}</p>

                  <span className="block text-[10px] opacity-70 mt-1">
                    {m.time}
                  </span>

                </div>

              </div>

            ))}

            <div ref={messagesEndRef} />

          </div>

          {/* Input */}

          <div className="flex border-t border-border bg-card">

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 text-sm outline-none bg-transparent"
            />

            <button
              onClick={sendMessage}
              className="px-3 text-primary"
            >
              <Send size={18} />
            </button>

          </div>

        </div>

      )}

    </>
  );
};

export default FloatingAI;