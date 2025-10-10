import { useState } from "react";
import ChatActionBar from "../components/reuseable/ChatActionBar";
import Sidebar from "../components/reuseable/Sidebar";
import MessageContainer from "../components/reuseable/MessageContainer";
import NoChatSelected from "../components/reuseable/NoChatSelected";
import GroupChatMessgaeContainer from "../components/reuseable/GroupChatMessgaeContainer";
import MatchingHomeTab from "../components/reuseable/MatchingHomeTab";
import StatusTab from "../components/reuseable/StatusTab";
import FriendsTab from "../components/reuseable/FriendsTab";
import CallTab from "../components/reuseable/CallTab";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import useIsMobile from "../utils/useIsMobile";
import messageStore from "../store/messageStore";
import useGroupStore from "../store/groupStore";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const isMobile = useIsMobile();
  const { selectedUser } = messageStore();
  const { selectedGroup } = useGroupStore();
  const location = useLocation();

  // 👇 Set tab based on location state
  useEffect(() => {
    if (location.state?.goToChat) {
      setActiveTab("chats");
      return;
    }
    if (location.state?.goToStatus) {
      setActiveTab("status");
    }
  }, [location.state]);

  const renderChats = () => {
    if (isMobile) {
      if (selectedGroup)
        return <GroupChatMessgaeContainer group={selectedGroup} />;
      if (selectedUser) return <MessageContainer />;
      return <Sidebar />;
    }

    return (
      <>
        <Sidebar />
        {selectedGroup ? (
          <GroupChatMessgaeContainer group={selectedGroup} />
        ) : selectedUser ? (
          <MessageContainer />
        ) : (
          <NoChatSelected />
        )}
      </>
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "chats":
        return renderChats();
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
    <main className="h-screen w-full bg-base-200">
      {(isMobile ? !selectedUser && !selectedGroup : true) && (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:relative lg:z-0">
          <ChatActionBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      )}

      <section className="flex items-center justify-center h-screen p-2 lg:p-4 lg:ml-9">
        <div className="w-full h-screen max-w-[1600px] rounded-xl bg-base-100 shadow-xl overflow-x-hidden overflow-y-auto">
          <div className="flex h-full flex-col lg:flex-row">
            {renderActiveTab()}
          </div>
        </div>
      </section>
    </main>
  );
}
