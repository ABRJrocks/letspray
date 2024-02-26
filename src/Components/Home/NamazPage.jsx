import React, { useState, useRef, useEffect } from "react";
import { auth, db } from "../../Firebase/firebase";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import Header from "../Home/Header";

const Chat = () => {
  const [inputs, setInputs] = useState("");
  const [messages, setMessages] = useState([]);
  const endOfMessages = useRef(null);
  const { currentUser } = auth;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "messages"), orderBy("timestamp", "asc")),
      (querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => {
          const messageData = doc.data();
          return {
            ...messageData,
            id: doc.id,
            isUser: messageData.user.uid === currentUser.uid,
          };
        });
        setMessages(messages);
      }
    );

    return () => unsubscribe();
  }, [currentUser.uid]);

  useEffect(() => {
    if (endOfMessages.current) {
      endOfMessages.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    const inputValue = inputs.trim();
    if (!inputValue) return;

    try {
      const { uid, email } = auth.currentUser;
      const name = currentUser.displayName; // You can replace this with the actual username

      await addDoc(collection(db, "messages"), {
        text: inputValue,
        timestamp: Timestamp.fromDate(new Date()),
        user: { uid, name, email },
      });

      setInputs(""); // Clear input after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setInputs(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getTimeString = (timestamp) => {
    if (!timestamp) return ""; // Return an empty string if timestamp is not available

    const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

    return `${formattedHours}:${minutes} ${ampm}`;
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-8">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start mb-4 ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${
                    message.isUser
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-800"
                  } p-3 rounded-lg max-w-md`}
                >
                  <div className="text-sm font-semibold mb-1">
                    {message.user.name}
                  </div>
                  {message.text}
                  <div
                    className={`text-xs mt-1 ${
                      message.isUser ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {getTimeString(message.timestamp)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No messages yet. Start chatting!</p>
          )}
          <div ref={endOfMessages} />
        </div>
      </div>
      <div className="p-4 border-t flex items-center bg-white">
        <textarea
          className="flex-1 p-2 mr-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Type your message..."
          value={inputs}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={handleSend}
          className="w-20 h-10 bg-blue-500 text-white rounded-md flex items-center justify-center hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
