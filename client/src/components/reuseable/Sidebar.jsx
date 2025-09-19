import { Users } from "lucide-react";
import SearchInput from "./SearchInput";
import Cards from "./Cards";
import friendsStore from "../../store/friendsStore";
import messageStore from "../../store/messageStore";

const Sidebar = () => {
  const { friends, isGettingFriend } = friendsStore();
  const { selectedUser, setSelectedUser } = messageStore();

  if (isGettingFriend) {
    return <div>Loading...</div>;
  }

  return (
    <aside className="h-full w-full lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="w-full text-start ">
        <h1 className="text-3xl font-bold ml-3 mb-2">Chats</h1>
      </div>
      <div className="px-4 py-2 mb-2">
        <SearchInput onSearch={(query) => console.log("Searching:", query)} />
      </div>
      <Cards />

      <div className="overflow-y-auto w-full py-3">
        {friends.map((user) => (
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
                  src={user.profilePic || "/images/avatar.png"}
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full"
                />
              </div>

              {/* Name and last message */}
              <div className="min-w-0 text-left">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400 truncate">
                  {user.lastMessage}
                </div>
              </div>
            </div>

            {/* Unread badge */}
            {user.unreadCount > 0 && (
              <div className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5 font-semibold">
                {user.unreadCount}
              </div>
            )}
          </button>
        ))}

        {friends.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
