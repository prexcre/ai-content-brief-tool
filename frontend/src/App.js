import logo from './logo.svg';
import './App.css';
import {useState} from 'react'

function App() {
  
  const [message, setMessage] = useState("")
  const [response, setResponse] = useState("")
  const [previous_interaction_id, setPreviousInteractionId] = useState(null)
  const [loading, setLoading] = useState(false)



  
  return (
    <div>
      <h1>Content Strategy Tool</h1>
      
      <textarea value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
    
      <p>{message}</p>
      <button onClick={ async () =>{
        setLoading(true)



        const res = await fetch("http://127.0.0.1:8000/strategy", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({message: message, previous_interaction_id: previous_interaction_id}),
        });
        
        const data = await res.json();
        console.log(data)

        const parsedStrategy = JSON.parse(data.response);
        console.log(parsedStrategy)

        setResponse(parsedStrategy)
        setLoading(false)




      } }>{loading ? "Generating...": "Submit"}</button>

      {response && (
        <div>
          <h2>Target Audience</h2>
          <p>{response.target_audience}</p>

          <h2>Best Platform</h2>
          <p>{response.best_platform}</p>

          <h2>Posting Frequency</h2>
          <p>{response.posting_frequency}</p>

          <h2>Content Angles</h2>
          <p>{response.content_angles}</p>

          <h2>Full Brief</h2>
          <p>{response.full_brief}</p>
         </div> 
      )}





    </div>
  );
}

export default App;
