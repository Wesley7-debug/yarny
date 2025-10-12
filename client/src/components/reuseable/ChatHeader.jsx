import {
  PhoneCallIcon,
  PlusCircle,
  UserMinusIcon,
  VideoIcon,
  X,
  EllipsisVertical,
  PhoneIncoming,
  Phone,
  ArrowLeft,
  UserMinus2Icon,
  Palette,
} from "lucide-react";
import Dropdown from "../ui/Dropdown";
import { Link } from "react-router-dom";
import messageStore from "../../store/messageStore";
import friendsStore from "../../store/friendsStore";
import { useEffect } from "react";
import useAuthStore from "../../store/authStore";
import useTypingStore from "../../store/typingStore";
import useCallStore from "../../store/useCallStore";
import CallScreen from "./CallScreen";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, conversationId } = messageStore();
  const { callUser, setCalleeUser, setShowCallScreen, setCallType } =
    useCallStore();

  const handleCall = (type = "video") => {
    setCallType(type);
    setCalleeUser(selectedUser);
    setShowCallScreen(true);
    callUser();
  };

  const { onlineUsersId } = friendsStore();
  const { socket } = useAuthStore();

  const typingInfo = useTypingStore((state) => state.typingInfo);
  const setTypingInfo = useTypingStore((state) => state.setTypingInfo);
  const clearTypingInfo = useTypingStore((state) => state.clearTypingInfo);
  useEffect(() => {
    console.log("socket:", socket);
    if (!socket) return;

    const logAllTyping = (data) => {
      console.log("Received userTyping event (global listener)", data);
    };

    socket.on("userTyping", logAllTyping);

    return () => {
      socket.off("userTyping", logAllTyping);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !selectedUser || !conversationId) return;
    console.log("Attaching typing listeners", {
      socketId: socket.id,
      selectedUser,
      conversationId,
    });
    socket.emit("joinConversation", conversationId);
    console.log("Joined conversation room:", conversationId);

    const handleTyping = ({ userId, conversationId: incomingConvId }) => {
      console.log("handleTyping", { userId, incomingConvId });
      if (incomingConvId === conversationId && userId === selectedUser._id) {
        console.log("Set typing info:", { userId, conversationId });
        setTypingInfo({ userId, conversationId });
      }
    };

    const handleStopTyping = ({ userId, conversationId: incomingConvId }) => {
      console.log("handleStopTyping", { userId, incomingConvId });
      if (incomingConvId === conversationId && userId === selectedUser._id) {
        console.log("Clear typing info:", { userId, conversationId });
        clearTypingInfo();
      }
    };

    socket.on("userTyping", handleTyping);
    socket.on("userStoppedTyping", handleStopTyping);

    return () => {
      socket.off("userTyping", handleTyping);
      socket.off("userStoppedTyping", handleStopTyping);
    };
  }, [socket, selectedUser, conversationId, clearTypingInfo, setTypingInfo]);

  if (!selectedUser) return null;
  console.log("typing info", { typingInfo });

  const chatHeaderDropdownOptions = [
    {
      label: (
        <Link to="/create-group" className="flex items-center gap-2 w-full">
          <PlusCircle className="w-4 h-4" />
          <span className="">New Group</span>
        </Link>
      ),
    },
    {
      label: (
        <Link to="/" className="flex items-center gap-2 w-full">
          <Palette className="w-4 h-4" />
          <span className="">Chat Theme</span>
        </Link>
      ),
    },
    {
      label: (
        <Link to="/" className="flex items-center gap-2 w-full">
          <UserMinus2Icon className="w-4 h-4" color="red" />
          <span className="">Unfriend</span>
        </Link>
      ),
    },
  ];

  return (
    <>
      <div className="p-2.5 border-b border-base-300 bg-white/35">
        <div className="flex items-center justify-between">
          {/* Left Section: Avatar + User Info */}
          <div className="flex items-center gap-3">
            {/* Back button */}
            <button
              onClick={() => setSelectedUser(null)}
              aria-label="Close chat"
              className="ml-2  "
            >
              <ArrowLeft className="w-5 h-5 " strokeWidth={4} />
            </button>
            {/* Avatar */}
            <Link
              to={`/friendsProfile/${selectedUser._id}`}
              className="avatar rounded-full"
            >
              <img
                src={selectedUser.avatarUrl || "/Images/avatar.png"}
                alt="User Avatar"
                className="size-10 rounded-full object-cover"
              />
            </Link>
            {/* User Info */}
            <div>
              <h3 className="font-medium">{selectedUser.nickname}</h3>
              <p className="text-sm text-base-content/70">
                {typingInfo?.userId === selectedUser._id &&
                typingInfo?.conversationId === conversationId
                  ? "typing..."
                  : onlineUsersId.includes(selectedUser._id)
                  ? "Online"
                  : "Offline"}
              </p>
            </div>
          </div>

          {/* Right-side buttons */}
          <div className="flex items-center gap-2">
            <button
              aria-label="Start video chat"
              className="ml-3"
              onClick={() => handleCall("video")}
            >
              <VideoIcon className="w-5 h-5" />
            </button>
            <button
              aria-label="Start phone call"
              className="ml-3"
              onClick={() => handleCall("audio")}
            >
              <Phone className="w-[18px] h-[18px]" />
            </button>
            <Dropdown
              trigger={
                <div className="p-2 rounded-full hover:bg-white/10 transition cursor-pointer">
                  <EllipsisVertical className="w-5 h-5" />
                </div>
              }
              options={chatHeaderDropdownOptions}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatHeader;
