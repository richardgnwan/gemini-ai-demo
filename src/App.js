import React, { useState } from "react";

const App = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistories, setChatHistories] = useState([]);

  const surpriseOptions = [
    "Who won the latest world cup?",
    "What is the capital of France?",
    "When is christmas?",
  ];

  const handleSurprise = () => {
    const randomIndex = Math.floor(Math.random() * surpriseOptions.length);
    setValue(surpriseOptions[randomIndex]);
  };

  // get response from the server
  const getResponse = async () => {
    if (!value) {
      setError("Please enter a question");
      return;
    }

    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          history: chatHistories,
          message: value,
        }),
      };
      setValue("");
      const response = await fetch(`http://localhost:8000/chat`, options);
      const data = await response.text();

      console.log("data", data);
      if (data) {
        setChatHistories((prevHistory) => [
          ...prevHistory,
          { role: "model", parts: data },
        ]);
        setError("");
      }
    } catch (error) {
      setError("Something went wrong, please try again later.");
      return;
    }
  };

  const submit = () => {
    setChatHistories([...chatHistories, { role: "user", parts: value }]);
    setError("");
    getResponse();
  };

  const clearHistory = () => {
    setChatHistories([]);
    setError("");
    setValue("");
  };

  return (
    <div className="app">
      <p>
        What do you want to know?{" "}
        <button
          className="surprise"
          onClick={handleSurprise}
          disabled={!chatHistories}
        >
          Surprise me!
        </button>
      </p>
      <div className="input-container">
        
        {/* Add on enter event, that will trigger submit */}
        <input
          type="text"
          placeholder="When is christmas"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              submit();
              e.target.blur();
            }
          }}
        />
        {!error && <button onClick={submit}>Ask me</button>}
        {error && <button onClick={clearHistory}>Clear</button>}
      </div>
      {error && <p className="error">{error}</p>}
      <div className="search-result">
        {chatHistories.map((history, index) => (
          <div key={index}>
            <p className="answer">
              {history.role}: {history.parts}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
