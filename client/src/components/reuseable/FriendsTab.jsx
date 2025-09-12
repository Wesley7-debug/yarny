import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { toast } from "react-toastify";

const friendRequests = [
  { id: 1, name: "Emily", avatar: "https://via.placeholder.com/150" },
  { id: 2, name: "Leo", avatar: "https://via.placeholder.com/150" },
];

const nearbyFriends = [
  {
    id: 3,
    name: "Nina",
    avatar: "https://via.placeholder.com/150",
    distance: 15,
    isFriend: false,
  },
  {
    id: 4,
    name: "Sam",
    avatar: "https://via.placeholder.com/150",
    distance: 40,
    isFriend: true,
  },
];

export default function FriendsTab() {
  const [friends, setFriends] = useState(nearbyFriends);

  const handleAddFriend = (id) => {
    setFriends((prev) =>
      prev.map((friend) =>
        friend.id === id ? { ...friend, isFriend: true } : friend
      )
    );
    toast.success("Friend request sent successfully!");
  };

  const handleRemoveFriend = (id) => {
    setFriends((prev) =>
      prev.map((friend) =>
        friend.id === id ? { ...friend, isFriend: false } : friend
      )
    );
    toast.info("Friend removed.");
  };

  return (
    <div className="bg-white w-full min-h-screen text-black p-6 md:p-10">
      <h2 className="text-2xl font-bold mb-6">Friends</h2>

      {/* Friend Requests */}
      <h3 className="text-lg text-gray-600 mb-4">Friend Requests</h3>
      <div className="space-y-4 mb-8">
        {friendRequests.map((request) => (
          <div
            key={request.id}
            className="flex flex-wrap items-center bg-gray-100 rounded-lg p-4 shadow-sm w-full"
          >
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-300 mr-4">
              <img
                src={request.avatar}
                alt={request.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-[120px]">
              <p className="font-semibold">{request.name}</p>
              <p className="text-sm text-gray-500">Wants to connect</p>
            </div>
            <button
              onClick={() => toast.success("Friend request accepted!")}
              className="bg-green-100 text-green-600 hover:bg-green-200 rounded-md px-3 py-2 transition"
            >
              <Plus size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Nearby Friends */}
      <h3 className="text-lg text-gray-600 mb-4">Friends within 100km</h3>
      <div className="space-y-4">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="flex flex-wrap md:flex-nowrap items-center bg-gray-100 rounded-lg p-4 shadow-sm w-full"
          >
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-300 mr-4 mb-2 md:mb-0">
              <img
                src={friend.avatar}
                alt={friend.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-[120px] mb-2 md:mb-0">
              <p className="font-semibold">{friend.name}</p>
              <p className="text-sm text-gray-500">{friend.distance} km away</p>
            </div>

            {/* Button Group Box */}
            <div className="flex border border-gray-300 rounded overflow-hidden">
              <button
                onClick={() => handleAddFriend(friend.id)}
                className={`px-3 py-2 transition ${
                  friend.isFriend
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-green-100 text-green-600 hover:bg-green-200"
                }`}
                disabled={friend.isFriend}
              >
                <Plus size={20} />
              </button>

              <button
                onClick={() => handleRemoveFriend(friend.id)}
                className={`px-3 py-2 transition ml-2 ${
                  friend.isFriend
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                disabled={!friend.isFriend}
              >
                <Minus size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
