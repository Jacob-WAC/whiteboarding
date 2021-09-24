import React, { useState, useEffect } from "react";

import "./App.css";
import Chat from "./components/Chat";
import Canvas from "./components/Canvas";

function App(props) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    return (
        <div className="App  container-fluid d-flex justify-content-center gap-5">
            <Canvas />
            <Chat
                message={message}
                setMessage={setMessage}
                messages={messages}
                setMessages={setMessages}
            />
        </div>
    );
}

export default App;
