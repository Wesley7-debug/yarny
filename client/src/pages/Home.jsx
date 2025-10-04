import { useState } from "react";
import ChatActionBar from "../components/reuseable/ChatActionBar";
import Sidebar from "../components/reuseable/Sidebar";
import MessageContainer from "../components/reuseable/MessageContainer";
import NoChatSelected from "../components/reuseable/NoChatSelected";
import useIsMobile from "../utils/useIsMobile";
import StatusTab from "../components/reuseable/StatusTab";
import FriendsTab from "../components/reuseable/FriendsTab";
import CallTab from "../components/reuseable/CallTab";
import MatchingHomeTab from "../components/reuseable/MatchingHomeTab";
import messageStore from "../store/messageStore";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home"); // Default to "home" tab
  const isMobile = useIsMobile();
  const { selectedUser } = messageStore();

  // Determine what to render based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "chats":
        if (isMobile) {
          return selectedUser ? <MessageContainer /> : <Sidebar />;
        } else {
          return (
            <>
              <Sidebar />
              {selectedUser ? <MessageContainer /> : <NoChatSelected />}
            </>
          );
        }
      case "home":
        return <MatchingHomeTab />;

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
      {!selectedUser && (
        <ChatActionBar activeTab={activeTab} onTabChange={setActiveTab} />
      )}

      <div className="flex items-center justify-center  h-full">
        <div className="bg-base-100 rounded-lg shadow-cl w-full h-full py-3">
          <div className="flex h-full rounded-lg lg:ml-13">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
