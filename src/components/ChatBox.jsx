import React, { useState, useRef, useEffect } from "react";
import { IoIosSend } from "react-icons/io";
import { IoEllipsisVertical } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { toggleChatBox } from "../utils/toggleSlice";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constant";

const ChatBox = ({ currentUser }) => {
  const otherUser = useSelector((store) => store?.toggle?.chatUser);
  const user = useSelector((store) => store.user);
  const toUserId = otherUser?._id;
  const userId = user?._id;
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isUserOnline, setIsUserOnline] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async (targetToUserId) => {
    if (!targetToUserId) return;

    try {
      const res = await axios.post(
        BASE_URL + "/getChat",
        { toUserId: targetToUserId },
        { withCredentials: true }
      );

      console.log("Fetching messages for user:", targetToUserId);
      const chatMessage = res?.data?.chat?.message.map((msg) => ({
        firstName: msg?.senderId?.firstName,
        id: msg?._id,
        text: msg?.text,
        timestamp: msg?.createdAt,
      }));

      setMessages(chatMessage || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset messages when otherUser changes
  useEffect(() => {
    if (toUserId) {
      setMessages([]);
      fetchMessages(toUserId);
      checkUserOnlineStatus(toUserId);
    }
  }, [toUserId]);

  // Socket connection for messages and online status
  useEffect(() => {
    if (!userId || !toUserId) return;

    const socket = createSocketConnection();

    // Mark current user as online
    socket.emit("userOnline", userId);

    // Join chat room
    socket.emit("joinChat", { userId, toUserId });

    // Listen for messages
    socket.on("messageReceived", (data) => {
      const transformedMessage = {
        firstName: data.senderId?.firstName || data.sender,
        id: data._id || `socket-${Date.now()}`,
        text: data.text,
        timestamp: data.createdAt || new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, transformedMessage]);
    });

    // Listen for user status changes
    socket.on("userStatusChanged", (data) => {
      if (data.userId === toUserId) {
        setIsUserOnline(data.isOnline);
        console.log(
          `User ${toUserId} is now ${data.isOnline ? "online" : "offline"}`
        );
      }
    });

    // Check initial online status
    socket.emit("checkUserOnline", toUserId);
    socket.on("userOnlineStatus", (data) => {
      if (data.userId === toUserId) {
        setIsUserOnline(data.isOnline);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, toUserId]);

  const checkUserOnlineStatus = (targetUserId) => {
    if (!targetUserId) return;

    const socket = createSocketConnection();
    socket.emit("checkUserOnline", targetUserId);
    socket.on("userOnlineStatus", (data) => {
      if (data.userId === targetUserId) {
        setIsUserOnline(data.isOnline);
      }
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !toUserId) return;

    const socket = createSocketConnection();

    setNewMessage("");

    socket.emit("sendMessage", {
      userId,
      toUserId,
      text: newMessage,
      sender: user?.firstName,
    });
  };

  const formatTime = (date) => {
    if (!date) return "Just now";
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return "Just now";
      return dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "Just now";
    }
  };

  const getStatusInfo = () => {
    if (isUserOnline) {
      return {
        text: "Online",
        color: "text-green-400",
        dot: "bg-green-400",
      };
    } else {
      return {
        text: "Offline",
        color: "text-gray-400",
        dot: "bg-gray-400",
      };
    }
  };

  const status = getStatusInfo();

  // Show loading state while switching users
  if (!otherUser) {
    return (
      <div className="flex flex-col pt-16 w-full lg:w-9/12 lg:max-h-8/12 h-screen bg-gray-900">
        <div className="flex items-center justify-center h-full text-gray-400">
          Select a user to start chatting
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pt-16 w-full lg:w-9/12 lg:max-h-8/12 h-screen overflow-y-scroll hide-scrollbar bg-gray-900 shadow-2xl border border-gray-700">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3.5 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => dispatch(toggleChatBox(false))}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {otherUser?.firstName?.charAt(0) || "U"}
            </span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">
              {otherUser?.firstName || "User"} {otherUser?.lastName || ""}
            </h3>
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${status.dot} animate-pulse`}
              ></div>
              <p className={`text-xs ${status.color}`}>{status.text}</p>
            </div>
          </div>
        </div>

        <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors">
          <IoEllipsisVertical size={20} />
        </button>
      </div>

      {/* Messages Container */}
      <div
        className="flex-1 overflow-y-auto hide-scrollbar
       p-4 space-y-4 bg-gradient-to-b from-gray-900 to-gray-800"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.firstName === user?.firstName
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl relative ${
                message.firstName === user?.firstName
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-none"
                  : "bg-gray-700 text-gray-100 rounded-bl-none"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <span
                className={`text-xs mt-1 block ${
                  message.firstName === user?.firstName
                    ? "text-purple-200"
                    : "text-gray-400"
                }`}
              >
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim() || !toUserId}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            <IoIosSend size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
