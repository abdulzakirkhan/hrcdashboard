"use client";

import { useGetAllChatsQuery } from "@/redux/chat/chatApi";
import React, { useState } from "react";
import { FaPaperclip, FaMicrophone, FaTelegramPlane } from "react-icons/fa"; // Import icons
import { useSelector } from "react-redux";

const ChatPage = () => {

  const user = useSelector((state) => state.auth?.user);
  const [page, setPage] = useState(0);
  // State to manage the message input and chat history
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { sender: "Customer", content: "Hello, I need help with my order.", date: "2025-01-20 11:17:03" },
    { sender: "Support", content: "Sure, I'd be happy to assist you. What seems to be the problem?", date: "2025-01-20 11:17:03" },
    { sender: "Customer", content: "I haven't received my item yet.", date: "2025-01-20 11:17:03" },
    { sender: "Support", content: "Let me check your order status.", date: "2025-01-20 11:17:03" },
  ]);

  
  const {
    data: getAllChats,
    isLoading: getAllChatLoading,
    refetch: getAllChatsReftech,
    isFetching: getAllChatsFeching,
  } = useGetAllChatsQuery({
    id: user?.userid,
    page,
  });

  // Handle new message input
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // Add a new message to the chat
  const handleSendMessage = () => {
    if (message.trim() === "") return; // Prevent empty messages
    setMessages([...messages, { sender: "Customer", content: message, date: new Date().toLocaleString() }]);
    setMessage(""); // Clear input field
  };


  console.log("getAllChats :",getAllChats)

  return (
    <>
      <section className="mt-20">
        {/* Header */}
        <div className="bg-[#4B67DB] fixed w-full top-[75px] z-10">
          <div className="container mx-auto px-6 py-2">
            <h2 className="text-white">Customer Support</h2>
          </div>
        </div>

        {/* Chat container */}
        <div className="container mt-28 md:mt-14 mx-auto md:px-6">
          {/* Messages container */}
          <div className="messagesContainer flex flex-col overflow-y-auto h-[60vh] py-10">
            {messages.map((msg, index) => (
              <div key={index} className="mb-4">
                <div className={`flex ${msg.sender === "Customer" ? "justify-start" : "justify-end"}`}>
                  <div className={`p-3 max-w-[60%] rounded-lg ${msg.sender === "Customer" ? "bg-blue-100" : "bg-gray-100"}`}>
                    <p>{msg.content}</p>
                  </div>
                </div>
                <p className={`text-xs ${msg.sender === "Customer" ? "text-blue-500 text-start" : "text-gray-500 text-end"} mt-1`}>
                  {msg.date}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Input area fixed at the bottom */}
        <div className="fixed bottom-0 w-full lg:w-[calc(100%-208px)] bg-white py-4 border-t-2">
          <div className="flex w-full items-center gap-3 pe-8">
            <button className="bg-primary py-2 px-3 rounded-lg text-white">
              <FaPaperclip className="text-2xl cursor-pointer" />
            </button>
            <input
              type="text"
              value={message}
              onChange={handleMessageChange}
              placeholder="Type a message..."
              className="w-1/2 md:w-[73%] p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-primary py-2 px-3 rounded-lg text-white">
              <FaMicrophone className="text-2xl cursor-pointer" />
            </button>
            <button className="bg-primary flex items-center gap-2 px-6 py-2 rounded-lg text-white" onClick={handleSendMessage}>
              Send
              <FaTelegramPlane className="text-2xl cursor-pointer" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChatPage;
