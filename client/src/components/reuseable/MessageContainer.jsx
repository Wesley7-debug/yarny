import { useEffect, useRef } from "react";
import messageStore from "../../store/messageStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import ChatSkeleton from "./skeletons/ChatSkeleton";

const MessageContainer = () => {
  const {
    selectedUser,
    messages,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
    isGettingConversation,
  } = messageStore();
  console.log("Fetched messages:", messages);

  const currentUserId = selectedUser?._id;
  const bottomRef = useRef(null); // ⬅️ Ref to scroll to bottom

  // Fetch messages on user change
  useEffect(() => {
    if (currentUserId) {
      getMessages(currentUserId);
    }
  }, [currentUserId, getMessages]);

  // Subscribe to socket messages
  useEffect(() => {
    if (!selectedUser) return;

    subscribeToMessages();
    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser, subscribeToMessages, unsubscribeFromMessages]);

  // Auto scroll when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4">
        {isGettingConversation ? (
          <ChatSkeleton />
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg) => {
            const isFromSelectedUser = msg.userId === currentUserId;

            return (
              <div
                key={msg.id || msg._id || `${msg.userId}-${msg.time}`}
                className={`chat ${
                  isFromSelectedUser ? "chat-end" : "chat-start"
                }`}
              >
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img src={msg.avatarUrl} alt={`${msg.nickname} avatar`} />
                  </div>
                </div>

                <div className="chat-header">
                  {msg.nickname}
                  <time className="text-xs opacity-50 ml-2">{msg.time}</time>
                </div>

                <div className="chat-bubble">{msg.text}</div>

                <div className="chat-footer opacity-50">{msg.status}</div>
              </div>
            );
          })
        )}

        {/* Scroll target */}
        <div ref={bottomRef} />
      </div>

      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-fit">
        <MessageInput />
      </div>
    </div>
  );
};

export default MessageContainer;
