import logo from './logo.svg';
import './App.css';
import {useState} from 'react'

function App() {
  
  const [message, setMessage] = useState("")
  const [response, setResponse] = useState("")
  const [previous_interaction_id, setPreviousInteractionId] = useState(null)



  
  return (
    <div>
      <h1>Content Brief Tool</h1>
      
      <textarea value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
    
      <p>{message}</p>
      <button onClick={ async () =>{
        const res = await fetch("http://127.0.0.1:8000/strategy", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({message: message, previous_interaction_id: previous_interaction_id}),
        });
        
        const data = await res.json();
        console.log(data)


      } }>Submit</button>
    </div>
  );
}

export default App;
