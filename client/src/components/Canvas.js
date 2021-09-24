import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import styles from "./canvas.module.css";
function Canvas(props) {
    const [socket] = useState(() => io(":8000"));

    // socket stuff ########################
    useEffect(() => {
        console.log("hewwo!!!");
        socket.on("startDraw", (data) => {
            console.log("start drawing!");
            var offsetX = data[0];
            var offsetY = data[1];
            contextRef.current.beginPath();
            contextRef.current.moveTo(offsetX, offsetY);
            setIsDrawing(true);
        });
        socket.on("drawing", (data) => {
            console.log("drawing");

            var offsetX = data[0];
            var offsetY = data[1];

            contextRef.current.lineTo(offsetX, offsetY);
            contextRef.current.stroke();
        });
        socket.on("endDraw", (data) => {
            console.log("end drawing");
            contextRef.current.closePath();
            setIsDrawing(false);
        });
        socket.on("clear", (data) => {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height);
        });
        return () => socket.disconnect(true);
    }, [socket]);
    // ###############################

    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const canvasDiv = useRef(null);

    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth - 500;
        canvas.height = window.innerHeight - 200;

        const context = canvas.getContext("2d");

        context.line = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;
        contextRef.current = context;
    }, []);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
        socket.emit("startDraw", [offsetX, offsetY, true]);
    };

    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
        socket.emit("endDraw", false);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) {
            return;
        }

        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        socket.emit("draw", [offsetX, offsetY]);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        socket.emit("clear", "clear it out");
    };

    return (
        <div ref={canvasDiv} className=" d-flex flex-column ">
            <canvas
                className="mt-3 {styles.canvas}"
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                ref={canvasRef}
            ></canvas>
            <button
                className="btn btn-success w-25 mb-3 mt-2"
                onClick={clearCanvas}
            >
                Clear
            </button>
        </div>
    );
}

export default Canvas;
