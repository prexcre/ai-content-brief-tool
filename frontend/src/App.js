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
    <div className="app-container">
      <div className="app-header">
        <h1>Content Strategy Tool</h1>
      </div>

      <div className="conversation-area">
        {error && <p style={{color: "red"}}>{error}</p>}

        {conversation.map((entry, index) => (
          <div key={index}>
            <p><strong>You:</strong> {entry.userMessage}</p>
            {entry.brief && <p><strong>Brief:</strong> {entry.brief.full_brief}</p>}
            {entry.plainAnswer && <p><strong>Answer:</strong> {entry.plainAnswer}</p>}
          </div>
        ))}
      </div>

      <div className="input-bar">
        <textarea value={message} onChange={(e) => setMessage(e.target.value)}></textarea>

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
        } }>{loading ? "Generating...": "Submit"}</button>
      </div>
    </div>
  );
}

export default App;