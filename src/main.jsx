import React, { useState } from "react";
import ReactDOM from "react-dom/client";

const API_URL = "http://localhost:8000/ask";

function Message({ msg }) {
  const baseStyle = { margin: "10px 0" };
  const textColor = msg.taskType === "error" ? "red" : "#222";

  if (msg.role === "user") {
    return (
      <div style={{ ...baseStyle, textAlign: "right", color: "#297" }}>
        <b>Вы:</b> {msg.content}
      </div>
    );
  }

  return (
    <div style={{ ...baseStyle, textAlign: "left", color: textColor }}>
      <b>
        AI{msg.taskType === "error" ? " (ошибка)" : ""}
        {msg.taskType === "technical_param" ? ":" : ""}
      </b>
      <div style={{ whiteSpace: "pre-wrap", marginTop: 4 }}>
        {msg.content}
      </div>
  {msg.links && msg.links.length > 0 && (
  <div style={{ marginTop: 12 }}>
    <b>Ссылки на товары:</b>
    <div style={{ marginTop: 4 }}>
      {msg.links.map((link, index) => (
        <div key={index} style={{ marginTop: 4 }}>
          <a href={link} target="_blank" rel="noopener noreferrer">
            {link}
          </a>
        </div>
      ))}
    </div>
  </div>
)}

{msg.comp_links && msg.comp_links.length > 0 && (
  <div style={{ marginTop: 12 }}>
    <b>Ссылка для сравнения:</b>
    <div style={{ marginTop: 4 }}>
      {msg.comp_links.map((link_b, index) => (
        <div key={index} style={{ marginTop: 4 }}>
          <a href={link_b} target="_blank" rel="noopener noreferrer">
            {link_b}
          </a>
        </div>
      ))}
    </div>
  </div>
)}

    </div>
  );
}

function App() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!question.trim()) return;

    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setQuestion("");

    try {
      const resp = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await resp.json();
      console.log("Ответ от сервера:", data);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || "Нет ответа",
          taskType: data.task_type || "default",
          links: data.links || [],
          comp_links: data.comp_links || [],
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Ошибка связи с сервером.", taskType: "error" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "2rem auto",
        fontFamily: "system-ui, sans-serif",
        background: "#f8fafb",
        borderRadius: 12,
        padding: 24,
        boxShadow: "0 2px 16px #0001",
      }}
    >
      <h1 style={{ textAlign: "center", marginTop: 0 }}>AI Phone Adviser</h1>
      <div
        style={{
          border: "1px solid #ddd",
          minHeight: 320,
          padding: 10,
          borderRadius: 8,
          background: "#fff",
          marginBottom: 12,
          fontSize: "1.08em",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, i) => (
          <Message key={i} msg={msg} />
        ))}
        {loading && <div style={{ color: "#888" }}>AI печатает...</div>}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
          style={{
            flex: 1,
            padding: 10,
            fontSize: 16,
            border: "1px solid #bbb",
            borderRadius: 5,
          }}
          placeholder="Спросите про смартфон..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          autoFocus
        />
        <button
          onClick={handleSend}
          disabled={loading || !question.trim()}
          style={{
            padding: "0 20px",
            fontSize: 16,
            background: "#4fb783",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          Отправить
        </button>
      </div>
      <div
        style={{
          marginTop: 24,
          fontSize: 13,
          color: "#888",
          textAlign: "center",
        }}
      >
        Powered by AI & FastAPI.{" "}
        <a
          href="https://github.com/egorchecpc/onliner-again"
          target="_blank"
          rel="noopener noreferrer"
        >
          Inspired by Banko AI
        </a>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
