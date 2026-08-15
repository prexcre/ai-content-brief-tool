import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function App() {

  const [message, setMessage] = useState("")
  const [previous_interaction_id, setPreviousInteractionId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState("");
  const [error, setError] = useState(null)
  const [conversation, setConversation] = useState([]);
  const [savedBriefs, setSavedBriefs] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [session, setSession] = useState(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const loadingMessages = [
    "Scanning what's working right now...",
    "Studying your niche...",
    "Mapping out the best angle...",
    "Checking platform trends...",
    "Sharpening the strategy...",
    "Looking at what similar creators are doing...",
    "Weighing a few different hooks...",
    "Zeroing in on your audience...",
  ];

  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  const loadBriefs = async () => {
    const { data, error } = await supabase
      .from('briefs')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.log("Load error:", error);
    } else {
      const loadedConversation = data.map((row) => ({
        userMessage: row.user_message,
        timestamp: row.created_at,
        brief: {
          target_audience: row.target_audience,
          best_platform: row.best_platform,
          posting_frequency: row.posting_frequency,
          content_angles: row.content_angles,
          full_brief: row.full_brief,
        },
        plainAnswer: null,
      }));
      setConversation(loadedConversation);
      setSavedBriefs(loadedConversation);
    }
  };

  useEffect(() => {
    if (session) {
      loadBriefs();
    }
  }, [session]);

  useEffect(() => {
    let interval;
    if (loading) {
      const shuffled = [...loadingMessages].sort(() => Math.random() - 0.5);
      let i = 0;
      setLoadingText(shuffled[0]);
      interval = setInterval(() => {
        i = (i + 1) % shuffled.length;
        setLoadingText(shuffled[i]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: authEmail,
      password: authPassword,
    });
    if (error) {
      setError(error.message);
    } else {
      console.log("Signed up:", data);
    }
  };

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });
    if (error) {
      setError(error.message);
    } else {
      setSession(data.session);
    }
  };

  const handleForgotPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(authEmail);
    if (error) {
      setError(error.message);
    } else {
      setResetSent(true);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setConversation([]);
    setSavedBriefs([]);
  };

  return (
    <>
      {!session ? (
        <div className="auth-container">
          <div className="auth-card">
            <div className="logo-mark"></div>
            <h1>Angle</h1>
            <p className="auth-subtitle">Your content strategy, remembered.</p>

            {!showForgotPassword ? (
              <>
                <input
                  type="email"
                  placeholder="Email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                />
                <button className="auth-primary-btn" onClick={handleSignIn}>Sign In</button>
                <button className="auth-secondary-btn" onClick={handleSignUp}>Create Account</button>
                <button className="auth-link-btn" onClick={() => setShowForgotPassword(true)}>
                  Forgot password?
                </button>
              </>
            ) : (
              <>
                {!resetSent ? (
                  <>
                    <input
                      type="email"
                      placeholder="Email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                    />
                    <button className="auth-primary-btn" onClick={handleForgotPassword}>
                      Send Reset Link
                    </button>
                  </>
                ) : (
                  <p className="auth-subtitle">Check your email for a reset link.</p>
                )}
                <button className="auth-link-btn" onClick={() => {
                  setShowForgotPassword(false);
                  setResetSent(false);
                }}>
                  Back to sign in
                </button>
              </>
            )}

            {error && <p style={{color: "red"}}>{error}</p>}
          </div>
        </div>
      ) : (
        <div className="app-shell">
          <aside className="sidebar">
            <div className="sidebar-top">
              <div className="logo"></div>
              <button className="new-brief-btn" onClick={() => {
                setConversation([]);
                setPreviousInteractionId(null);
                setMessage("");
                setError(null);
              }}>+ New Brief</button>
            </div>

            <div className="sidebar-section">
              <span className="sidebar-section-title">History</span>
              <div className="history-list">
                {savedBriefs.length === 0 && (
                  <p className="sidebar-empty">No briefs yet</p>
                )}
                {savedBriefs.map((entry, index) => (
                  <button
                    key={index}
                    className="history-item"
                    onClick={() => {
                      setConversation([entry]);
                      setError(null);
                    }}
                  >
                    {entry.userMessage.slice(0, 40)}{entry.userMessage.length > 40 ? "..." : ""}
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-footer">
              <span className="sidebar-email">{session.user.email}</span>
              <button className="auth-link-btn" onClick={handleSignOut}>Sign Out</button>
            </div>
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
                  <span className="message-timestamp">{formatTimestamp(entry.timestamp)}</span>
                  <div className="bubble user-bubble">{entry.userMessage}</div>

                  {entry.brief && (
                    <div className="brief-card">
                      <div className="brief-field">
                        <span className="brief-label">Target Audience</span>
                        <p>{entry.brief.target_audience}</p>
                      </div>
                      <div className="brief-field">
                        <span className="brief-label">Best Platform</span>
                        <p>{entry.brief.best_platform}</p>
                      </div>
                      <div className="brief-field">
                        <span className="brief-label">Posting Frequency</span>
                        <p>{entry.brief.posting_frequency}</p>
                      </div>
                      <div className="brief-field">
                        <span className="brief-label">Content Angles</span>
                        <p>{entry.brief.content_angles}</p>
                      </div>
                      <div className="brief-field brief-field-full">
                        <span className="brief-label">Full Brief</span>
                        <p>{entry.brief.full_brief}</p>
                      </div>
                      <button
                        className="save-brief-btn"
                        onClick={() => {
                          const text = `Target Audience: ${entry.brief.target_audience}\n\nBest Platform: ${entry.brief.best_platform}\n\nPosting Frequency: ${entry.brief.posting_frequency}\n\nContent Angles: ${entry.brief.content_angles}\n\nFull Brief:\n${entry.brief.full_brief}`;
                          navigator.clipboard.writeText(text);
                          setCopiedIndex(index);
                          setTimeout(() => setCopiedIndex(null), 2000);
                        }}
                      >
                        {copiedIndex === index ? "Copied!" : "Copy Brief"}
                      </button>
                    </div>
                  )}
                  {entry.plainAnswer && (
                    <div className="bubble assistant-bubble">{entry.plainAnswer}</div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="message-group">
                  <div className="bubble assistant-bubble typing-indicator">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="typing-text">{loadingText}</span>
                  </div>
                </div>
              )}
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
                placeholder="Tell me about your content goals, niche, and current stats..."
              ></textarea>

              <button onClick={async () => {
                setLoading(true)
                setError(null)

                try {
                  const res = await fetch("http://127.0.0.1:8000/strategy", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: message, previous_interaction_id: previous_interaction_id }),
                  });

                  const data = await res.json();

                  let brief = null;
                  let plainAnswer = null;

                  try {
                    brief = JSON.parse(data.response);
                  } catch {
                    plainAnswer = data.response;
                  }

                  setPreviousInteractionId(data.interaction_id)

                  const newEntry = { userMessage: message, brief: brief, plainAnswer: plainAnswer, timestamp: new Date().toISOString() };

                  if (brief) {
                    const { error: insertError } = await supabase.from('briefs').insert({
                      user_id: session.user.id,
                      user_message: message,
                      target_audience: brief.target_audience,
                      best_platform: brief.best_platform,
                      posting_frequency: brief.posting_frequency,
                      content_angles: brief.content_angles,
                      full_brief: brief.full_brief,
                    });
                    if (insertError) {
                      console.log("Insert error:", insertError);
                    } else {
                      setSavedBriefs([...savedBriefs, newEntry]);
                    }
                  }

                  setConversation([...conversation, newEntry]);
                  setMessage("")

                } catch (err) {
                  console.log(err)
                  setError(err.message)
                }

                setLoading(false)
              }}>{loading ? "···" : "↑"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;