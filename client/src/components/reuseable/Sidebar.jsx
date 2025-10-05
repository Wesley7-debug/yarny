import { useState, useEffect } from "react";
import friendsStore from "../../store/friendsStore";
import messageStore from "../../store/messageStore";
import SearchInput from "./SearchInput";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import GroupTab from "./GroupTab";

const Sidebar = () => {
  const {
    friends,
    isGettingUsersFriends,
    listenForOnlineUsers,
    getAllUserFriends,
    onlineUsersId,
  } = friendsStore();

  const { selectedUser, setSelectedUser } = messageStore();

  const [chatTab, setChatTab] = useState("all"); // "all", "unread", "favourites", "groups"

  useEffect(() => {
    listenForOnlineUsers();
    getAllUserFriends();
  }, [getAllUserFriends, listenForOnlineUsers]);

  const filteredFriends = (() => {
    switch (chatTab) {
      case "unread":
        return friends.filter((f) => f.unreadCount > 0);
      case "favourites":
        return friends.filter((f) => f.isFavourite);
      case "all":
      default:
        return friends;
    }
  })();

  return (
    <aside className="h-full w-full pt-15 lg:w-72 border-r border-purple-800 flex flex-col transition-all duration-200 bg-white text-purple-800">
      <div className="w-full text-start px-4">
        <h1 className="text-3xl font-extrabold mb-3">Chats</h1>

        {/* Tabs */}
        <div className="flex gap-3 mb-4 text-center overflow-x-hidden w-full">
          {["all", "unread", "groups"].map((tab) => (
            <button
              key={tab}
              onClick={() => setChatTab(tab)}
              className={`px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                chatTab === tab
                  ? "bg-purple-700 text-white border border-purple-700"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mb-3">
        <SearchInput onSearch={(query) => console.log("Searching:", query)} />
      </div>

      <div className="overflow-y-auto w-full flex-1 px-2">
        {chatTab === "groups" ? (
          <GroupTab />
        ) : isGettingUsersFriends ? (
          <SidebarSkeleton />
        ) : filteredFriends.length === 0 ? (
          <div className="text-center text-purple-400 py-6">
            No friends found.
          </div>
        ) : (
          filteredFriends.map((user) => (
            <button
              key={user._id}
              onClick={() =>
                setSelectedUser(user._id === selectedUser?._id ? null : user)
              }
              className={`w-full px-4 py-3 flex items-center justify-between gap-3 rounded-lg transition-colors cursor-pointer ${
                selectedUser?._id === user._id
                  ? "bg-purple-700 text-white"
                  : "hover:bg-purple-100 text-purple-800"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative flex-shrink-0">
                  <img
                    src={user.avatarUrl || "/Images/avatar.png"}
                    alt={user.name}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  {onlineUsersId.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="min-w-0 text-left">
                  <div className="font-semibold truncate">{user.nickname}</div>
                  <div className="text-sm text-purple-500 truncate"></div>
                </div>
              </div>
              {/* You can add unread badges or other info here */}
            </button>
          ))
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
