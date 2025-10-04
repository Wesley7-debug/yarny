import { Users } from "lucide-react";
import SearchInput from "./SearchInput";
import Cards from "./Cards";
import friendsStore from "../../store/friendsStore";
import messageStore from "../../store/messageStore";
import ChatsListSkeleton from "./skeletons/ChatSkeleton";
import { useEffect } from "react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";

const Sidebar = () => {
  const { friends, isGettingUsersFriends, getAllUserFriends, onlineUsersId } =
    friendsStore();
  const { selectedUser, setSelectedUser } = messageStore();

  useEffect(() => {
    getAllUserFriends(); // <-- This triggers the fetch
  }, [getAllUserFriends]);

  return (
    <aside className="h-full w-full pt-15 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="w-full text-start ">
        <h1 className="text-3xl font-bold ml-3 mb-2">Chats</h1>
      </div>
      <div className="px-4 py-2 mb-2">
        <SearchInput onSearch={(query) => console.log("Searching:", query)} />
      </div>
      <Cards />

      <div className="overflow-y-auto w-full py-3">
        {isGettingUsersFriends ? (
          <SidebarSkeleton />
        ) : (
          friends.map((user) => (
            <button
              key={user._id}
              onClick={() =>
                setSelectedUser(user._id === selectedUser?._id ? null : user)
              }
              className={`w-full p-3 flex items-center justify-between gap-3 hover:bg-base-300 transition-colors cursor-pointer ${
                selectedUser?._id === user._id ? "bg-gray-200" : ""
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar with online badge */}
                <div className="relative flex-shrink-0">
                  <img
                    src={user.avatarUrl || "/Images/avatar.png"} // your schema uses avatarUrl
                    alt={user.name} // use `name`
                    className="size-12 object-cover rounded-full"
                  />
                </div>

                {/* Name and last message */}
                <div className="min-w-0 text-left">
                  <div className="font-medium truncate">{user.nickname}</div>{" "}
                  {/* was fullName */}
                  <div className="text-sm text-zinc-400 truncate"></div>
                </div>
              </div>
              {onlineUsersId.includes(user._id) && (
                <span className="online-tag">Online</span>
              )}

              {/* Unread badge */}

              {/* You can add this only if you have unreadCount in your data */}
            </button>
          ))
        )}

        {/* {friends.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )} */}
      </div>
    </aside>
  );
};

export default Sidebar;
