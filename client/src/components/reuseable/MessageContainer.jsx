import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";

const MessageContainer = ({ user, onlineUsers, setSelectedUser }) => {
  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader
        selectedUser={user}
        onlineUsers={onlineUsers}
        setSelectedUser={setSelectedUser}
      />

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="text-zinc-400 italic">Chat with {user.fullName}...</div>
      </div>

      <MessageInput />
    </div>
  );
};

export default MessageContainer;
