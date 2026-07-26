import logo from './logo.svg';
import './App.css';
import {useState} from 'react'

function App() {

  const [message, setMessage] = useState("")
  const [previous_interaction_id, setPreviousInteractionId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [conversation, setConversation] = useState([]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo"></div>
        <button className="new-brief-btn" onClick={() => {
          setConversation([]);
          setPreviousInteractionId(null);
          setMessage("");
          setError(null);
        }}>+ New Brief</button>
      </aside>

      <div className="center-panel">
        <div className="app-header">
          <div className="logo-mark"></div>
          <h1>Angle</h1>
        </div>

        <div className="conversation-area">
          {error && <p style={{color: "red"}}>{error}</p>}

          {conversation.map((entry, index) => (
  <div key={index} className="message-group">
    <div className="bubble user-bubble">{entry.userMessage}</div>

    {entry.brief && (
      <div className="bubble assistant-bubble">{entry.brief.full_brief}</div>
    )}
    {entry.plainAnswer && (
      <div className="bubble assistant-bubble">{entry.plainAnswer}</div>
    )}
  </div>
))}
        </div>

        <div className="input-bar">
        <textarea 
  value={message} 
  onChange={(e) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }}
  rows={1}
></textarea>

          <button onClick={ async () => {
            setLoading(true)
            setError(null)

            try {
              const res = await fetch("http://127.0.0.1:8000/strategy", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({message: message, previous_interaction_id: previous_interaction_id}),
              });

              const data = await res.json();
              console.log(data)

              let brief = null;
              let plainAnswer = null;

              try {
                brief = JSON.parse(data.response);
              } catch {
                plainAnswer = data.response;
              }

              console.log("brief:", brief)
              console.log("plainAnswer: ", plainAnswer)

              setPreviousInteractionId(data.interaction_id)

              const newEntry = { userMessage: message, brief: brief, plainAnswer: plainAnswer };
              setConversation([...conversation, newEntry]);
              setMessage("")

            } catch (err) {
              console.log(err)
              setError(err.message)
            }

            setLoading(false)
          } }>{loading ? "···" : "↑"}</button>
        </div>
      </div>
    </div>
  );
}

export default App;