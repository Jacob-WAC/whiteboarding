import React, { useState, useEffect } from "react";
import io from "socket.io-client";
function Chat(props) {
    const { message, setMessage } = props;
    const { messages, setMessages } = props;
    const [socket] = useState(() => io(":8000"));

    const onSubmitHandler = (e) => {
        e.preventDefault();
        socket.emit("message", message);
        setMessage("");
    };

    // socket stuff ########################
    useEffect(() => {
        console.log("hewwo!!!");
        socket.on("send msg", (msg) => {
            setMessages((prevmsg) => {
                return [...prevmsg, msg];
            });
        });
        return () => socket.disconnect(true);
    }, [socket]);
    // ###############################

    return (
        <div className="border ">
            <div className="">
                <h1>Class Chat</h1>
            </div>
            <div className="">
                {messages.map((msgs, i) => (
                    <p className="m-3" key={i}>
                        {msgs}
                    </p>
                ))}
            </div>
            <div>
                <form
                    onSubmit={onSubmitHandler}
                    className="d-flex justify-content-center"
                >
                    <div className="form-group ">
                        <input
                            className="form-control "
                            type="text"
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                        />
                    </div>
                    <div className="form-group ">
                        <input
                            className="btn btn-success ms-3"
                            value="Send Message"
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Chat;
