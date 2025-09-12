import { useState } from "react";
import ChatActionBar from "../components/reuseable/ChatActionBar";
import Sidebar from "../components/reuseable/Sidebar";
import MessageContainer from "../components/reuseable/MessageContainer";
import NoChatSelected from "../components/reuseable/NoChatSelected";
import useIsMobile from "../utils/useIsMobile";
import StatusTab from "../components/reuseable/StatusTab";
import FriendsTab from "../components/reuseable/FriendsTab";
import CallTab from "../components/reuseable/CallTab";

export default function Home() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("chats");
  const isMobile = useIsMobile();

  const dummyUsers = [
    {
      _id: "1",
      fullName: "Alice Johnson",
      profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
      lastMessage: "Hey, how are you?",
      unreadCount: 2,
    },
    {
      _id: "2",
      fullName: "Bob Smith",
      profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
      lastMessage: "Let's meet tomorrow.",
      unreadCount: 0,
    },
    {
      _id: "3",
      fullName: "Charlie Adams",
      profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
      lastMessage: "Sure, no problem!",
      unreadCount: 5,
    },
    {
      _id: "4",
      fullName: "Diana Prince",
      profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
      lastMessage: "Thanks!",
      unreadCount: 0,
    },
  ];

  const onlineUsers = ["1", "3"];

  // Determine what to render based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "chats":
        if (isMobile) {
          return selectedUser ? (
            <MessageContainer
              user={selectedUser}
              onlineUsers={onlineUsers}
              setSelectedUser={setSelectedUser}
            />
          ) : (
            <Sidebar
              users={dummyUsers}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
          );
        } else {
          return (
            <>
              <Sidebar
                users={dummyUsers}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
              />
              {selectedUser ? (
                <MessageContainer
                  user={selectedUser}
                  onlineUsers={onlineUsers}
                  setSelectedUser={setSelectedUser}
                />
              ) : (
                <NoChatSelected />
              )}
            </>
          );
        }

      case "status":
        return <StatusTab />;

      case "friends":
        return <FriendsTab />;

      case "calls":
        return <CallTab />;

      default:
        return null;
    }
  };

  return (
    <div className="h-screen">
      <ChatActionBar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex items-center justify-center pt-20">
        <div className="bg-base-100 rounded-lg shadow-cl w-full h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg lg:ml-13">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
