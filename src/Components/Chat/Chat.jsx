import React, { useState, useRef, useEffect } from "react";
import { auth, db } from "../../Firebase/firebase";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

const Chat = () => {
  const [inputs, setInputs] = useState({});
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const endOfMessages = useRef(null);
  const { currentUser } = auth;

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map((doc) => {
        const messageData = doc.data();
        return {
          ...messageData,
          id: doc.id,
          username: messageData.user.username,
          user: {
            ...messageData.user,
            email: getEmailFromUID(messageData.user.uid),
          },
          isUser: messageData.user.uid === currentUser.uid,
        };
      });
      setMessages(messages);
    });

    return () => unsubscribe();
  }, [currentUser.uid]);

  useEffect(() => {
    // Fetch all users from the "users" collection
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = [];
      snapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersData);
    });

    return () => unsubscribeUsers();
  }, []);

  const handleSend = async () => {
    const inputValue = inputs.trim();
    if (!inputValue) return;

    try {
      const { uid, email } = auth.currentUser;
      const name = "Anonymous"; // You can replace this with the actual username

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

  const getEmailFromUID = (uid) => {
    // Implement this function if needed
    return "";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 h-screen bg-white p-4 border-r overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id} className="mb-2">
              {user.username}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat section */}
      <div className="w-3/4 flex flex-col h-screen overflow-hidden">
        {messages.length > 0 ? (
          <div className="flex-1 overflow-y-auto p-8">
            {messages.map((message, index) => (
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
                  {message.isUser && currentUser.email && (
                    <div className="text-sm font-semibold mt-1 text-white">
                      {message.name} {/* Update to display username */}
                    </div>
                  )}
                  {!message.isUser && (
                    <div className="text-sm font-semibold mt-1 text-gray-700">
                      {message.name} {/* Update to display username */}
                    </div>
                  )}
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
            ))}

            <div ref={endOfMessages} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">No messages yet. Start chatting!</p>
          </div>
        )}

        {/* Message input */}
        <div className="h-20 p-4 border-t flex items-center bg-white">
          <textarea
            className="flex-1 p-2 mr-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Type your message..."
            value={inputs}
            onChange={(e) => setInputs(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
