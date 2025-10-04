import { Plus, Minus } from "lucide-react";
import { toast } from "react-toastify";

const friendRequests = [
  { id: 1, name: "Emily", avatar: "https://via.placeholder.com/150" },
  { id: 2, name: "Leo", avatar: "https://via.placeholder.com/150" },
];

export default function FriendsTab() {
  return (
    <div className="bg-white w-full min-h-screen text-black p-6 pt-15 md:p-10">
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
    </div>
  );
}
