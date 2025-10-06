import React from "react";
import { UserCircle, Send } from "lucide-react"; // ✅ Lucide icons
import GroupChatHeader from "./GroupChatHeader";
import useGroupStore from "../../store/groupStore";
import MessageInput from "./MessageInput";

const dummyMessages = [
  {
    _id: "m1",
    sender: { _id: "u1", username: "Alice" },
    content: "Hey team, ready for the standup?",
    createdAt: "2025-10-05T10:00:00Z",
  },
  {
    _id: "m2",
    sender: { _id: "u2", username: "Bob" },
    content: "Yep! Just finishing up a PR.",
    createdAt: "2025-10-05T10:01:00Z",
  },
  {
    _id: "m3",
    sender: { _id: "u3", username: "Charlie" },
    content: "Same here, running tests.",
    createdAt: "2025-10-05T10:02:00Z",
  },
];

function GroupChatMessageContainer() {
  const { selectedGroup, setSelectedGroup } = useGroupStore();
  return (
    <div className="flex flex-col w-full h-full bg-base-200 rounded-lg overflow-hidden">
      {/* Group Header */}
      <GroupChatHeader
        selectedGroup={selectedGroup}
        onClose={() => setSelectedGroup(null)}
      />
      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {dummyMessages.map((msg) => (
          <div key={msg._id} className="flex items-start space-x-2">
            <UserCircle className="text-gray-500 w-6 h-6" />
            <div className="bg-base-100 p-2 rounded-lg max-w-sm">
              <div className="text-sm font-semibold">{msg.sender.username}</div>
              <div className="text-sm">{msg.content}</div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
}

export default GroupChatMessageContainer;
